# Admin 

## Setting up

You will need [node.js and npm](http://nodejs.org).

Install `gulp`:

```sh
$ npm install -g gulp
```

First install dependencies

```sh
$ npm install
```

## Development

To build and watch changes in development mode

```sh
$ gulp
```

To access application, use for example python http server:

```sh
$ python -m SimpleHTTPServer
```

and open app in browser from `localhost:8000/dist/`

## Build

To build a production version:

```sh
$ gulp build
```

Production version is build in `dist` folder.
