angular.module('admin', [
    'ui.router'
]);
angular.module('admin').config(function() {

});
angular.module('admin').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    'use strict';

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('chat', {
            url: '',
            templateUrl: 'navigation.html',
            abstract: true
        })
        .state('chat.home', {
            url: '/',
            controller: 'HomeCtrl',
            controllerAs: 'ctrl',
            templateUrl: 'apps/home/home.html'
        });
}]);
angular.module('admin').controller('HomeCtrl', ["$scope", "$http", "$interval", "$anchorScroll", "$location", function($scope, $http, $interval, $anchorScroll, $location) {
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
}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkbWluLm1vZHVsZS5qcyIsImFkbWluLmNvbmZpZy5qcyIsImFkbWluLnJvdXRlcy5qcyIsImFwcHMvaG9tZS9ob21lLmNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsUUFBUSxPQUFPLFNBQVM7SUFDcEI7R0FDRDtBQ0ZILFFBQVEsT0FBTyxTQUFTLE9BQU8sV0FBVzs7R0FFdkM7QUNGSCxRQUFRLE9BQU8sU0FBUyxnREFBTyxTQUFTLGdCQUFnQixvQkFBb0I7SUFDeEU7O0lBRUEsbUJBQW1CLFVBQVU7O0lBRTdCO1NBQ0ssTUFBTSxRQUFRO1lBQ1gsS0FBSztZQUNMLGFBQWE7WUFDYixVQUFVOztTQUViLE1BQU0sYUFBYTtZQUNoQixLQUFLO1lBQ0wsWUFBWTtZQUNaLGNBQWM7WUFDZCxhQUFhOztJQUV0QjtBQ2pCSCxRQUFRLE9BQU8sU0FBUyxXQUFXLDJFQUFZLFNBQVMsUUFBUSxPQUFPLFdBQVcsZUFBZSxXQUFXO0lBQ3hHOztJQUVBLElBQUksT0FBTzs7SUFFWCxLQUFLLFVBQVU7O0lBRWYsS0FBSyxTQUFTOztJQUVkLEtBQUssY0FBYzs7SUFFbkIsS0FBSyxXQUFXOztJQUVoQixLQUFLLGVBQWUsV0FBVztRQUMzQixNQUFNLEtBQUssbUJBQW1CLEtBQUssUUFBUTtZQUN2QyxTQUFTLE1BQU07Z0JBQ1gsS0FBSyxTQUFTLEtBQUs7Z0JBQ25CLEtBQUs7Z0JBQ0wsS0FBSzs7WUFFVCxTQUFTLE1BQU07Z0JBQ1gsSUFBSSxLQUFLLFVBQVUsS0FBSztvQkFDcEIsS0FBSyxRQUFROzs7Ozs7SUFNN0IsS0FBSyxjQUFjLFdBQVc7UUFDMUIsS0FBSyxRQUFRO1FBQ2IsTUFBTSxJQUFJLG1CQUFtQjtZQUN6QixTQUFTLE1BQU07Z0JBQ1gsS0FBSyxVQUFVLEtBQUs7Ozs7O0lBS2hDLEtBQUssV0FBVyxXQUFXO1FBQ3ZCLElBQUksTUFBTSxxQ0FBcUMsS0FBSyxPQUFPO1FBQzNELEtBQUssU0FBUyxJQUFJLFVBQVU7O1FBRTVCLEtBQUssT0FBTyxZQUFZLEtBQUs7O1FBRTdCLEtBQUssT0FBTyxTQUFTLFdBQVc7WUFDNUIsS0FBSyxZQUFZOzs7UUFHckIsS0FBSyxPQUFPLFVBQVUsV0FBVztZQUM3QixLQUFLLFlBQVk7Ozs7SUFJekIsS0FBSyxpQkFBaUIsU0FBUyxTQUFTO1FBQ3BDLElBQUksT0FBTyxLQUFLLE1BQU0sUUFBUTtRQUM5QixRQUFRLElBQUksYUFBYTtRQUN6QixLQUFLLFNBQVMsS0FBSztRQUNuQixPQUFPO1FBQ1AsY0FBYzs7O0lBR2xCLEtBQUssY0FBYyxXQUFXO1FBQzFCLElBQUksT0FBTyxDQUFDLEtBQUssS0FBSyxPQUFPLElBQUksTUFBTSxLQUFLO1FBQzVDLFFBQVEsSUFBSSxTQUFTO1FBQ3JCLElBQUksTUFBTSxLQUFLLFVBQVU7UUFDekIsS0FBSyxPQUFPLEtBQUs7UUFDakIsS0FBSyxjQUFjOzs7SUFHdkIsSUFBSSxPQUFPO1FBQ1AsaUJBQWlCLE9BQU8sT0FBTyxRQUFRLE1BQU0sZUFBZSxNQUFNLE9BQU8sT0FBTyxXQUFXOzs7SUFHL0YsS0FBSyxjQUFjLFdBQVc7UUFDMUIsVUFBVSxXQUFXO1lBQ2pCLElBQUksSUFBSSxLQUFLLE1BQU0sS0FBSyxXQUFXLEtBQUs7WUFDeEMsSUFBSSxPQUFPLENBQUMsS0FBSyxLQUFLLE9BQU8sSUFBSSxNQUFNLEtBQUs7WUFDNUMsSUFBSSxNQUFNLEtBQUssVUFBVTtZQUN6QixLQUFLLE9BQU8sS0FBSztXQUNsQixLQUFLOztJQUViIiwiZmlsZSI6ImFkbWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2FkbWluJywgW1xuICAgICd1aS5yb3V0ZXInXG5dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYWRtaW4nKS5jb25maWcoZnVuY3Rpb24oKSB7XG5cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhZG1pbicpLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLnN0YXRlKCdjaGF0Jywge1xuICAgICAgICAgICAgdXJsOiAnJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbmF2aWdhdGlvbi5odG1sJyxcbiAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnY2hhdC5ob21lJywge1xuICAgICAgICAgICAgdXJsOiAnLycsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcHMvaG9tZS9ob21lLmh0bWwnXG4gICAgICAgIH0pO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FkbWluJykuY29udHJvbGxlcignSG9tZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRodHRwLCAkaW50ZXJ2YWwsICRhbmNob3JTY3JvbGwsICRsb2NhdGlvbikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYucGxheWVycyA9IFtdO1xuXG4gICAgc2VsZi5wbGF5ZXIgPSB7fTtcblxuICAgIHNlbGYubWVzc2FnZVRleHQgPSB1bmRlZmluZWQ7XG5cbiAgICBzZWxmLm1lc3NhZ2VzID0gW107XG5cbiAgICBzZWxmLmNyZWF0ZVBsYXllciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3YxL3BsYXllcnMnLCBzZWxmLnBsYXllcikudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uKHJlc3ApIHtcbiAgICAgICAgICAgICAgICBzZWxmLnBsYXllciA9IHJlc3AuZGF0YTtcbiAgICAgICAgICAgICAgICBzZWxmLmxvYWRQbGF5ZXJzKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5vcGVuQ2hhdCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKHJlc3ApIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcC5zdGF0dXMgPT0gNDA5KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZXJyb3IgPSBcIk5pY2sgaXMgaW4gdXNlLCBwbGVhc2UgcGljayBhbm90aGVyXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICBzZWxmLmxvYWRQbGF5ZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYuZXJyb3IgPSB1bmRlZmluZWQ7XG4gICAgICAgICRodHRwLmdldCgnL2FwaS92MS9wbGF5ZXJzJykudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uKHJlc3ApIHtcbiAgICAgICAgICAgICAgICBzZWxmLnBsYXllcnMgPSByZXNwLmRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHNlbGYub3BlbkNoYXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHVybCA9ICd3czovL2xvY2FsaG9zdDo1MDAwL2FwaS92MS9jaGF0LycgKyBzZWxmLnBsYXllci5pZDtcbiAgICAgICAgc2VsZi5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KHVybCk7XG5cbiAgICAgICAgc2VsZi5zb2NrZXQub25tZXNzYWdlID0gc2VsZi5yZWNlaXZlTWVzc2FnZTtcblxuICAgICAgICBzZWxmLnNvY2tldC5vbm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLnNvY2tldC5vbmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLmNvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBzZWxmLnJlY2VpdmVNZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3JlY2VpdmVkICcsIGRhdGEpO1xuICAgICAgICBzZWxmLm1lc3NhZ2VzLnB1c2goZGF0YSk7XG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgJGFuY2hvclNjcm9sbChcImJvdHRvbVwiKTtcbiAgICB9O1xuXG4gICAgc2VsZi5zZW5kTWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHtpZCA6IHNlbGYucGxheWVyLmlkLCB0ZXh0OiBzZWxmLm1lc3NhZ2VUZXh0fTtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbnQgJywgZGF0YSk7XG4gICAgICAgIHZhciBzdHIgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgc2VsZi5zb2NrZXQuc2VuZChzdHIpO1xuICAgICAgICBzZWxmLm1lc3NhZ2VUZXh0ID0gJyc7XG4gICAgfTtcblxuICAgIHZhciBzcGFtID0gW1xuICAgICAgICAnaG93IHlvdSBkb2luZycsICdzdXAnLCAnIT8hJywgJ3doeT8nLCAnb2snLCBcInN1cmUgSSBjYW4hXCIsICdoaScsICdieWUnLCAneWVhJywgJ3doeSBub3QnLCAnb2ssIGJ1dCdcbiAgICBdO1xuXG4gICAgc2VsZi5zcGFtTWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNwYW0ubGVuZ3RoKTtcbiAgICAgICAgICAgIHZhciBkYXRhID0ge2lkIDogc2VsZi5wbGF5ZXIuaWQsIHRleHQ6IHNwYW1baV19O1xuICAgICAgICAgICAgdmFyIHN0ciA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgICAgICAgICAgc2VsZi5zb2NrZXQuc2VuZChzdHIpO1xuICAgICAgICB9LCA1MDAsIDEwKTtcbiAgICB9O1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
