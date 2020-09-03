import * as zmq from "zeromq";

const recibe = zmq.socket("pull"), //recibe de sales_env
  envia = zmq.socket("push"), //envia a sales_env
  publica = zmq.socket("pub"), //crea una publicacion
  server = zmq.socket("rep"); //recibe de sales_suscriber

var recibe_conectado: boolean = false;
var envia_conectado: boolean = false;
var publica_conectado: boolean = false;
var server_conectado: boolean = false;

const total_suscriptores: number = 2;
var ok_nook: number;
var counter = 0;

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  await InicioConexiones();
  //await sleep(8000);
}

async function InicioConexiones() {
  console.log("Recibe: Escuchando en puerto:3000");

  //PRIMERO CREO LA PUBLICACION. EN EL EVENTO AL CONECTARSE LOS SUCRIPTORES CREO TODAS LAS DEMAS CONEXIONES
  publica.bind("tcp://127.0.0.1:3002", function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Publicando en puerto 3002");
      publica.monitor(500, 0);
    }
  });
}

function InicioConexiones2() {
  console.log("Envia: Escuchando en puerto:3001");

  if (server_conectado == false) {
    server.bind("tcp://127.0.0.1:3003", function (err: any) {
      if (err) console.log("aaa");
      else {
        console.log("Recibiendo de puerto 3003...");
        server_conectado = true;
      }
    });
  }


  if (recibe_conectado == false) {
    //recibe.connect("tcp://127.0.0.1:3000");
    recibe.connect("tcp://127.0.0.1:3000")
    console.log("Recibiendo de puerto 3000...");
  }

  if (envia_conectado == false) {
    //envia.bindSync("tcp://127.0.0.1:3001");
    envia.bind("tcp://127.0.0.1:3001", function (err: any) {
      if (err) console.log("cccc");
      else {
        console.log("Enviado a puerto 3001...");
        envia_conectado = true;
      }
    });
    
    console.log("Todos los suscriptores conectados");
    //publica.bindSync("tcp://127.0.0.1:3002");
  }
}
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
    InicioConexiones2()
    envia.send("todo_ok");
  } else {
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
    InicioConexiones2();
    envia.send("todo_ok");
  } else {
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

recibe.on("message", function (msg: any) {
  // if (total_suscriptores == counter) {
  //tontada para marcar ok y ko
  if (String(msg) == "Inicio_proceso") {
    envia.send("todo_ok");
  } else {
    ok_nook = Math.floor(Math.random() * 6) + 1;
    if (ok_nook == 1) {
      console.log("SALES OK: %s", msg.toString());
      envia.send("OK#" + msg.toString());
      publica.send(["SALES", msg.toString()]);
    } else {
      console.log("SALES KO: %s", msg.toString());
      envia.send("KO#" + msg.toString());
    }
  }

  // } else {
  //   console.log("Faltan suscriptores");
  //envia.send("KO#" + msg.toString());
  //  }

  //console.group;
});

/*
async function esperar() {
  console.log(1);
  await sleep(8000);
  console.log(2);
}
*/

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
