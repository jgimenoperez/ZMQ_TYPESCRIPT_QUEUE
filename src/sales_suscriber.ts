import * as zmq from "zeromq"
import { Console } from "console";

const suscrito = zmq.socket('sub');
const client = zmq.socket('req')

suscrito.connect('tcp://127.0.0.1:3002');
client.connect('tcp://localhost:3003')
client.send('CONECTO')
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
