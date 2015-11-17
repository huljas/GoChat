package main

import (
	"github.com/gin-gonic/gin"
)

// Binding from JSON
func main() {
	router := gin.Default()

    // player_handlers.go
	BindPlayerRoutes(router)

    // chat_handlers.go
	BindChatRoutes(router)

    // static routes for the webfe
	router.StaticFile("/", "./webfe/dist/index.html")
	router.Static("/js", "./webfe/dist/js")
	router.Static("/css", "./webfe/dist/css")
	router.Static("/fonts", "./webfe/dist/fonts")

    // start serving chat messages
	go chat.run()

	// Listen and server on 0.0.0.0:8080
	router.Run(":5000")
}
