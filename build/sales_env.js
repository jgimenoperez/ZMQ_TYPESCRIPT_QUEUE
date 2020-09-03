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
var envia = zmq.socket("push"), //envia a sales_recs
recibe = zmq.socket("pull"); //recibe de sales_recs  
var Bridge_name = "SALES";
//tienen que estar montada antes el servicio que escuche y los sucriptores
var inicio_proceso = true;
var todo_ok = false;
var count = 0;
var time_stamp;
var tag_envio;
var TypesMessage;
(function (TypesMessage) {
    TypesMessage["msgNewSalesOrder"] = "new";
    TypesMessage["msgEditSalesOrder"] = "edit";
    TypesMessage["msgDeleteSalesOrder"] = "delete";
})(TypesMessage || (TypesMessage = {}));
var TypeMessage = TypesMessage.msgNewSalesOrder;
//sock.bindSync("tcp://10.1.0.101:3000");
envia.bind("tcp://10.1.0.100:3000");
console.log("Envia: a puerto 3000");
recibe.connect('tcp://' + process.env.ip_sales_rec + ':3001');
//recibe.connect("tcp://127.0.0.1:3001");
console.log("Recibe: Escuchando en puerto:3001");
setInterval(function () {
    if (todo_ok == true) {
        var fecha = new Date();
        time_stamp =
            String(fecha.getDate()) +
                String(fecha.getMonth() + 1) +
                String(fecha.getFullYear()) +
                String(fecha.getHours()) +
                String(fecha.getMinutes()) +
                String(fecha.getSeconds()) +
                String(fecha.getMilliseconds());
        count++;
        tag_envio =
            TypeMessage + "#" + Bridge_name + "#" + time_stamp + "#" + count;
        console.log("ENVIO DATOS :" + tag_envio);
        envia.send(tag_envio);
    }
    else if (inicio_proceso == true) {
        envia.send('Inicio_proceso');
        inicio_proceso = false;
    }
}, 500);
//inicio_proceso
recibe.on("message", function (msg) {
    var estado_recepcion;
    if (String(msg) == 'todo_ok') {
        todo_ok = true;
        console.log('Todo preparado para comenzar');
    }
    else if (String(msg) == 'todo_ko') {
        todo_ok = false;
    }
    var recepcion = String(msg).split("#");
    estado_recepcion = String(msg).split("#", 1);
    console.log("RECIBO DATOS: %s", recepcion);
    if (estado_recepcion[0] == "OK") {
        /*
          Si el estado de la recepcion es OK
          se deberia de eliminar el mensaje de la cola de entrada
          o marcarlo como procesado
    
          Si el estado de la recepcion es KO
          se deberia de marcar el mensajde de la cola de entrdada como
          incorrecto y no procesado
    
        */
    }
});
