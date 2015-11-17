package main

import (
	"encoding/json"
	"github.com/gorilla/websocket"
)

/**
 * Single client connection.
 */
type Connection struct {
	Player *Player

	// The websocket connection.
	Conn *websocket.Conn

	// Buffered channel of outbound messages.
	Out chan []byte
}

/**
 * Message object.
 */
type ChatMessage struct {
	Id   int    `json:"id"`
	Nick string `json:"nick"`
	Test string `json:"text"`
}

/**
 * Reads message from the websocket and pushes it to the chat broadcast channel.
 */
func (c *Connection) read() {
	defer func() {
		chat.unregister <- c
		c.Conn.Close()
	}()
	c.Conn.SetReadLimit(1024)
	for {
		_, bytes, err := c.Conn.ReadMessage()
		if err != nil {
			break
		}
		var message ChatMessage
		err = json.Unmarshal(bytes, &message)
		if err != nil {
			break
		}
		message.Nick = c.Player.Nick
		bytes, err = json.Marshal(message)
		chat.broadcast <- bytes
	}
}

/**
 * Writes messages from the Out channel to the websocket.
 */
func (c *Connection) write() {
	defer func() {
		c.Conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.Out:
			if !ok {
				return
			}
			if err := c.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
				return
			}
		}
	}
}

/**
 * Single chat session.
 */
type Chat struct {
	// Registered connections.
	connections map[*Connection]bool

	// Inbound messages from the connections.
	broadcast chan []byte

	// Register requests from the connections.
	register chan *Connection

	// Unregister requests from connections.
	unregister chan *Connection
}

/**
 * Reads events from the broadcast queue and pushes them to the connection out queues.
 */
func (chat *Chat) run() {
	for {
		select {
		case c := <-chat.register:
			chat.connections[c] = true
		case c := <-chat.unregister:
			if _, ok := chat.connections[c]; ok {
				delete(chat.connections, c)
				close(c.Out)
			}
		case m := <-chat.broadcast:
			for c := range chat.connections {
				select {
				case c.Out <- m:
				default:
					close(c.Out)
					delete(chat.connections, c)
				}
			}
		}
	}
}

var chat = Chat{
	broadcast:   make(chan []byte),
	register:    make(chan *Connection),
	unregister:  make(chan *Connection),
	connections: make(map[*Connection]bool),
}
