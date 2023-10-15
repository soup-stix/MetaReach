package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

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

func corsMiddleware(c *fiber.Ctx) error {
	c.Set("Access-Control-Allow-Credentials", "true")
	c.Set("Access-Control-Allow-Origin", "http://localhost:4200")
	c.Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
	c.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	// Handle preflight requests
	if c.Method() == "OPTIONS" {
		return c.SendStatus(fiber.StatusOK)
	}

	return c.Next()
}

func main() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "https://metareach.netlify.app",
		AllowCredentials: true,
	}))

	// sub routes"/api"
	pvt := app.Group("/pvt")

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

	pvt.Use(cors.New(cors.Config{
		AllowOrigins:     "https://metareach.netlify.app",
		AllowCredentials: true,
	}))
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

	// github callback signup
	app.Get("/auth/github/callback/signin", func(c *fiber.Ctx) error {
		return auth.GithubAuthCallbackLogin(c, client)
	})

	// github callback signup
	app.Get("/auth/github/callback/signup", func(c *fiber.Ctx) error {
		return auth.GithubAuthCallbackSignUp(c, client)
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
	pvt.Post("/addUser", func(c *fiber.Ctx) error {
		return user.AddUser(c, client)
	})

	// update user
	pvt.Post("/updateUser", func(c *fiber.Ctx) error {
		return user.UpdateUser(c, client)
	})

	// Define a route to handle the ping request
	app.Get("/active", func(c *fiber.Ctx) error {
		return c.SendString("Pong")
	})

	// Start the Fiber server
	go func() {
		if err := app.Listen(":3000"); err != nil {
			log.Fatalf("Error: %v", err)
		}
	}()

	// Periodic pinging every 5 minutes
	ticker := time.NewTicker(5 * time.Minute)
	for range ticker.C {
		pingSelf()
	}
}

func pingSelf() {
	resp, err := http.Get("http://localhost:3000/active")
	if err != nil {
		fmt.Printf("Failed to ping: %v\n", err)
		return
	}
	defer resp.Body.Close()

	fmt.Println("Ping successful")
}
