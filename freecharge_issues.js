var mysql = require("mysql");
var http = require("http");
var async = require("async");
var prompt = require("prompt");

var db_config = {
	host : "db-addn.jugnoo.in",
	user : "uttkarsh",
	password : "w7EyDV8tJbejTCY7",
}

var connection = mysql.createConnection(db_config, function(err,res){
	if(err){
		return res.send("Error while connecting");
	}
	return res.send("Connection Successful");
})


var asyncTasks = [];
var OrderIDs = [];

if(process.argv[2] == "withdraw"){
	asyncTasks.push(orderIdPusher.bind(null));
	asyncTasks.push(getWithdrawMoneyData.bind(null, OrderIDs));
}
else if(process.argv[2] == "add"){
	asyncTasks.push(orderIdPusher.bind(null));
	asyncTasks.push(getAddMoneyData.bind(null, OrderIDs));
}

async.series(asyncTasks, function(err, res){
	if(err){
		console.log(err);
	}
	return res;
});

function orderIdPusher(callback){
	for(var i = 3; i < process.argv.length; i++){
		OrderIDs.push(process.argv[i]);
	}
	return callback(null);
}


function getWithdrawMoneyData(OrderIDs){
	var sqlQuery = "SELECT f.order_id, u.jugnoo_autos_user_id as user_id, " +
                   "u.user_name, u.phone_no, u.user_email, f.amount, " +
                   "date_format( f.created_at, '%Y-%m-%d %H:%i:%S' ) as req_logged_on, " +
                   "f.response_data, f.response_status " +
                   "FROM jugnoo_auth.tb_freecharge_withdraw_money_txns as f " +
                   "JOIN jugnoo_auth.tb_users as u " +
                   "ON f.user_id = u.user_id WHERE f.order_id IN (?)";

	var queryConnection = connection.query(sqlQuery, [OrderIDs], function(qerr, qres){
            if(qerr){
				console.log(qerr);
				return console.log("Query execution error");
			}
			if(qres.length == 0){
				return console.log("No result found");
			}
            var resObj = {};
            for(var i = 0; i < qres.length; i++){
                var data = JSON.parse(qres[i].response_data);
                resObj = {
                    "order_id"       : qres[i].order_id,
                    "user_id"        : qres[i].user_id,
                    "user_name"      : qres[i].user_name,
                    "phone_no"       : qres[i].phone_name,
                    "user_email"     : qres[i].user_email,
                    "amount"         : qres[i].amount,
                    "req_logged_on"  : qres[i].req_logged_on,
                    "response_status": qres[i].response_status,
                    "errorMessage"   : qres[i].errorMessage,
                    "errorCode"      : data.errorCode,
                    "merchantTxnId"  : data.merchantTxnId,
                    "metadata"       : data.metadata,
                    "status"         : data.status,
                    "txnId"          : data.txnId
                };
                console.log(resObj);
                console.log("\n");
            }
	});
}
