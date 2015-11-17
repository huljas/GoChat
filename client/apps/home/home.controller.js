angular.module('admin').controller('HomeCtrl', function($scope, $http, $interval, $anchorScroll, $location) {
    'use strict';

    var self = this;

    self.players = [];

    self.player = {};

    self.messageText = undefined;

    self.messages = [];

    self.createPlayer = function() {
        $http.post('/api/v1/players', self.player).then(
            function(resp) {
                self.player = resp.data;
                self.loadPlayers();
                self.openChat();
            },
            function(resp) {
                if (resp.status == 409) {
                    self.error = "Nick is in use, please pick another";
                }
            }
        );
    };

    self.loadPlayers = function() {
        self.error = undefined;
        $http.get('/api/v1/players').then(
            function(resp) {
                self.players = resp.data;
            }
        );
    };

    self.openChat = function() {
        var url = 'ws://localhost:5000/api/v1/chat/' + self.player.id;
        self.socket = new WebSocket(url);

        self.socket.onmessage = self.receiveMessage;

        self.socket.onopen = function() {
            self.connected = true;
        };

        self.socket.onclose = function() {
            self.connected = false;
        };
    };

    self.receiveMessage = function(message) {
        var data = JSON.parse(message.data);
        console.log('received ', data);
        self.messages.push(data);
        $scope.$apply();
        $anchorScroll("bottom");
    };

    self.sendMessage = function() {
        var data = {id : self.player.id, text: self.messageText};
        console.log('sent ', data);
        var str = JSON.stringify(data);
        self.socket.send(str);
        self.messageText = '';
    };

    var spam = [
        'how you doing', 'sup', '!?!', 'why?', 'ok', "sure I can!", 'hi', 'bye', 'yea', 'why not', 'ok, but'
    ];

    self.spamMessage = function() {
        $interval(function() {
            var i = Math.floor(Math.random() * spam.length);
            var data = {id : self.player.id, text: spam[i]};
            var str = JSON.stringify(data);
            self.socket.send(str);
        }, 500, 10);
    };
});