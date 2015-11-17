package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"net/http"
	"strconv"
)

func BindChatRoutes(router *gin.Engine) {
	router.GET("/api/v1/chat/:id", func(ctx *gin.Context) {
		id, err := strconv.Atoi(ctx.Param("id"))
		if err != nil {
			ctx.JSON(400, gin.H{"error": "Id is invalid"})
			return
		}
		player := playerService.Get(id)
		if player == nil {
			ctx.JSON(400, gin.H{"error": "Id is invalid"})
			return
		}
		wsConnectHandler(player, ctx.Writer, ctx.Request)
	})

}

var wsupgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func wsConnectHandler(player *Player, writer http.ResponseWriter, req *http.Request) {
	conn, err := wsupgrader.Upgrade(writer, req, nil)
	if err != nil {
		fmt.Println("Failed to set websocket upgrade: %+v", err)
		return
	}
	c := &Connection{Player: player, Out: make(chan []byte, 256), Conn: conn}
	chat.register <- c
	go c.write()
	c.read()
}
