var mysql = require("mysql");
var Client = require('mysql').Client;
let config = require('./databaseConfig');

const dbA = new Client();
dbA.user = config.centreon2_storage.user;
dbA.password = config.centreon2_storage.password;
dbA.host = config.centreon2_storage.host;
dbA.port = config.centreon2_storage.port;
dbA.database = config.centreon2_storage.database;

const dbB = new Client();
dbB.user = config.centreon2.user;
dbB.password = config.centreon2.password;
dbB.host = config.centreon2.host;
dbB.port = config.centreon2.port;
dbB.database = config.centreon2.database;

exports.dbB = dbB;
exports.dbA = dbA;