var mysql = require('mysql');//importing module
var List = require("collections/list");
var maxPoolSize;
var connectionpool;
var connectioncount=0;

function getConnection(){
	var connection = mysql.createConnection({
		host : '',
		user : '',
		password : '',
		database : '',
		port : 3306
	});
	return connection;
}



function createPool(initialsize, maxSize){
	console.log("Connection Pool is creaated");
	connectionpool = new List();
	maxPoolSize = maxSize;
	for(var i=0;i<initialsize;i++){
		connectionpool.push(getConnection());
	}
}

function getConnectionFromPool(){
	if(connectionpool.length == 0){
		if(connectioncount!=maxSize){
			connectioncount++;
			
		return getConnection();
		}
	else{
		console.log("Not available");
		return null;
	}}
	else{
		connectioncount++;
		return connectionpool.pop();
	}
}

function releaseConnection(connection){
	connectioncount--;
	connectionpool.push(connection);
}


exports.createPool=createPool;
exports.getConnectionFromPool=getConnectionFromPool;
exports.releaseConnection=releaseConnection;
