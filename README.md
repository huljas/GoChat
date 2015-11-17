# GoChat

Simple chat server written in Go.

Uses [Gin] web framework for REST APIs and [Gorilla Websocket] for websockets. The chat implementation is based on the
[chat example].

Comes with a simple AngularJS front end.

## Running it

Set go path

```sh
GOPATH=/path/to/the/gochat
```

Get the dependencies

```sh
go get github.com/gin-gonic/gin
go get github.com/gorilla/websocket
```

Build it

```sh
go install github.com/huljas/gochat
```

Run it

```sh
bin/gochat
```

Open your browser at [http://localhost:5000/](http://localhost:5000/). You can use multiple browser tabs to chat.

[Gin]: https://github.com/gin-gonic/gin
[Gorilla Websocket]: https://github.com/gorilla/websocket
[chat example]: https://github.com/gorilla/websocket/tree/master/examples/chat