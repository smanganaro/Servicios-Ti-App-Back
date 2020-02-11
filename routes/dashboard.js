var express = require("express");
var router = express(); 

var queryModule = require('../modules/queryModule');
var queryModuleInstance = new queryModule();

var database = require('../database/database');
var dbA = database.dbA;
var dbB = database.dbB;

var currentdate = new Date(); 
var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " at "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds() ;

router.get("/allhosts", function(req, res){
    
    var query = "select host_id, host_name "+
                "from host";

    results = queryModuleInstance.executeQuery(res, query, dbB);
    console.log(datetime, " - Query performed:", "allhost");

});

//kindaUseless
router.get("/allservices", function(req, res){
    
    var query = "select service_id, service_description "+
                "from service";

    results = queryModuleInstance.executeQuery(res, query, dbB);
    console.log(datetime, " - Query performed:", "allsevices");

});

//kindaUseless
router.get("/allmetrics", function(req, res){
    
    var query = "select i.id, m.metric_name "+
                "from metrics as m, index_data as i "+
                "where m.index_id = i.id ";


    results = queryModuleInstance.executeQuery(res, query, dbA);
    console.log(datetime, " - Query performed:", "allmetrics");

});


router.post("/servicemetrics", function(req, res){
    const host_name = req.body.hostname;
    const service_description = req.body.service;

    
    var query = "select i.id, m.metric_name "+
                "from metrics as m, index_data as i "+
                "where m.index_id = i.id "+
                "and i.host_name = '"+host_name+"'  "+ 
                "and i.service_description = '"+service_description+"'  ";


    results = queryModuleInstance.executeQuery(res, query, dbA);
    console.log(datetime, " - Query performed:", host_name, "hostservices");

});


router.post("/hostservices", function(req, res){
    const host_name = req.body.hostname;
    
    var query = "select s.service_id, s.service_description " +
                "from service as s, host as h, host_service_relation hs "+
                "where h.host_name = '"+host_name+"'  "+ 
                "and h.host_id = hs.host_host_id "+
                "and s.service_id = hs.service_service_id ";


    results = queryModuleInstance.executeQuery(res, query, dbB);
    console.log(datetime, " - Query performed:", host_name, "hostservices");

});

//Metrics will only be shown if a hostname and a service were selected
router.post("/servicemetrics", function(req, res){
    const host_name = req.body.hostname;
    const service_description = req.body.service;

    
    var query = "select i.id, m.metric_name "+
                "from metrics as m, index_data as i "+
                "where m.index_id = i.id "+
                "and i.host_name = '"+host_name+"'  "+ 
                "and i.service_description = '"+service_description+"'  ";


    results = queryModuleInstance.executeQuery(res, query, dbA);
    console.log(datetime, " - Query performed:", host_name, service_description, "servicemetrics");

});


router.post("/umbralbyhour" , function(req , res){
    const host_name = req.body.hostname;
    const service_description = req.body.service;
    const metric_name = req.body.metric;
    const start_date = req.body.startdate;
    const end_date = req.body.enddate;

    var query = "select * "+ 
                "from (select DATE_FORMAT(from_unixtime(ctime), '%Y-%m-%d %H') as 'Time', sum(value) as 'TrxTotal' "+
                "from data_bin "+
                "where id_metric=(select metric_id from metrics "+
                "where metric_name='"+metric_name+"' AND index_id=( "+
                "SELECT id FROM index_data "+
                "WHERE host_name = '"+host_name+"' "+
                "AND service_description = '"+service_description+"')) "+
                "AND from_unixtime(ctime) BETWEEN '"+start_date+"  00:00:00' AND '"+end_date+" 23:59:59'  "+
                "group by month(from_unixtime(ctime)), day(from_unixtime(ctime)), hour(from_unixtime(ctime))) as A "+
                "join (select DATE_FORMAT(from_unixtime(ctime), '%Y-%m-%d %H') as 'Time', sum(value) as 'Umbral' "+
                "from data_bin "+
                "where id_metric=(select metric_id from metrics "+
                "where metric_name='UMBRAL' AND index_id=( "+
                "SELECT id FROM index_data "+
                "WHERE host_name = '"+host_name+"' "+
                "AND service_description = '"+service_description+"')) "+
                "AND from_unixtime(ctime) BETWEEN '"+start_date+"  00:00:00' AND '"+end_date+"  23:59:59' "+
                "group by month(from_unixtime(ctime)), day(from_unixtime(ctime)), hour(from_unixtime(ctime)) ) as B "+
                "on A.Time=B.Time "
    
    queryModuleInstance.executeQuery(res, query, dbA);

    console.log(datetime, host_name,service_description,metric_name,start_date,end_date);
});


