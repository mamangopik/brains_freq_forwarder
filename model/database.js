const mysql = require('mysql2');

class Database {
  constructor(host, user, pwd, db) {
    this.pool = mysql.createPool({
      host: host,
      user: user,
      password: pwd,
      database: db
    }).promise();
    const User_model = require('./user_model');
    const Logger_model = require('./logger_model'); 
    const Device_model = require('./device_model'); 
    const Monitoring_model = require('./monitoring_model'); 

    this.user_model = new User_model(this.pool); 
    this.logger_model = new Logger_model(this.pool);
    this.device_model = new Device_model(this.pool);
    this.monitoring_model =  new Monitoring_model(this.pool);
  }  
}

module.exports = Database;
