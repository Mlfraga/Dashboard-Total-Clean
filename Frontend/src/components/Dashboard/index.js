import React, { useState, useEffect } from 'react';


import logo from '../../images/favicon_tc.png';

import Breadcrumb from '../Breadcrumb';

import api from '../../services/api';

import Bars from '../Bars';

import './styles.css';

export default function Dashboard() {
    const [rendaDiaTotal, setRendaDiaTotal] = useState(0);
    const [rendaSemanaTotal, setRendaSemanaTotal] = useState(0);
    const [rendaMesTotal, setRendaMesTotal] = useState(0);
    const [rendaUltimosSeisMeses, setRendaUltimosSeisMeses] = useState([0]);
    const [gastoUltimosSeisMeses, setGastoUltimosSeisMeses] = useState([0]);
    const [vendasPendentes, setVendasPendentes] = useState([0]);
    const [gastosPendentes, setGastosPendentes] = useState([0]);
    const [topDezServicos, setTopDezServicos] = useState([0]);
    const [rendaServico, setRendaServico] = useState([0]);

    useEffect(() => {
        api.get('renda-hoje').then(response => {

            setRendaDiaTotal(response.data[0].Total)
        })

        api.get('renda-semana-atual').then(response => {
            setRendaSemanaTotal(response.data[0].Total)
        })

        api.get('renda-mes-atual').then(response => {
            setRendaMesTotal(response.data[0].Total)
        })

        api.get('renda-6meses').then(response => {
            setRendaUltimosSeisMeses(response.data)
        })

        api.get('gastos-6meses').then(response => {
            setGastoUltimosSeisMeses(response.data)
        })

        api.get('vendas-pendentes').then(response => {
            setVendasPendentes(response.data[0].qtd)
        })

        api.get('gastos-pendentes').then(response => {
            setGastosPendentes(response.data[0].qtd)
        })

        api.get('top-10servicos-realizados').then(response => {
            setTopDezServicos(response.data)
        })

        api.get('renda-servico').then(response => {
            setRendaServico(response.data);
        })

    }, []);

    function gera_cor() {
        var hexadecimais = '0123456789ABCDEF';
        var cor = '#';

        // Pega um número aleatório no array acima
        for (var i = 0; i < 6; i++) {
            //E concatena à variável cor
            cor += hexadecimais[Math.floor(Math.random() * 16)];
        }
        return cor;
    }

    return (
        <div id='container'>

            <div id="header">
                <div id='titulo'>
                    <img src={logo} width='30' height='30'></img>
                    <h1 id='TotalClean'>Total Clean</h1>
                </div>
            </div>

            <Breadcrumb />
            <div id='board'>

                <div id='boxes'>
                    <div className='boxReceita'>
                        <p id="titleRendaHoje">Receita gerada hoje:</p>
                        <p id="rendaHoje">{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rendaDiaTotal)}</p>
                    </div>
                    <div className='boxReceita'>
                        <p id="titleRendaHoje">Receita gerada essa semana:</p>
                        <p id="rendaHoje">{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rendaSemanaTotal)}</p>
                    </div>
                    <div className='boxReceita'>
                        <p id="titleRendaHoje">Receita gerada esse mês:</p>
                        <p id="rendaHoje">{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rendaMesTotal)}</p>
                    </div>
                </div>


                <div id='graphs'>

                    <div id='graphRenda'>
                        <p id='titleGraphs'>Renda nos últimos seis meses:</p>
                        <Bars
                            data={rendaUltimosSeisMeses.map(el => ({
                                id: "mes",
                                label: `Mês ${el.mes}`,
                                values: [
                                    {
                                        id: "valor-cobrado",
                                        label: "Valor",
                                        value: el.valorCobrado,
                                        color: "#ff6f60"
                                    }
                                ]
                            }))}
                        />
                    </div>

                    <div id='boxesPendencias'>
                        <div id='boxPagPendentes'>
                            <p id="titlePagPendentes">Pagamentos pendentes:</p>
                            <p id="pagPendentes">{vendasPendentes}</p>
                        </div>

                        <div id='boxVendasPendentes'>
                            <p id="titleGastosPendentes">Gastos pendentes:</p>
                            <p id="gastosPendentes">{gastosPendentes}</p>
                        </div>
                    </div>

                    <div id='graphGasto'>
                        <p id='titleGraphs'>Gastos nos últimos seis meses:</p>
                        <Bars
                            data={gastoUltimosSeisMeses.map(el => ({
                                id: "mes",
                                label: `Mês ${el.mes}`,
                                values: [
                                    {
                                        id: "valor",
                                        label: "Valor",
                                        value: el.valor,
                                        color: "#ff6f60"
                                    }
                                ]
                            }))}
                        />
                    </div>
                </div>

                <div id='graphs2'>
                    <div id='top10ServicosGraph'>
                        <p id='titleGraphs' >Os dez serviços mais realizados:</p>
                        <Bars
                            data={topDezServicos.map(el => ({
                                id: "Serviço",
                                label: el.nome,
                                values: [
                                    {
                                        id: "Quantidade",
                                        label: "Quantidade",
                                        value: el.NrVezes,
                                        color: "#ff6f60"
                                    }
                                ]
                            }))}
                        />
                    </div>
                    <div id='rendaPorServico'>
                        <p id='titleGraphs' >Os dez serviços mais rentáveis:</p>
                        <table id='tableRendaPorServico'>
                            <tbody>
                                <tr >
                                    <th style={{ color: '#ff6f60', fontSize: '20px' }}>Serviço:</th>
                                    <th style={{ color: '#ff6f60', fontSize: '20px' }}>Valor:</th>
                                </tr>
                                {rendaServico.map(el => (
                                    <tr style={{ height: '27px', borderBottom: '5px solid red' }}>
                                        <th style={{ fontWeight: 'normal', color: '#484848' }}>{el.nome}</th>
                                        <th style={{ fontWeight: 'normal', color: '#484848' }}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(el.Total)}</th>
                                    </tr>
                                ))
                                }
                            </tbody>
                        </table>
                    </div>


                </div>

            </div>

        </div>

    )

}