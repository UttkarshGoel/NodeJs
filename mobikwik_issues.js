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
	var sqlQuery = "SELECT m.order_id, u.jugnoo_autos_user_id as user_id, u.user_name, u.phone_no, " + 
                   "u.user_email, m.amount, date_format( m.created_at, '%Y-%m-%d %H:%i:%S' ) as req_logged_on, " + 
                   "m.resp_messagecode, m.resp_status, m.resp_statusdescription, m.resp_debit_amount, m.resp_refid " + 
                   "FROM jugnoo_auth.tb_mobikwik_withdraw_money_txns as m " + 
                   "JOIN jugnoo_auth.tb_users as u " + 
                   "ON m.user_id = u.user_id WHERE m.order_id IN (?) " ;

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
