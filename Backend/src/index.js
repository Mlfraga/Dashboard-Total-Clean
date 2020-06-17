const express = require('express');
const app = express();
const port = 3333; //porta padrão
const sql = require('mssql');
const connStr = "Server=tcp:total-clean-server.database.windows.net,1433;Initial Catalog=TotalClean-db;Persist Security Info=False;User ID=AdminTotalCLean;Password={Mm884741};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

var cors = require('cors');

const routes = require('./routes');

//fazendo a conexão global
sql.connect(connStr)
   .then(conn => GLOBAL.conn = conn)
   .catch(err => console.log(err));

app.use(cors());
app.use('/', routes);

//inicia o servidor
app.listen(port);
console.log('API funcionando!');

