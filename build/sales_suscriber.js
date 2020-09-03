"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var zmq = __importStar(require("zeromq"));
var suscrito = zmq.socket('sub');
var client = zmq.socket('req');
suscrito.connect('tcp://127.0.0.1:3002');
client.connect('tcp://localhost:3003');
client.send('CONECTO');
suscrito.subscribe('SALES');
console.log('Subscriber conectado al puerto 3002');
suscrito.on('message', function (topic, message) {
    console.log(topic.toString(), 'containing message:', message.toString());
});
/*
process.on('SIGINT', function() {
  client.send('DESCONECTO')
  client.close()
  console.log('Subscriber desconectado del puerto 3002');
})
*/
