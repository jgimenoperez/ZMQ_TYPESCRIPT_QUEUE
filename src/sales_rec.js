"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var zmq = require("zeromq");
var recibe = zmq.socket("pull"), //recibe de sales_env
envia = zmq.socket("push"), //envia a sales_env
publica = zmq.socket("pub"), //crea una publicacion
server = zmq.socket("rep"); //recibe de sales_suscriber
var recibe_conectado = false;
var envia_conectado = false;
var publica_conectado = false;
var server_conectado = false;
var total_suscriptores = 2;
var ok_nook;
var counter = 0;
main()["catch"](function (err) {
    console.error(err);
    process.exit(1);
});
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, InicioConexiones()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function InicioConexiones() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("Recibe: Escuchando en puerto:3000");
            //PRIMERO CREO LA PUBLICACION. EN EL EVENTO AL CONECTARSE LOS SUCRIPTORES CREO TODAS LAS DEMAS CONEXIONES
            publica.bind("tcp://127.0.0.1:3002", function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Publicando en puerto 3002");
                    publica.monitor(500, 0);
                }
            });
            return [2 /*return*/];
        });
    });
}
function InicioConexiones2() {
    console.log("Envia: Escuchando en puerto:3001");
    if (server_conectado == false) {
        server.bind("tcp://127.0.0.1:3003", function (err) {
            if (err)
                console.log("aaa");
            else {
                console.log("Recibiendo de puerto 3003...");
                server_conectado = true;
            }
        });
    }
    if (recibe_conectado == false) {
        //recibe.connect("tcp://127.0.0.1:3000");
        recibe.connect("tcp://127.0.0.1:3000", function (err) {
            if (err)
                console.log("bbb");
            else {
                console.log("Recibiendo de puerto 3000...");
                recibe_conectado = true;
            }
        });
    }
    if (envia_conectado == false) {
        //envia.bindSync("tcp://127.0.0.1:3001");
        envia.bind("tcp://127.0.0.1:3001", function (err) {
            if (err)
                console.log("cccc");
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
        InicioConexiones2();
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
        InicioConexiones2();
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
    if (String(msg) == "Inicio_proceso") {
        envia.send("todo_ok");
    }
    else {
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
