import * as zmq from "zeromq"
const sock = zmq.socket("push");

sock.bindSync("tcp://127.0.0.1:3000");
console.log("Producer bound to port 3000");

setInterval(function () {
  console.log("sending work 21");
  sock.send("some work 21");
}, 500);

//GIT HUBP
// WORKERS----->conecta con----->PRODUCERSF
//console.log('tcp://' + process.env.ipworker +':3000');
//sock.bindSync('tcp://10.1.0.100:3000');
