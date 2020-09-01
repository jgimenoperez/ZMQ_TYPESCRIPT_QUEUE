"use strict";
exports.__esModule = true;
var zmq = require("zeromq");
var recibe = zmq.socket("pull"), //recibe de sales_env
envia = zmq.socket("push"), //envia a sales_env
publica = zmq.socket("pub"), //crea una publicacion
server = zmq.socket("rep"); //recibe de sales_suscriber
var total_suscriptores = 2;
var ok_nook;
//var suscriptos: number = 0; //suscripciones
recibe.connect("tcp://127.0.0.1:3000");
console.log("Recibe: Escuchando en puerto:3000");
envia.bindSync("tcp://127.0.0.1:3001");
console.log("Envia: Escuchando en puerto:3001");
//publica.bindSync("tcp://127.0.0.1:3002");
var counter = 0;
setInterval(function () {
    publica.bind("tcp://127.0.0.1:3002", function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Publicando en puerto 3002");
            publica.monitor(500, 0);
        }
    });
}, 500);
// Register to monitoring events
publica.on("connect", function (fd, ep) {
    console.log("connect, endpoint:", ep);
});
publica.on("connect_delay", function (fd, ep) {
    console.log("connect_delay, endpoicnt:", ep);
});
publica.on("connect_retry", function (fd, ep) {
    console.log("connect_retry, endpoint:", ep);
});
publica.on("listen", function (fd, ep) {
    console.log("listen, endpoint:", ep);
});
publica.on("bind_error", function (fd, ep) {
    console.log("bind_error, endpoint:", ep);
});
//ESTOS EVENTOS LOS UTILIZO PARA SABER EL NUMERO DE SUSCRIPTORES\\\\\\\\
//CUANDO COMPLETO EL NUMERO DE SUSCRIPTORES ENVIO SEÑA A SALES_ENV PARA QUE COMIENCE A ENVIAR DATOS.
publica.on("accept", function (fd, ep) {
    console.log("accept, endpoint:", ep);
    counter++;
    console.log("counter:" + String(counter));
    if (total_suscriptores == counter) {
        console.log("Todos los suscriptores conectados");
        envia.send("todo_ok");
    }
    else {
        console.log("Faltan suscriptores");
        envia.send("todo_ko");
    }
});
publica.on("disconnect", function (fd, ep) {
    console.log("disconnect, endpoint:", ep);
    counter--;
    console.log("counter:" + String(counter));
    if (total_suscriptores == counter) {
        console.log("Todos los suscriptores conectados");
        envia.send("todo_ok");
    }
    else {
        console.log("Faltan suscriptores");
        envia.send("todo_ko");
    }
});
//////////////////////////////////////////////////////////////////
publica.on("accept_error", function (fd, ep) {
    console.log("accept_error, endpoint:", ep);
});
publica.on("close", function (fd, ep) {
    console.log("close, endpoint:", ep);
    envia.send("todo_ko");
});
publica.on("close_error", function (fd, ep) {
    console.log("close_error, endpoint:", ep);
    envia.send("todo_ko");
});
recibe.on("message", function (msg) {
    // if (total_suscriptores == counter) {
    //tontada para marcar ok y ko
    ok_nook = Math.floor(Math.random() * 6) + 1;
    if (ok_nook == 1) {
        console.log("SALES OK: %s", msg.toString());
        envia.send("OK#" + msg.toString());
        publica.send(["SALES", msg.toString()]);
    }
    else {
        console.log("SALES KO: %s", msg.toString());
        envia.send("KO#" + msg.toString());
    }
    // } else {
    //   console.log("Faltan suscriptores");
    //envia.send("KO#" + msg.toString());
    //  }
    //console.group;
});
server.bind("tcp://127.0.0.1:3003", function (err) {
    if (err)
        console.log(err);
    else
        console.log("Recibiendo de puerto 3003...");
});
/*
server.on("message", function (request: any) {

  
  if (request.toString() == "CONECTO") {
    suscriptos++;
  } else {
    suscriptos--;
    if (suscriptos<0) {suscriptos=0}
  }

  
  console.log(request.toString(), counter);
  server.send("OK");
  
  if (total_suscriptores == counter) {
    console.log("Todos los suscriptores conectados");
    envia.send("todo_ok");
  } else {
    console.log("Faltan suscriptores");
    envia.send("todo_ko");
  }
});


process.on('SIGINT', function() {
  envia.send('todo_ko')
  envia.close()
  publica.close()
  server.close()
})

*/
