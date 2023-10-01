package project

import (
	"context"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// add project to a user
func AddProject(c *fiber.Ctx, client *mongo.Client) error {
	// Retrieve the "id" request parameter
	id := c.Params("id")

	// Parse the request body into a map
	body := make(map[string]interface{})
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	fmt.Println("ID:", id)
	fmt.Println("Body:", body)

	// Access the "users" collection
	collection := client.Database("developersHub").Collection("devs")

	// Define a filter to find the user by id
	filter := bson.M{"github": id}

	// Define an update to add the project to the user's projects
	update := bson.M{"$push": bson.M{"projects": body}}

	// Update the user document to add the project
	updateResult, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to add project"})
	}

	// Check if the update was successful
	if updateResult.ModifiedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "User not found"})
	}

	return c.JSON(fiber.Map{"message": "Project added to user's projects"}) // Modify the response as needed
}

// deleteProject deletes a project from a user's projects
func DeleteProject(c *fiber.Ctx, client *mongo.Client) error {
	// Retrieve the "id" request parameter
	id := c.Params("id")

	// Parse the request body into a map
	body := make(map[string]interface{})
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	fmt.Println("ID:", id)
	fmt.Println("Body:", body)

	// Access the "users" collection
	collection := client.Database("developersHub").Collection("devs")

	// Define a filter to find the user by id
	filter := bson.M{"github": id}

	// Define an update to remove the project from the user's projects
	update := bson.M{"$pull": bson.M{"projects": body}}

	// Update the user document to remove the project
	updateResult, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to delete project"})
	}

	// Check if the update was successful
	if updateResult.ModifiedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "User not found"})
	}

	return c.JSON(fiber.Map{"message": "Project deleted from user's projects"}) // Modify the response as needed
}
