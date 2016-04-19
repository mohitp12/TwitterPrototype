var signup=angular.module('signup',[]);
signup.controller('signup',function($scope,$http)
{
    $scope.registered_email=true;
    $scope.unexpected_error=true;
    $scope.unexpected_login=true;
    $scope.registered_username = true;
    
    $scope.submit=function()
    {
    	 console.log("angularjs");
    	 console.log($scope.inputLastname+":::"+$scope.inputEmail+":::"+$scope.inputPassword);
        $http({
            method:"POST",
            url:'/afterSignUp',
            data : {
                "inputFirstname" : $scope.inputFirstname,
                "inputLastname" : $scope.inputLastname,
                "inputEmail" : $scope.inputEmail,
                "inputPassword" : $scope.inputPassword,
            }
        }).success(function(data)
        {	console.log(data.statusCode);
            if (data.statusCode == 401) 
            {
                $scope.registered_email = false;
                $scope.unexpected_error = true;
            }
            if(data.statusCode==200)
            {
                window.location.assign("/addUserName");
            }
        }).error(function(error) 
            {
                $scope.unexpected_error = false;
                $scope.registered_email = true;
            });
    };
    
    
    $scope.addUser=function()
    {
    	 console.log("angularjs");
    	 console.log($scope.inputUsername+":::"+$scope.inputUsername);
        $http({
            method:"POST",
            url:'/updateUserName',
            data : {
                "inputUsername" : $scope.inputUsername,
            }
        }).success(function(data)
        {	console.log(data);
            if (data.statusCode == 401) 
            {
                $scope.registered_username = false;
            }
            if(data.statusCode==200)
            {
                window.location.assign("/signin");
            }
        }).error(function(error) 
            {
                $scope.unexpected_error = false;
                $scope.registered_email = true;
            });
    };
    
    $scope.login=function()
    {
    	 console.log("login angularjs");
    	 console.log($scope.inputEmail+":::"+$scope.inputPassword);
        $http({
            method:"POST",
            url:'/afterSignIn',
            data : 
            {
                "inputEmail" : $scope.inputEmail,
                "inputPassword" : $scope.inputPassword,
            }
        }).success(function(data)
        {	console.log(data);
            if (data.statusCode == 401) 
            {
                $scope.registered_username = false;
            }
            if(data.statusCode==200)
            {
                window.location.assign("/home");
            }
        }).error(function(error) 
            {
                $scope.unexpected_error = false;
                $scope.registered_email = true;
            });
    };
    
})