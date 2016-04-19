

var app = angular.module('myTweet', []);
app.controller('myTweet', function($scope, $http) {
   
	$http({
    	method : "get",
		url : '/onLoadData',
    }).then(function(res){
    	//alert(res.data.tweets);
    	$scope.showFeed = true;
    	$scope.displaySearchResults =false;
    	$scope.allTweets = res.data.tweets;
    	$scope.hashtags = res.data.hashtags;
    	$scope.suggestedUsers = res.data.suggestedUsers;
    	$scope.Info = res.data.userInfo;
    	$scope.followers = res.data.followers;
    	$scope.following = res.data.following;
    	$scope.numOfTweets = res.data.numTweets;
    	console.log($scope.Info);
    	console.log($scope.followers);
    	console.log($scope.following);
    });
	
   $scope.follow = function(email){
	   console.log(email);
	 
	   $http({
	    	method : "POST",
			url : '/follow',
			data: {
				"Email" : email
			}
	    }).then(function(res){
//	    
//	    	alert("inserted!");
	    	window.location.assign('/home');
	    });
   }
   
  $scope.hashSearch= function(){
	   
	 console.log("inside hashSearch");
	   $http({
	    	method : "POST",
		url : '/searchHash',
		data: {
			"Hash" : $scope.searchHash,
		}
    }).then(function(res){
    	$scope.searchTweets = res.data.searchTweets;
	    	$scope.showFeed = false ;
    	$scope.displaySearchResults =true;
	    });
  }
  
  $scope.logout = function(){
	   
		 console.log("inside logout");
		   $http({
		   method : "POST",
			url : '/logout',
			data: {
				
			}
	    }).then(function(res){
	    	window.location.assign('/');
		    });
	  }
   
   });
	   
	  

