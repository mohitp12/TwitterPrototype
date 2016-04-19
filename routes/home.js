var ejs = require("ejs");
var mysql = require('./mysql');
var crypto = require("crypto");
var session = require("express-session");

function signin(req,res) 
{
	console.log("Displaying signin page");
	res.render('signin',function(err, result) 
	{
	   // render on success
	   if (!err) 
	   {
	            res.end(result);
	   }
	   // render or error
	   else 
	   {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
}

function signup(req,res) 
{
	console.log("Displaying signup page");
	res.render('signup');
}

function afterSignUp(req,res)
{
	console.log("into afterSignUp function");
	var json_responses;
    var allemail = "select Email from Account where Email='" + req.param("inputEmail") + "'";
	
    var cipher = crypto.createCipher('aes-256-ctr', 'd6F3Efeqwerty');
	var hash = cipher.update(req.param("inputPassword"),'utf8','hex');
	hash += cipher.final('hex');
	// check user already exists

	mysql.fetchData(function (err, results) 
	{
        console.log(results);
        if (results.length > 0) 
        {
            console.log("email exists");
            json_responses = {"statusCode": 401};
            res.send(json_responses);
            res.end();
        }
        else 
        {
        	var insertUser= "INSERT INTO Account (Email, FirstName, LastName,Password, UserName) VALUES ("+"'"+req.param("inputEmail")+"', '"+req.param("inputFirstname")+"', '"+req.param("inputLastname")+"', '"+hash +"',now())";
        	console.log("Query is:"+insertUser);	
        	req.session.email=req.param("inputEmail");
            mysql.fetchData(function (err, results) 
            {
                if (results.affectedRows > 0) 
                {
                    console.log("valid Login");
                    json_responses = {"statusCode": 200};
                    res.send(json_responses);
                }
                else 
                {
                    json_responses = {"statusCode": 401};
                    res.send(json_responses);
                }
            }, insertUser);
        }
    }, allemail);
}
function homepage(req,res)
{
	res.render("twitter_home");
}
function addUserName(req, res)
{
	console.log("displaying Email page");
	res.render("username");
}
function updateUserName(req, res)
{
	console.log("inside updateUserName function");
	
	console.log(req.param("inputUsername")+"::::::"+req.session.email);
	var updateUserName= "UPDATE Account SET UserName ='" +req.param("inputUsername")+"' WHERE Email='"+req.session.email+"'";
	console.log("Query is:"+updateUserName);	
	
    mysql.fetchData(function (err, results) 
    {
        if (results.affectedRows > 0) 
        {
            console.log("valid Login");
            json_responses = {"statusCode": 200};
            res.send(json_responses);
        }
        else 
        {
            json_responses = {"statusCode": 401};
            res.send(json_responses);
        }
    }, updateUserName);
}

function afterSignIn(req,res)
{
	console.log("Inside the afterSignIn function");
	var decipher = crypto.createDecipher('aes-256-ctr', 'd6F3Efeqwerty')
	var hash = decipher.update(req.param("inputPassword"),'utf8','hex')
	hash += decipher.final('hex');
	// check user already exists
	console.log(req.param("inputEmail")+""+hash);
	var getUser="select * from Account where Email='"+req.param("inputEmail")+"' and Password='" + hash +"'";
	console.log("Query is:"+getUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log(results);
			if (results.length > 0) 
            {
				req.session.Email=req.param("inputEmail");
                console.log("valid Login");
                json_responses = {"statusCode": 200};
                res.send(json_responses);
            }
            else 
            {
                json_responses = {"statusCode": 401};
                res.send(json_responses);
            }
		}  
	},getUser);
}

function profile(req, res)
{
	console.log("Showing profile page");
	console.log(req.session.Email);
	res.render("profile", { title: req.session.Email });
}

function searchHash(req,res){
	var Hash = req.param("Hash");
	var simplestr = Hash.substr(1, Hash.length);
	console.log(simplestr);
	var serchHashtag = "SELECT HashTable.Tweet, Account.FirstName, Account.LastName, Account.Email FROM HashTable INNER JOIN Account ON HashTable.Email = Account.Email WHERE Hash LIKE '"+simplestr+"'";

	mysql.fetchData(function(err, results){
		if (err){
			throw err;
		} else {
			
			if(results.length >0){
			
				
				var row = results;
				var jsonString = JSON.stringify(results);
				var relatedTweets = JSON.parse(jsonString);
			    console.log("related tweets");
			   
				
				res.send({searchTweets: relatedTweets});
			} else {
				console.log("wrong query!");
				res.send("something went wrong!");
			}
		}
	}, serchHashtag);
}

function insertTweet(req, res)
{
	console.log(req.body.tweet);
	var insertTweet = "INSERT INTO Tweet(Email, Tweet, Time) VALUES ('"+req.session.Email+"', '"+req.body.tweet+"', NOW())";
	
	console.log("insert query:" + insertTweet);
	mysql.fetchData(function(err, results){
		if (err){
			throw err;
		} else {
			
			console.log("Tweet inserted successfully!");
			res.render('twitter_home', function(err, result){
				if(!err){
					res.end(result);
					}
						
				else{
					res.end("Error");
					console.log(err);
				}
			});
		}
		
	}, insertTweet);
	
	var Tweet = req.body.tweet;
	var parts = Tweet.split("#");
	console.log("Part is:"+parts);
	
	for (var i = 1; i<parts.length; i++){
		var hashTag = parts[i].substr(0, parts[i].indexOf(' '));
		console.log("Hastag is:"+hashTag);
		var insertHashtag = "INSERT INTO HashTable(Hash, Tweet, Email, Time) VALUES('"+hashTag+"', '"+req.body.tweet+"', '"+req.session.Email+"', NOW() )";
		console.log(insertHashtag);
		mysql.fetchData(function(err, results){
			if (err){
				throw err;
			} else {
				
				console.log("Hash inserted!");
				res.render('twitter_home', function(err, result){
					if(!err){
						res.end(result);
					}else{
						res.end("Error");
						console.log(err);
					}
				});
				
			}
			
		}, insertHashtag);
	}
}



function getAllUsers(req, res){
	
	var allUsers = "SELECT * FROM Account WHERE Email NOT IN (SELECT Followed FROM Follow WHERE Follows = '"+req.session.Email+"') AND Email != '"+req.session.Email+"'";
	
	mysql.fetchData(function(err, results){
		if (err){
			throw err;
		} else {
			
			if(results.length >0){
				console.log("valid user!");
				
				var row = results;
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
			
				res.render('./views/userList.ejs', {Account: jsonParse}, function(err, result){
					if(!err){
						res.end(result);
					} else {
						res.end("Error");
						console.log(err);
					}
				});
			} else {
				console.log("invalid user!");
				res.render('./views/userList.ejs', function(err, result){
					if (!err){
						res.end(result);
					} else {
						res.end("Error!");
						console.log(err);
					}
				});
			}
		}
	}, allUsers);
}

function follow(req, res){
	
	console.log(req.param("Email"));
	var followUser = "INSERT INTO Follow(Follows, Followed) VALUES('"+req.session.Email+"', '"+req.param("Email")+"')";
	
	mysql.fetchData(function(err, results){
		if (err){
			throw err;
		} else {
			
			res.send("Inserted!");
		}
	}, followUser);
	
}

function whoToFollow(req, res){
	
var allUsers = "SELECT * FROM Account WHERE Email NOT IN (SELECT Followed FROM Follow WHERE Follows = '"+req.session.Email+"') AND Email != '"+req.session.Email+"'";
	
	mysql.fetchData(function(err, results){
		if (err){
			throw err;
		} else {
			
			if(results.length >0){
				console.log("valid user!");
				
				var row = results;
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				console.log(jsonParse);
				res.send(jsonParse);
			} else {
				console.log("invalid user!");
				res.send("You are the first user!")
			}
		}
	}, allUsers);	
}


function getUserInfo(req, res){
	
	var getUser = "select * from Account where Email = '"+req.param("Email")+"'";
		
		mysql.fetchData(function(err, results){
			if (err){
				throw err;
			} else {
				
				if(results.length >0){
				
					
					var row = results;
					var jsonString = JSON.stringify(results);
					var jsonParse = JSON.parse(jsonString);
				
					res.send(jsonParse);
				} else {
					console.log("invalid user!");
					res.send("something went wrong!");
				}
			}
		}, getUser);
}

function onLoadData(req,res){
	console.log(req.session.Email);
	
	 var fetchTweets = "SELECT Tweet.Tweet, Account.FirstName, Account.LastName, Account.UserName FROM Tweet INNER JOIN Account ON Tweet.Email = Account.Email WHERE Tweet.Email IN (SELECT Followed FROM Follow WHERE Follows = '"+req.session.Email+"') OR Tweet.Email = '"+req.session.Email+"' ORDER BY  Tweet.Time DESC";
		 
		mysql.fetchData(function(err, results){
			if (err){
				throw err;
			} else {
				
				if(req.session.Email){
					
				
					var jsonString = JSON.stringify(results);
					var allTweets = JSON.parse(jsonString);
					
					console.log("inside tweets!");
					var fetchHashtags = "SELECT COUNT(*) AS popularity, Hash FROM HashTable GROUP BY Hash ORDER BY popularity DESC";
                	
              	  
              	  mysql.fetchData(function(err, results){
              			if (err){
              				throw err;
              			} else {
              				
              				if(req.session.Email){
              					
              					var jsonString1 = JSON.stringify(results);
              					var allHashtags = JSON.parse(jsonString1);
              					console.log("inside Hash!");
              					
              					var fetchUsers = "SELECT * FROM Account WHERE Email NOT IN (SELECT Followed FROM Follow WHERE Follows = '"+req.session.Email+"') AND Email != '"+req.session.Email+"' LIMIT 5";
              					
              					
              					mysql.fetchData(function(err, results){
              						if (err){
              							throw err;
              						} else {
              							
              							if(req.session.Email){
              								
              								console.log("inside Account!");
              								var jsonString2 = JSON.stringify(results);
              								var allUsers = JSON.parse(jsonString2);
              								
              								var userDetail = "SELECT * FROM Account WHERE Email ='"+req.session.Email+"'";
              								mysql.fetchData(function(err, results){
              									if(err){
              										throw err;
              									} else {
              										
              										var jsonString3 = JSON.stringify(results);
                      								var user = JSON.parse(jsonString3);
                      								
                      								var numOfFollowing = "SELECT COUNT(*) AS num1 FROM Follow WHERE Follows ='"+req.session.Email+"'";
                      								mysql.fetchData(function(err, results){
                      									if(err){
                      										throw err;
                      									} else {
                      										
//                      										var jsonString4 = JSON.stringify(results);
                              								var countFollowing = results;
                              								
                              								var numOfFollowers = "SELECT COUNT(*) AS num2 FROM Follow WHERE Followed ='"+req.session.Email+"'";
                              								mysql.fetchData(function(err, results){
                              									if(err){
                              										throw err;
                              									} else {
                              										
//                              										var jsonString5 = JSON.stringify(results);
                                      								var countFollowers = results;
                                      								
                              											var numOfTweets = "SELECT COUNT(*) AS num3 FROM Tweet WHERE Email ='"+req.session.Email+"'";
                                          								mysql.fetchData(function(err, results){
                                          									if(err){
                                          										throw err;
                                          									} else {
                                          										
//                                          										var jsonString5 = JSON.stringify(results);
                                                  								var countTweets = results;
                                          											
                                                  								console.log({tweets: allTweets, Hash: allHashtags, suggestedUsers: allUsers, userInfo: user, followers: countFollowers, following: countFollowing, numTweets: countTweets, });
                                                  								res.send({tweets: allTweets, Hash: allHashtags, suggestedUsers: allUsers, userInfo: user, followers: countFollowers, following: countFollowing, numTweets: countTweets, });
                                          									}
                                          								}, numOfTweets );
                              									}
                              								}, numOfFollowers );
                      									}
                      								}, numOfFollowing );
              									}
              								}, userDetail );
              								
              							} 
              						}
              					}, fetchUsers);
              				} 
              			}
              			
              		}, fetchHashtags);
					
				}
				
				else {
					console.log("no tweets!");
					res.send("Something went wrong! Can't execute getFeeds.");
				}
			}
			
		}, fetchTweets);
	
}



function logout(req, res){
	
	req.session.destroy();
	res.send("loged out!");
}

function addBio(req,res){
	
	var insertBio = "UPDATE Account SET location= '"+req.param("location")+"', dob = '"+req.param("dob")+"', phone = '"+req.param("phone")+"'  WHERE Email = '"+req.session.Email+"'";

	mysql.fetchData(function(err, results){
		if (err){
			throw err;
		} else {
			
			if(req.session.Email){
			
				
				
			    console.log("insert bio!");
			   
				
				res.redirect('/profile');
			} else {
				console.log("wrong query!");
				
			}
		}
	}, insertBio);
}


function relatedTweets(req, res){
	
	var getTweets = "select * from HashTable where Hash = '"+req.param("hashTag")+"'";
	
	mysql.fetchData(function(err, results){
		if (err){
			throw err;
		} else {
			
			if(results.length >0){
			
				
				var row = results;
				var jsonString = JSON.stringify(results);
				var abc = JSON.parse(jsonString);
			    console.log("related tweets");
			   
				
				res.render('trending', {relatedTweets: abc});
			} else {
				console.log("invalid user!");
				res.send("something went wrong!");
			}
		}
	}, getTweets);
}

function showProfile(req, res){
	
	if(req.session.Email){
		res.render("profile");
	}
}

function getProfile(req, res){
	
	 var fetchUserTweets = "SELECT Tweet.Tweet, Account.FirstName, Account.LastName, Account.Email FROM Tweet INNER JOIN Account ON Tweet.Email = Account.Email WHERE Tweet.Email = '"+req.session.Email+"' ORDER BY  Tweet.Time DESC";
	 
		mysql.fetchData(function(err, results){
			if (err){
				throw err;
			} else {
				
				if(req.session.Email){
					
				
					var jsonString = JSON.stringify(results);
					var allUserTweets = JSON.parse(jsonString);
					
					console.log("inside tweets!");
					var fetchHashTable = "SELECT COUNT(*) AS popularity, Hash FROM HashTable GROUP BY Hash ORDER BY popularity DESC";
             	
           	  
           	  mysql.fetchData(function(err, results){
           			if (err){
           				throw err;
           			} else {
           				
           				if(req.session.Email){
           					
           					var jsonString1 = JSON.stringify(results);
           					var allHashTable = JSON.parse(jsonString1);
           					console.log("inside hashtag!");
           					
           					var fetchUsers = "SELECT * FROM Account WHERE Email NOT IN (SELECT Followed FROM Follow WHERE Follows = '"+req.session.Email+"') AND Email != '"+req.session.Email+"' LIMIT 5";
           					
           					
           					mysql.fetchData(function(err, results){
           						if (err){
           							throw err;
           						} else {
           							
           							if(req.session.Email){
           								
           								console.log("inside users!");
           								var jsonString2 = JSON.stringify(results);
           								var allUsers = JSON.parse(jsonString2);
           								
           								var userDetail = "SELECT * FROM Account WHERE Email ='"+req.session.Email+"'";
           								mysql.fetchData(function(err, results){
           									if(err){
           										throw err;
           									} else {
           										
           										var jsonString3 = JSON.stringify(results);
                   								var user = JSON.parse(jsonString3);
                   								
                   								var numOfFollowing = "SELECT COUNT(*) AS num1 FROM Follow WHERE Follows ='"+req.session.Email+"'";
                   								mysql.fetchData(function(err, results){
                   									if(err){
                   										throw err;
                   									} else {
                   										
//                   										var jsonString4 = JSON.stringify(results);
                           								var countFollowing = results;
                           								
                           								var numOfFollowers = "SELECT COUNT(*) AS num2 FROM Follow WHERE Followed ='"+req.session.Email+"'";
                           								mysql.fetchData(function(err, results){
                           									if(err){
                           										throw err;
                           									} else {
                           										
//                           										var jsonString5 = JSON.stringify(results);
                                   								var countFollowers = results;
                           										
                                   								
                                   								var followingU = "SELECT Follow.Followed, Account.FirstName, Account.LastName, Account.UserName, Account.Email FROM Follow INNER JOIN Account ON Follow.Followed = Account.Email WHERE Follow.Follows = '"+req.session.Email+"'" ;                           									
                                   								
                                   								mysql.fetchData(function(err, results){
                                   									if(err){
                                   										throw err;
                                   									} else {
                                   										
                                   									    var jsonString4 = JSON.stringify(results);
                                           								var followingUser = JSON.parse(jsonString4);
                                   									
                                           								var followersU = "SELECT Follow.Follows, Account.FirstName, Account.LastName, Account.UserName, Account.Email FROM Follow INNER JOIN Account ON Follow.Follows = Account.Email WHERE Follow.Followed = '"+req.session.Email+"'" ;                           									
                                           								
                                           								mysql.fetchData(function(err, results){
                                           									if(err){
                                           										throw err;
                                           									} else {
                                           										
                                           										var jsonString5 = JSON.stringify(results);
                                           										var FollowersUser = JSON.parse(jsonString5);
                                           										
                                                   								
                                                   								
                                           									
                                                   								var numOfTweets = "SELECT COUNT(*) AS num3 FROM Tweet WHERE Email ='"+req.session.Email+"'";
                                                  								mysql.fetchData(function(err, results){
                                                  									if(err){
                                                  										throw err;
                                                  									} else {
                                                  										
//                                                  										var jsonString5 = JSON.stringify(results);
                                                          								var countTweets = results;
                                                  											
                                                          								
                                                          								res.send({tweets: allUserTweets, HashTable: allHashTable, suggestedUsers: allUsers, userInfo: user, followers: countFollowers, following: countFollowing, followingList: followingUser, followersList: FollowersUser, numTweets: countTweets});
                                                  									}
                                                  								}, numOfTweets );
                                                   								
                                           									}
                                           								}, followersU );
                                           								
                                   									}
                                   								}, followingU );	
                           									}
                           								}, numOfFollowers );
                   									}
                   								}, numOfFollowing );
           									}
           								}, userDetail );
           								
           							} 
           						}
           					}, fetchUsers);
           				} 
           			}
           			
           		}, fetchHashTable);
					
				} else {
					console.log("no tweets!");
					res.send("Something went wrong! Can't execute getFeeds.");
				}
			}
		}, fetchUserTweets);	
}

exports.getProfile = getProfile;
exports.relatedTweets=relatedTweets;
exports.logout=logout;
exports.addBio = addBio;
exports.searchHash=searchHash;
exports.insertTweet=insertTweet;
exports.follow=follow;
exports.whoToFollow=whoToFollow;
exports.getUserInfo=getUserInfo;
exports.onLoadData=onLoadData;
exports.profile=profile;
exports.signin=signin;
exports.signup=signup;
exports.afterSignIn=afterSignIn;
exports.afterSignUp=afterSignUp;
exports.updateUserName=updateUserName;
exports.addUserName=addUserName;
exports.homepage = homepage;
exports.getAllUsers=getAllUsers;