import * as zmq from "zeromq"
import { Console } from "console";

const suscrito = zmq.socket('sub');
//suscrito.connect('tcp://127.0.0.1:3002');
suscrito.connect('tcp://' + process.env.ip_sales_rec +':3002');
suscrito.subscribe('SALES');
console.log('Subscriber conectado al puerto 3002');

suscrito.on('message', function(topic:any, message:any) {
  console.log( topic.toString(), 'containing message:', message.toString());
});


/*
process.on('SIGINT', function() {
  client.send('DESCONECTO')
  client.close()
  console.log('Subscriber desconectado del puerto 3002');
})
*/
