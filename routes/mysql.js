var ejs= require('ejs');
var mysql = require('mysql');

var pool = require('./pool');


function fetchData(callback, sqlQuery){
	
	console.log("\nSqlquery:: "+ sqlQuery );
	var connection = pool.getConnectionFromPool();
	
		connection.query(sqlQuery, function(err, rows, fields){
			if(err){
				console.log("ERROR: " + err.message);
			}
			else{
			//	console.log("DB Results:"+"hellllloooooo");   
				callback(err, rows);
			}
		});
		pool.releaseConnection(connection);
	
}


exports.fetchData = fetchData;

//function getConnection(){
//	var connection = mysql.createConnection({
//	    host     : '',
//	    user     : '',
//	    password : '',
//	    database : '',
//	    port	 : 3306
//	});
//	return connection;
//}
//
//function insertData(callback,sqlQuery){
//	
//	console.log("\nSQL Query::"+sqlQuery);
//	
//	var connection=getConnection();
//	
//	connection.query(sqlQuery, function(err, rows, fields) {
//		if(err){
//			console.log("ERROR: " + err.message);
//		}
//		else 
//		{	// return err or result
//			console.log("Data inserted is:"+rows);
//			callback(err, rows);
//		}
//	});
//	console.log("\nConnection closed..");
//	connection.end();
//}	
//	
//function fetchData(callback,sqlQuery){
//	
//	console.log("\nSQL Query::"+sqlQuery);
//	
//	var connection=getConnection();
//	
//	connection.query(sqlQuery, function(err, rows, fields) {
//		if(err){
//			console.log("ERROR: " + err.message);
//		}
//		else 
//		{	// return err or result
//			console.log("DB Results:"+rows);
//			callback(err, rows);
//		}
//	});
//	console.log("\nConnection closed..");
//	connection.end();
//}	
//
//exports.insertData=insertData;
//exports.fetchData=fetchData;
