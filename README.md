# ZMQ_TYPESCRIPT_QUEUE

El bridge envia la peticion asignandole un id (ver mas abajo)
El broker recoge el mensaje y lo Valida 
  si es ok lo mando con suscripcion 
  Hay qeu gestionar sistemas de cola para peticiones proecesad y no procesadas
  Lo primero que debe de hacer el broker es retonmar las peticiones encoladas y no proecesadas y procesarlas.
El bridgw que corresponda lo regoge y lo PerformanceMeasure

host    func    event  
bridge  req     no
        sub     yes
broker  res     yes
        pub     no



br1             bk
doReq(sendMsg)  onReq(doRes(ok)) con el id del mensaje que se enviará
                doPub(newMsg(ID))

br1
onSub(Msg(ID))  es el que ha mandado, lo ignora
br2
onSub(Msg(ID))  es un mensaje nuevo, lo tramita



tipos de mensaje
enum
{
  'msgNewSalesOrder': 1,
  'msgEditSalesOrder': 2,
  'msgDeleteSalesOrder': 3
}

bridges activos
hashtable
[
  'bridgeAydai',
  'bridgePresta',
  'bridgePIMCore'
]

tipoMsg/IDBridge/Timestamp/Contador

15.31.50 1
15.31.50 2
15.31.51 1
