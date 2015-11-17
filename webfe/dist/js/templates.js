angular.module("admin").run(["$templateCache", function($templateCache) {$templateCache.put("navigation.html","<nav class=\"navbar navbar-default navbar-static-top main-nav\"><div class=container><div class=navbar-header><button type=button class=\"navbar-toggle collapsed\" data-toggle=collapse data-target=#navbar aria-expanded=false aria-controls=navbar><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a class=navbar-brand ui-sref=admin.home><i class=\"fa fa-commenting\"></i> Chat</a></div></div></nav><div class=container ui-view></div>");
$templateCache.put("apps/home/home.html","<div class=admin-home><div class=\"alert alert-info\" ng-show=ctrl.error>{{ ctrl.error }}</div><div ng-hide=ctrl.player.id><form class=\"form row\" ng-submit=ctrl.createPlayer()><div class=\"form-group col-xs-6\"><input type=text class=form-control id=nick placeholder=\"Give your nick\" ng-model=ctrl.player.nick></div><button type=button class=\"btn btn-success\" data-dismiss=modal ng-click=ctrl.createPlayer()>Continue</button></form></div><div ng-show=ctrl.player.id><h4>Welcome {{ ctrl.player.nick }} <i class=\"fa fa-link\" ng-show=ctrl.connected></i><i class=\"fa fa-chain-broken\" ng-hide=ctrl.connected></i></h4><div class=\"panel panel-default\"><div class=panel-heading>Players in chat</div><div class=panel-body><span ng-repeat=\"player in ctrl.players\" style=\"margin-right: 5px\">{{ player.nick }}</span></div></div><div class=\"panel panel-default\"><div class=panel-body><div style=\"height: 200px; overflow-y: auto;\"><div ng-repeat=\"message in ctrl.messages\" style=\"padding: 5px;\"><strong ng-class=\"{\'text-primary\': message.id == ctrl.player.id}\" style=\"width: 150px; text-align: right; margin-right: 5px; display: inline-block;\">{{ message.nick }}</strong> <span>{{ message.text }}</span></div><a id=bottom></a></div><form class=\"form row\" ng-submit=ctrl.sendMessage() style=\"margin-top: 9px;\"><div class=\"form-group col-xs-8\"><input type=text class=form-control id=message placeholder=\"Write something\" ng-model=ctrl.messageText></div><button type=button class=\"btn btn-success\" data-dismiss=modal ng-click=ctrl.sendMessage()>Send</button> <button type=button class=\"btn btn-danger\" data-dismiss=modal ng-click=ctrl.spamMessage()>Spam it!</button></form></div></div></div></div>");}]);