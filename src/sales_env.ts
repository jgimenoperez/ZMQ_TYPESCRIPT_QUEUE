import * as zmq from "zeromq";

const envia = zmq.socket("push"), //envia a sales_recs
  recibe = zmq.socket("pull");    //recibe de sales_recs  

const Bridge_name: string = "SALES";
//tienen que estar montada antes el servicio que escuche y los sucriptores
var inicio_proceso:boolean=true
var todo_ok: boolean = false;
var count: number = 0;
var time_stamp: string;
var tag_envio: string;
enum TypesMessage {
  msgNewSalesOrder = "new",
  msgEditSalesOrder = "edit",
  msgDeleteSalesOrder = "delete",
}

var TypeMessage = TypesMessage.msgNewSalesOrder;

//sock.bindSync("tcp://10.1.0.101:3000");
envia.bind("tcp://10.1.0.100:3000");
console.log("Envia: a puerto 3000");

recibe.connect('tcp://' + process.env.ip_sales_rec +':3001');
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
  } else if (inicio_proceso==true) {
    envia.send('Inicio_proceso');
    inicio_proceso=false
  }
}, 500);
//inicio_proceso
recibe.on("message", function (msg: any) {
  var estado_recepcion: string[];
  if (String(msg)=='todo_ok') {
    todo_ok=true
    console.log('Todo preparado para comenzar')
  }else if (String(msg)=='todo_ko') {
    todo_ok=false
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
