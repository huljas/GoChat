package main

import (
	"github.com/gin-gonic/gin"
)

// Binding from JSON
func main() {
	router := gin.Default()

    BindPlayerRoutes(router)

    router.StaticFile("/", "./dist/index.html")
    router.Static("/js", "./dist/js")
    router.Static("/css", "./dist/css")
    router.Static("/fonts", "./dist/fonts")

	// Listen and server on 0.0.0.0:8080
	router.Run(":5000")
}
