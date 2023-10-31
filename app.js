require('dotenv').config();
app_port = process.env.PORT
db_host = process.env.DB_HOST
db_user = process.env.DB_USER
db_pwd = process.env.DB_PWD
db_name = process.env.DB_NAME

const Database = require('./model/database');
// const sqlite = require('./model/sqlitedb');
const db = new Database(db_host, db_user, db_pwd, db_name);

const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { start } = require('repl');
const WebSocket = require('ws');
const app = express();
const path = require('path')


app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// alloc CORS untuk API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
// Parse JSON and URL-encoded bodies untuk http POST


app.all('/', function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});


const server = app.listen(app_port);
const io = require('socket.io-client');

const sockServer = process.env.SOCK_SERVER;
const socket = io(sockServer);

const sampling_duration = 30; //in second

var storage = {
    x:[],
    y:[],
    z:[],
}

function findClosestPowerOf2(value) {
    const closestPower = Math.pow(2, Math.floor(Math.log2(value)));
    return closestPower;
}

function connect() {
    var ws = new WebSocket("http://localhost:5557"); 
    ws.onopen = function(){
        console.log('terhubung ke socket');
    }
    ws.on('message', function message(data) {
        jsonString = data.toString();
        data = JSON.parse(jsonString)
        console.log(data.peaks);
    });
  
    ws.onclose = function(e) {
      console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
      setTimeout(function() {
        connect();
      }, 1000);
    };
  
    ws.onerror = function(err) {
      console.error('Socket encountered error: ', err.message, 'Closing socket');
      ws.close();
    };
    return ws;
}

ws = connect();


var t0 = Date.now()/1000;
const process_data = async (payload)=>{
    let value = payload.x.length;
    let closestPowerOf2 = findClosestPowerOf2(value);

    payload.x = payload.x.slice(0,closestPowerOf2);
    payload.y = payload.y.slice(0,closestPowerOf2);
    payload.z = payload.z.slice(0,closestPowerOf2);
    payload['peaks_req'] = 3;

    console.log("len:",closestPowerOf2)
    ws.send(JSON.stringify(payload));
}



socket.on('connect', () => {
    console.log('Connected to server!');
});

socket.on("accelerometer_stream",(data)=>{
    let t_now = Date.now()/1000;
    let t_delta = t_now-t0;
    // console.log("run time:",t_delta,"len:",storage.x.length);
    if(t_delta<=sampling_duration){
        data.data.x_values.forEach(x => {
            storage.x.push(x);    
        });
        data.data.y_values.forEach(y => {
            storage.y.push(y);    
        });
        data.data.z_values.forEach(z => {
            storage.z.push(z);    
        });
    }else{
        process_data(storage);
        storage = {
            x:[],y:[],z:[]
        }
        t0 = Date.now()/1000;
    }
});
