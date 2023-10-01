package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
)

// Oauth variables
var (
	oauthConfig = &oauth2.Config{
		ClientID:     "d020d5881a5ee1ad50e8",
		ClientSecret: "e0a42f7baac204998a59585512ab8e3c762a1318",
		RedirectURL:  "http://localhost:3000/auth/github/callback",
		Scopes:       []string{"user"},
		Endpoint:     github.Endpoint,
	}
)

// Secret key for JWT signing
var jwtSecret = []byte("ijklwdhndkhgruiohkasuiweyf789")

// github auth
func GithubAuth(c *fiber.Ctx, client *mongo.Client) error {
	url := oauthConfig.AuthCodeURL("state")
	fmt.Println("redirect url:", url)
	return c.Redirect(url, http.StatusTemporaryRedirect)
}

// github callback
func GithubAuthCallback(c *fiber.Ctx, client *mongo.Client) error {

	fmt.Println("callback recieved")
	code := c.Query("code")
	fmt.Println(code)
	token, err := oauthConfig.Exchange(c.Context(), code)
	fmt.Println("token:", token)
	if err != nil {
		// Handle the error and return an appropriate response
		errorMessage := fmt.Sprintf("Failed to exchange code for token: %v", err)
		return c.Status(http.StatusInternalServerError).SendString(errorMessage)
	}

	// get username
	githubUsername, err := getGitHubUsername(token.AccessToken)
	if err != nil {
		// Handle the error appropriately
		errorMessage := fmt.Sprintf("Failed to get GitHub username: %v", err)
		return c.Status(http.StatusInternalServerError).SendString(errorMessage)
	}

	Password, err := getPassword(githubUsername, client)
	if err != nil {
		// Handle the error appropriately
		errorMessage := fmt.Sprintf("Failed to get Password: %v", err)
		return c.Redirect("http://localhost:4200/profile/"+githubUsername, http.StatusTemporaryRedirect)
		return c.Status(http.StatusInternalServerError).SendString(errorMessage)
	}

	customJson := map[string]interface{}{
		"github":   token,
		"user":     githubUsername,
		"password": Password,
	}

	// Generate a JWT token
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"data": customJson,
	})

	// Sign the token with the secret key
	tokenString, err := jwtToken.SignedString(jwtSecret)
	if err != nil {
		return err // Handle the error appropriately
	}

	fmt.Println("JWT token to be set:", tokenString)

	// Set the token in an HTTP-only cookie
	cookie := fiber.Cookie{
		Name:     "jwt_token",
		Value:    tokenString,
		HTTPOnly: true,
	}
	c.Cookie(&cookie)

	// Redirect to your Angular application
	return c.Redirect("http://localhost:4200/profile/"+githubUsername, http.StatusTemporaryRedirect)
}

// login to send back user and token
func Login(c *fiber.Ctx, client *mongo.Client) error {
	tokenString := c.Cookies("jwt_token")

	// If no token in cookies, proceed to the next middleware or route handler
	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "unauthorized",
		})
	}

	// If no token in cookies, proceed to the next middleware or route handler
	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "unauthorized",
		})
	}

	// Decrypt the JWT token and extract the custom data
	data, err := decryptJWTToken(tokenString)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token",
		})
	}

	username, ok := data["user"].(string)
	password, ok := data["password"].(string)
	token, ok := data["github"]

	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token data",
		})
	}

	fmt.Println("Decrypted token data:", data)
	fmt.Println("Username and Password:", username, password)

	// Check the username and password against MongoDB data
	collection := client.Database("developersHub").Collection("credentials") // Replace with your actual DB and collection names
	filter := bson.M{"username": username, "password": password}
	count, err := collection.CountDocuments(context.TODO(), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Database error",
		})
	}

	if count == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid username or password",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"user":  username,
		"token": token,
	})
}

// get github username from token
func getGitHubUsername(accessToken string) (string, error) {
	// Create an HTTP client
	client := &http.Client{}

	// Create a request to get the authenticated user
	req, err := http.NewRequest("GET", "https://api.github.com/user", nil)
	if err != nil {
		return "", err
	}

	// Set the Authorization header with the access token
	req.Header.Set("Authorization", "Bearer "+accessToken)

	// Send the request
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Check the response status
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("GitHub API request failed with status: %v", resp.StatusCode)
	}

	// Decode the response body to extract the username
	var userData map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&userData)
	if err != nil {
		return "", err
	}

	username, ok := userData["login"].(string)
	if !ok {
		return "", fmt.Errorf("Failed to extract GitHub username from API response")
	}

	return username, nil
}

// get password from db for the username
func getPassword(username string, client *mongo.Client) (string, error) {
	// Access the MongoDB collection
	collection := client.Database("developersHub").Collection("credentials")

	// Create a filter for the specified username
	filter := bson.M{"username": username}

	// Retrieve the document
	var result bson.M
	err := collection.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		return "", fmt.Errorf("failed to find document: %v", err)
	}

	// Extract the password from the result
	password, ok := result["password"].(string)
	if !ok {
		return "", fmt.Errorf("password not found for username: %s", username)
	}

	return password, nil
}

// decrypt jwt token
func decryptJWTToken(tokenString string) (map[string]interface{}, error) {
	// Parse the JWT token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Access the custom JSON data from the claims
		data, ok := claims["data"].(map[string]interface{})
		if !ok {
			return nil, fmt.Errorf("custom data not found in token")
		}

		return data, nil
	}

	return nil, fmt.Errorf("invalid token")
}
