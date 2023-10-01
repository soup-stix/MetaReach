package mongodb

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// MongoDBPingHandler is a handler function to ping MongoDB
func MongoDBPingHandler(c *fiber.Ctx, client *mongo.Client) error {
	// Send a ping to MongoDB
	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Err(); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to ping MongoDB")
	}

	return c.SendString("Pinged your deployment. You successfully connected to MongoDB!")
}
