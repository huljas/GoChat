package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

func BindPlayerRoutes(router *gin.Engine) {
	router.GET("/api/v1/players", GetPlayers)
	router.POST("/api/v1/players", CreatePlayer)
	router.PUT("/api/v1/players/:id", UpdatePlayer)
}

func GetPlayers(ctx *gin.Context) {
	players := playerService.List()
	ctx.JSON(http.StatusOK, players)
}

func CreatePlayer(ctx *gin.Context) {
	var player Player
	ctx.Bind(&player)
	result := playerService.Create(player.Nick)
	if result != nil {
		ctx.JSON(201, result)
	} else {
		ctx.JSON(409, gin.H{"error": "Player already exists"})
	}
}

func UpdatePlayer(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Id is invalid"})
	} else {
		var player Player
		ctx.Bind(&player)
		result := playerService.Update(id, player.Nick)
		if result != nil {
			ctx.JSON(200, result)
		} else {
			ctx.JSON(404, gin.H{"error": "Player not found"})
		}
	}
}
