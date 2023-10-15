package user

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// fetch user from mongodb
func UserFetch(c *fiber.Ctx, client *mongo.Client) error {
	// tokenString := c.Cookies("jwt_token")
	// fmt.Println("verify token request recieved, token: ", tokenString)

	// Retrieve the "id" request parameter
	id := c.Params("id")
	fmt.Println("id:", id)
	// Access the "users" collection
	collection := client.Database("developersHub").Collection("devs")

	// Define a filter for the query
	filter := bson.M{"github": id}

	// Find the user in MongoDB
	var user map[string]interface{}
	err := collection.FindOne(context.TODO(), filter).Decode(&user)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	// fmt.Println(user)

	return c.JSON(fiber.Map{"message": "User found", "data": user})
}

// update user details
func UpdateUser(c *fiber.Ctx, client *mongo.Client) error {
	fmt.Println("update user request recieved!!")
	// Parse the request body into a map
	body := make(map[string]interface{})
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Access the "users" collection
	collection := client.Database("developersHub").Collection("devs")

	// Check if a user with the same GitHub username already exists in MongoDB
	githubUsername := body["github"].(string) // Assuming GitHub username is stored in "github" field

	// Define a filter to find the user by GitHub username
	filter := bson.M{"github": githubUsername}

	// User with the same GitHub username already exists, update the user document
	update := bson.M{"$set": body}
	_, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to update user"})
	}

	return c.JSON(fiber.Map{"message": "User updated successfully"})
}

// addUser adds a user if it doesn't already exist with the same GitHub username
func AddUser(c *fiber.Ctx, client *mongo.Client) error {
	type User struct {
		GithubUsername string   `bson:"github"`
		Projects       []string `bson:"projects"`
		// Other user-related fields
	}

	// Parse the request body into a map
	body := make(map[string]interface{})
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Access the "users" collection
	collection := client.Database("developersHub").Collection("devs")

	// Check if a user with the same GitHub username already exists on GitHub
	githubUsername := body["github"].(string) // Assuming GitHub username is stored in "github" field

	// Define a filter to find the user by GitHub username
	filter := bson.M{"github": githubUsername}

	// Check if the user already exists in MongoDB
	existingUser := collection.FindOne(context.TODO(), filter)
	if existingUser.Err() == nil {
		// User with the same GitHub username already exists in MongoDB
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"message": "User with the same GitHub username already exists"})
	}

	// Prepare the GitHub API URL for the user
	apiURL := fmt.Sprintf("https://api.github.com/users/%s", githubUsername)

	// Create a new request
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to create GitHub API request"})
	}

	// Add authorization header with bearer token
	req.Header.Set("Authorization", "Bearer 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")

	// Make the request
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to make GitHub API request"})
	}
	defer resp.Body.Close()

	// Check if the GitHub user exists (HTTP status 200)
	if resp.StatusCode != http.StatusOK {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"message": "GitHub user does not exist"})
	}

	// User exists on GitHub, proceed to add the user to MongoDB
	body["projects"] = bson.A{}
	fmt.Println("Body:", body)

	user := User{
		GithubUsername: githubUsername,
		Projects:       []string{}, // Initialize as an empty slice
	}

	// Insert the user document
	_, err = collection.InsertOne(context.TODO(), user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to add user"})
	}

	return c.JSON(fiber.Map{"message": "User added successfully"}) // Modify the response as needed
}
