package main

import (
	"context"
	"fmt"
	"log"

	"github.com/developersHub/auth"
	"github.com/developersHub/middleware"
	"github.com/developersHub/mongodb"
	"github.com/developersHub/project"
	"github.com/developersHub/user"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	app := fiber.New()
	// Enable CORS with default options
	app.Use(cors.New())

	// sub routes"/api"
	pvt := app.Group("/pvt")

	// Define a middleware function to handle CORS
	// corsMiddleware := func(c *fiber.Ctx) error {
	// 	c.Set("Access-Control-Allow-Origin", "*")
	// 	c.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
	// 	c.Set("Access-Control-Allow-Headers", "*")
	// 	return c.Next()
	// }

	// // Use the CORS middleware for all routes
	// app.Use(corsMiddleware)

	opts := options.Client().ApplyURI("mongodb+srv://anandarul47:anand@devs.kewxw5f.mongodb.net/?retryWrites=true&w=majority")

	// Create a new client and connect to the server
	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		panic(err)
	}
	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	//middlewares
	pvt.Use(middleware.VerifyToken(client))

	// check mongodb connection
	app.Get("/ping", func(c *fiber.Ctx) error {
		fmt.Println("Request received")
		return mongodb.MongoDBPingHandler(c, client)
	})

	// get user by id
	app.Get("/user/:id", func(c *fiber.Ctx) error {
		return user.UserFetch(c, client)
	})

	// github callback
	app.Get("/auth/github/callback", func(c *fiber.Ctx) error {
		return auth.GithubAuthCallback(c, client)
	})

	// github auth
	app.Get("/auth/github", func(c *fiber.Ctx) error {
		return auth.GithubAuth(c, client)
	})

	// login
	app.Get("/auth/login", func(c *fiber.Ctx) error {
		return auth.Login(c, client)
	})

	// add project
	pvt.Post("/addProject/:id", func(c *fiber.Ctx) error {
		return project.AddProject(c, client)
	})

	// delete project
	pvt.Post("/deleteProject/:id", func(c *fiber.Ctx) error {
		return project.DeleteProject(c, client)
	})

	// add user
	app.Post("/addUser", func(c *fiber.Ctx) error {
		return user.AddUser(c, client)
	})

	// update user
	pvt.Post("/updateUser", func(c *fiber.Ctx) error {
		return user.UpdateUser(c, client)
	})

	// Start the Fiber server
	err = app.Listen(":3000")
	if err != nil {
		log.Fatal(err)
	}
}
