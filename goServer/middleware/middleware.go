package middleware

import (
	"context"
	"fmt"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var jwtSecret = []byte("ijklwdhndkhgruiohkasuiweyf789")

// verify jwt token
func VerifyToken(client *mongo.Client) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// tokenString := c.Cookies("jwt_token", "")
		// fmt.Println("verify token request recieved, token: ", tokenString)

		// // If no token in cookies, proceed to the next middleware or route handler
		// if tokenString == "" {
		// 	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		// 		"error": "unauthorized",
		// 	})
		// }
		// Extract the Authorization header
		authorizationHeader := c.Get("Authorization")

		// Check if the Authorization header is present and has the Bearer prefix
		if authorizationHeader == "" || !strings.HasPrefix(authorizationHeader, "Bearer ") {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid or missing Authorization header",
			})
		}

		tokenString := strings.Replace(authorizationHeader, "Bearer ", "", 1)

		fmt.Println("Authorization header :", tokenString)

		// Decrypt the JWT token and extract the custom data
		data, err := decryptJWTToken(tokenString)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid token",
			})
		}

		username, ok := data["user"].(string)
		password, ok := data["password"].(string)

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

		return c.Next()
	}
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
