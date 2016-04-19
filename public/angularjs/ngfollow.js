

var follow = angular.module('follow', []);
follow.controller('follow', function($scope, $http) {
    $scope.active = true;
    $scope.followUser = function() {
       
        console.log("inside followUser");
        console.log(document.getElementById('username').value);
        $scope.active = true;
 
      
    }
  
});