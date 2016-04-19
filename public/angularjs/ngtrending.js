

var app = angular.module('profile', []);
app.controller('profile', function($scope, $http) {
   
	$http({
    	method : "get",
		url : '/getProfile',
    }).then(function(res){
    	//alert(res.data.tweets);
    	$scope.tweetPart = true;
    	$scope.followingPart = false;
    	$scope.followersPart = false;
    	$scope.tweets = res.data.tweets;
    	$scope.hashtags = res.data.hashtags;
    	$scope.suggestedUsers = res.data.suggestedUsers;
    	$scope.userInfo = res.data.userInfo;
    	$scope.followers = res.data.followers;
    	$scope.following = res.data.following;
    	$scope.followingList = res.data.followingList;
    	$scope.followersList = res.data.followersList;
    	
    	console.log($scope.userInfo);
    	console.log($scope.followers);
    	console.log($scope.following);
    });
	
   $scope.follow = function(abc){
	   console.log(abc);
	 
	   $http({
	    	method : "POST",
			url : '/follow',
			data: {
				"username" : abc
			}
	    }).then(function(res){
	    
	    	alert("inserted!");
	    });
	   
	  
   };
});