router.post("/umbralbyday" , function(req , res){
    const host_name = req.body.hostname;
    const service_description = req.body.service;
    const metric_name = req.body.metric;
    const start_date = req.body.startdate;
    const end_date = req.body.enddate;

    var query = "select A.Time, TrxTotal, Umbral "+
                 "from (select DATE_FORMAT(from_unixtime(ctime), '%Y-%m-%d') as 'Time', sum(value) as 'TrxTotal' "+
                 "from data_bin "+
                 "where id_metric=(select metric_id from metrics "+
                 "where metric_name='"+metric_name+"' AND index_id=( "+
                 "SELECT id FROM index_data "+
                 "WHERE host_name = '"+host_name+"'  "+
                 "AND service_description = '"+service_description+"')) "+
                 "AND from_unixtime(ctime) BETWEEN '"+start_date+" 00:00:00' AND '"+end_date+" 23:59:59' "+
                 "group by month(from_unixtime(ctime)), day(from_unixtime(ctime))) as A "+
                 "join (select DATE_FORMAT(from_unixtime(ctime), '%Y-%m-%d') as 'Time', sum(value) as 'Umbral' "+
                 "from data_bin "+
                 "where id_metric=(select metric_id from metrics "+
                 "where metric_name='UMBRAL' AND index_id=( "+
                 "SELECT id FROM index_data "+
                 "WHERE host_name = '"+host_name+"'  "+
                 "AND service_description = '"+service_description+"')) "+
                 "AND from_unixtime(ctime) BETWEEN '"+start_date+" 00:00:00' AND '"+end_date+" 23:59:59' "+
                 "group by month(from_unixtime(ctime)), day(from_unixtime(ctime) )) as B "+
                 "on A.Time=B.Time "
                    
    queryModuleInstance.executeQuery(res, query, dbA);

    console.log(datetime, host_name,service_description,metric_name,start_date,end_date);
});



router.post("/noumbralbyhour" , function(req , res){
    const host_name = req.body.hostname;
    const service_description = req.body.service;
    const metric_name = req.body.metric;
    const start_date = req.body.startdate;
    const end_date = req.body.enddate;

    var query = "select DATE_FORMAT(from_unixtime(ctime), '%Y-%m-%d %H') as 'Time', sum(value) as 'TrxTotal' "+
                 "from data_bin "+
                 "where id_metric=(select metric_id from metrics "+
                 "where metric_name='"+metric_name+"' AND index_id=( "+
                 "SELECT id FROM index_data "+
                 "WHERE host_name = '"+host_name+"'  "+
                 "AND service_description = '"+service_description+"')) "+
                 "AND from_unixtime(ctime) BETWEEN '"+start_date+" 00:00:00' AND '"+end_date+" 23:59:59' "+
                 "group by month(from_unixtime(ctime)), day(from_unixtime(ctime)), hour(from_unixtime(ctime))"
 
    queryModuleInstance.executeQuery(res, query, dbA);
    console.log(datetime, host_name,service_description,metric_name,start_date,end_date);
});


router.post("/noumbralbyday" , function(req , res){
    const host_name = req.body.hostname;
    const service_description = req.body.service;
    const metric_name = req.body.metric;
    const start_date = req.body.startdate;
    const end_date = req.body.enddate;

    var query = "select DATE_FORMAT(from_unixtime(ctime), '%Y-%m-%d') as 'Time', sum(value) as 'TrxTotal' "+
                 "from data_bin "+
                 "where id_metric=(select metric_id from metrics "+
                 "where metric_name='"+metric_name+"' AND index_id=( "+
                 "SELECT id FROM index_data "+
                 "WHERE host_name = '"+host_name+"'  "+
                 "AND service_description = '"+service_description+"')) "+
                 "AND from_unixtime(ctime) BETWEEN '"+start_date+" 00:00:00' AND '"+end_date+" 23:59:59' "+
                 "group by month(from_unixtime(ctime)), day(from_unixtime(ctime))"
 
    queryModuleInstance.executeQuery(res, query, dbA);
    console.log(datetime, host_name,service_description,metric_name,start_date,end_date);
});


router.post("/metricstatus", function(req, res){
    const host_name = req.body.hostname;
    const service_description = req.body.service;
    const metric_name = req.body.metric;
    const start_date = req.body.startdate;
    const end_date = req.body.enddate;
    
    var query = "select A.Time, A.status "+
                "from (select from_unixtime(d.ctime) as 'Time', d.status "+
                "from metrics m, index_data i, data_bin d "+
                "where m.metric_name='"+metric_name+"' "+
                "AND m.index_id=i.id "+
                "AND m.metric_id=d.id_metric "+
                "AND i.host_name = '"+host_name+"' "+
                "AND i.service_description = '"+service_description+"' "+
                "AND from_unixtime(ctime) BETWEEN '"+start_date+" 00:00:00' AND '"+end_date+" 23:59:59' "+
                "order by d.ctime DESC ) as A "+
                "left join (select from_unixtime(d.ctime) as 'Time', d.status "+
                "from metrics m, index_data i, data_bin d "+
                "where m.metric_name='umbral' "+
                "AND m.index_id=i.id "+
                "AND m.metric_id=d.id_metric "+
                "AND i.host_name = '"+host_name+"' "+
                "AND i.service_description = '"+service_description+"' "+
                "AND from_unixtime(ctime) BETWEEN '"+start_date+" 00:00:00' AND '"+end_date+" 23:59:59' "+
                "order by d.ctime DESC ) as B "+
                "ON A.Time=B.Time "+
                "LIMIT 1"


    results = queryModuleInstance.executeQuery(res, query, dbA);
    console.log(datetime, " - Query performed:", "metricstatus");

});


module.exports = router;