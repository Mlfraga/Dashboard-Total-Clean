const express = require('express');

const router = express.Router();

var data = new Date();

var day = data.getDate();
var month = data.getMonth();
var year = data.getFullYear();

var dias = new Array(
  'domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'
);

var weekday = dias[data.getDay()];
var weekdayC = data.getDay();

var monthC = (month + 1);

var today = '0' + monthC + '/' + day + '/' + year;

var thisMonthFirstDay = day - (day - 1);
var thisMonth = '0' + monthC + '/0' + thisMonthFirstDay + '/' + year;

var lastMonth = '0' + month + '/' + day + '/' + year;

var inicSemana;
var fimSemana;

if (weekdayC == 0) {
  inicSemana = today;
  fimSemana = '0' + monthC + '/' + (day + 7) + '/' + year;
}
if (weekdayC == 1) {
  inicSemana = today;
  fimSemana = '0' + monthC + '/' + (day + 6) + '/' + year;
}
if (weekdayC == 2) {
  inicSemana = '0' + monthC + '/' + (day - 1) + '/' + year;
  fimSemana = '0' + monthC + '/' + (day + 5) + '/' + year;
}
if (weekdayC == 3) {
  inicSemana = '0' + monthC + '/' + (day - 2) + '/' + year;
  fimSemana = '0' + monthC + '/' + (day + 4) + '/' + year;
}
if (weekdayC == 4) {
  inicSemana = '0' + monthC + '/' + (day - 3) + '/' + year;
  fimSemana = '0' + monthC + '/' + (day + 3) + '/' + year;
}
if (weekdayC == 5) {
  inicSemana = '0' + monthC + '/' + (day - 4) + '/' + year;
  fimSemana = '0' + monthC + '/' + (day + 2) + '/' + year;
}
if (weekdayC == 6) {
  inicSemana = '0' + monthC + '/' + (day - 5) + '/' + year;
  fimSemana = '0' + monthC + '/' + (day + 1) + '/' + year;
}


function execSQLQuery(sqlQry, res, key) {
  GLOBAL.conn.request()
    .query(sqlQry)
    .then(result => res.json(key ? result.recordset[key] : result.recordset))
    .catch(err => res.json(err));
}

router.get('/renda-servico', (req, res) => {
  execSQLQuery('SELECT TOP 10 Servicos.nome, ROUND(SUM(valorcobrado),2) AS Total FROM VendasServicos INNER JOIN Servicos ON [VendasServicos].[idServico] = [Servicos].[idServico] GROUP BY Servicos.nome ORDER BY Total DESC', res);
})

router.get('/top-10servicos-realizados', (req, res) => {
  execSQLQuery('SELECT TOP 10 COUNT([Servicos].[nome]) as NrVezes, [Servicos].[nome] FROM [VendasServicos] INNER JOIN Servicos ON [VendasServicos].[idServico] = [Servicos].[idServico] GROUP BY [Servicos].[nome] ORDER BY NrVezes DESC', res);
})

router.get('/renda-hoje', (req, res) => {
  execSQLQuery(`SELECT ROUND(SUM([VendasServicos].[valorCobrado]),2) AS Total  FROM VendasServicos INNER JOIN Vendas ON [VendasServicos].[idVenda] = [Vendas].[idVenda] WHERE [Vendas].[data]  BETWEEN '${today}' AND '${today}'`, res)
})

router.get('/renda-mes-atual', (req, res) => {
  execSQLQuery(`SELECT ROUND(SUM([VendasServicos].[valorCobrado]),2) AS Total  FROM VendasServicos INNER JOIN Vendas ON [VendasServicos].[idVenda] = [Vendas].[idVenda] WHERE [Vendas].[data] BETWEEN '${thisMonth}' AND '${today}' `, res)
})

router.get('/renda-ultimos-trinta-dias', (req, res) => {
  execSQLQuery(`SELECT ROUND(SUM([VendasServicos].[valorCobrado]),2) AS Total  FROM VendasServicos INNER JOIN Vendas ON [VendasServicos].[idVenda] = [Vendas].[idVenda] WHERE [Vendas].[data] BETWEEN '${lastMonth}' AND '${today}' `, res)
})
router.get('/renda-semana-atual', (req, res) => {
  execSQLQuery(`SELECT ROUND(SUM([VendasServicos].[valorCobrado]),2) AS Total  FROM VendasServicos INNER JOIN Vendas ON [VendasServicos].[idVenda] = [Vendas].[idVenda] WHERE [Vendas].[data] BETWEEN '${inicSemana}' AND '${fimSemana}' `, res)
})

router.get('/renda-6meses', (req, res) => {
  execSQLQuery(`SELECT TOP 6 MONTH([Vendas].[data]) AS 'mes', ROUND(SUM(VendasServicos.valorcobrado),2) AS 'valorCobrado' FROM Vendas INNER JOIN VendasServicos ON [Vendas].[idVenda] = [VendasServicos].[idVenda] GROUP BY MONTH([Vendas].[data])`, res)
})

router.get('/gastos-6meses', (req, res) => {
  execSQLQuery(`SELECT TOP 6 MONTH([Gastos].[data]) AS 'mes', ROUND(SUM(Gastos.valor),2) AS 'valor' FROM Gastos GROUP BY MONTH([Gastos].[data])`, res)
})

router.get('/vendas-pendentes', (req, res) => {
  execSQLQuery(`SELECT COUNT(Vendas.[idVenda]) as 'qtd' FROM Vendas WHERE [Vendas].[pago] = 0`, res)
})

router.get('/gastos-pendentes', (req, res) => {
  execSQLQuery(`SELECT COUNT(Gastos.[idGasto]) as 'qtd' FROM Gastos WHERE [Gastos].[pago] = 0`, res)
})


module.exports = router;