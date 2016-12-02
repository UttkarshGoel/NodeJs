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
	var sqlQuery = "SELECT p.order_id, u.jugnoo_autos_user_id as user_id, u.user_name, u.phone_no, u.user_email, p.txn_amount, " +
								 "date_format(p.req_logged_on, '%Y-%m-%d %H:%i:%S') as req_logged_on, p.resp_txn_id, p.status, p.resp_bank_txn_id,  p.resp_txn_amount, " +
								 "IF((p.resp_respcode ='01'),'INR',null) as resp_currency, "+
								 "p.resp_status, p.resp_respcode, p.resp_respmsg, p.resp_bankname as resp_gatewayname, p.resp_paymentmode " +
								 "FROM jugnoo_auth.tb_paytm_wallet_withdraw_money_txns as p JOIN jugnoo_auth.tb_users as u on p.cust_id = u.user_id WHERE order_id IN (?) ";

	var queryConnection = connection.query(sqlQuery, [OrderIDs], function(qerr, qres){
            if(qerr){
				console.log(qerr);
				return console.log("Query execution error");
			}
			if(qres.length == 0){
				return console.log("No result found");
			}
			var data = JSON.stringify(qres);
			var result = data.replace(/,/g, "\n").replace(/"/g, " ").replace(/}/g, "\n").replace(/{/g, "");
			console.log(result);
	});
}

	
function getAddMoneyData(OrderIDs){
	var sqlQuery = "SELECT p.order_id, u.jugnoo_autos_user_id as user_id, u.user_name, u.phone_no, u.user_email, p.txn_amount, " +
								 "date_format(p.req_logged_on, '%Y-%m-%d %H:%i:%S') as req_logged_on, p.resp_txn_id, p.status, p.resp_bank_txn_id,  p.resp_txn_amount, " +
								 "IF((p.resp_respcode ='01'),'INR',null) as resp_currency, "+
								 "p.resp_status, p.resp_respcode, p.resp_respmsg, p.resp_bankname as resp_gatewayname, p.resp_paymentmode " +
								 "FROM jugnoo_auth.tb_paytm_wallet_add_money_txns as p JOIN jugnoo_auth.tb_users as u on p.cust_id = u.user_id WHERE order_id IN (?) ";

	var queryConnection = connection.query(sqlQuery, [OrderIDs], function(qerr, qres){
			if(qerr){
				console.log(qerr);
				return console.log("Query execution error");
			}
			if(qres.length == 0){
				return console.log("No result found");
			}
			var data = JSON.stringify(qres);
			var result = data.replace(/,/g, "\n").replace(/"/g, " ").replace(/}/g, "\n").replace(/{/g, "");
			console.log(result);
	});
}
