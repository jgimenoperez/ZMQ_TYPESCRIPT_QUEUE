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
var sock = zmq.socket('pub');
//sock.bindSync('tcp://10.1.0.102:3001');
sock.bindSync('tcp://127.0.0.1:3001');
console.log('Publisher bound to port 3001');
setInterval(function () {
    console.log('sending a multipart message envelope');
    sock.send(['kitty cats', 'meow!']);
}, 500);
//Pubber.js-------subscriber.js 
//(Subscriber queda a la espera de pubber pero con suscripcion
