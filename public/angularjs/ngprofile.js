

var app = angular.module('profile', []);
app.controller('profile', function($scope, $http) {
   
	$http({
    	method : "get",
		url : '/getProfile',
    }).then(function(res){
    	//alert(res.data.tweets);
    	$scope.tweetDiv = true;
    	$scope.followersDiv= false;
    	$scope.followingDiv = false;
    	$scope.bioDiv = true;
    	console.log("tweets are:::"+res.data.tweets);
    	$scope.allTweets = res.data.tweets;
    	$scope.hashtags = res.data.hashtags;
    	$scope.suggestedUsers = res.data.suggestedUsers;
    	$scope.Info = res.data.userInfo;
    	$scope.followers = res.data.followers;
    	$scope.following = res.data.following;
    	$scope.followingList = res.data.followingList;
    	$scope.followersList = res.data.followersList;
    	$scope.numOfTweets = res.data.numTweets;
    	
    	console.log($scope.Info);
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
	    
//	    	alert("inserted!");
	    	
	    	window.location.assign('/profile');
	    		});
	   
	  
   };
   
   $scope.relatedTweets = function(hashtag){
	   console.log(hashtag);
	 
	   $http({
	    	method : "POST",
			url : '/relatedTweets',
			data: {
				"hashTag" : hashtag
			}
	    });
	   
	  
   };
   
   $scope.backtoHome = function(){
	   
	   window.loaction.assign('/redirectToHome');
   };
   
   $scope.logout = function(){
	   
		 console.log("inside logout");
		   $http({
		   method : "POST",
			url : '/logout',
			data: {
				
			}
	    }).then(function(res){
	    	window.location.assign('/signin');
		    });
	  }
   
   
});
