import React, { useState, useRef, useEffect } from "react";

import Color from "color";

import ChartComponent from "react-chartjs-2";

import "chartjs-plugin-datalabels";

import "./config";

export default function Bars({
        data = [
            /* {
                id: "motorista",
                label: "Adeilson M",
                values: [
                    {
                        id: "comprovadas",
                        label: "Comprovadas",
                        value: "10",
                        color: "#585858"
                    },
                    {
                        id: "abertas",
                        label: "Abertas",
                        value: "5",
                        color: "#f44336"
                    }
                ]
            } */
        ],
    onClick
}) {
    const [dataTypes, setDataTypes] = useState([]);

    const chartEl = useRef();

    useEffect(() => {
        const newDataTypes = [];

        data.forEach(element =>
            element.values.forEach(item => {
                if (newDataTypes.some(el => item.id === el.id)) return;

                newDataTypes.push({
                    id: item.id,
                    label: item.label,
                    color: item.color
                });
            })
        );

        setDataTypes(newDataTypes);
    }, [data]);

    function handleClick(event) {
        if (!Array.isArray(event) || event.length <= 0) return;

        const element = data[event[0]._index];

        const item = {
            element,
            dataset: element.values[event[0]._datasetIndex]
        };

        console.log("Bars: handleClick: item -> ", item);

        onClick && onClick(item);
    }

    return (
        <ChartComponent
            ref={chartEl}
            type="roundedBar"
            data={{
                labels: data.map(element => element.label),
                datasets: dataTypes.map(type => ({
                    label: type.label,
                    backgroundColor: Color(type.color).string(),
                    borderColor: Color(type.color).string(),
                    hoverBackgroundColor: Color(type.color).string(),
                    hoverBorderColor: Color(type.color).string(),
                    borderWidth: 1,
                    data: data.map(element => {
                        const item = element.values.find(
                            item => type.id === item.id
                        );

                        return item ? item.value : 0;
                    })
                }))
            }}
            options={{
                maintainAspectRatio: false,
                responsive: true,
                barRoundness: 0,
                tooltips: {
                    mode: "index"
                },
                legend: {
                    display: true
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 25
                    }
                },
                plugins: {
                    labels: [],
                    datalabels: {
                        display: false,
                        backgroundColor: function(context) {
                            return context.active
                                ? context.dataset.backgroundColor
                                : "white";
                        },
                        borderColor: function(context) {
                            return 'context.dataset.backgroundColor';
                        },
                        borderRadius: function(context) {
                            return context.active ? 0 : 32;
                        },
                        borderWidth: 1,
                        color: function(context) {
                            return context.active
                                ? "white"
                                : "context.dataset.backgroundColor";
                        },
                        font: {
                            weight: "bold"
                        },
                        formatter: function(value, context) {
                            value = Math.round(value * 100) / 100;
                            return context.active
                                ? context.dataset.label + "\n" + value + "%"
                                : Math.round(value);
                        },
                        offset: 8,
                        textAlign: "center"
                    }
                },
                events: ["click", "mousemove", "touchstart"],
                scales: {
                    xAxes: [
                        {
                            display: true,
                            offset: true,
                            barPercentage: 0.4,
                            categoryPercentage: 0.4,
                            ticks: {
                                display: true,
                                mirror: true
                            }
                        }
                    ],
                    yAxes: [
                        {
                            id: "yAxis1",
                            ticks: {
                                min: 0,
                                beginAtZero: true
                            },
                            barPercentage: 0.8,
                            categoryPercentage: 0.8
                        }
                    ]
                },
                hover: {
                    intersect: true,
                    mode: "nearest",
                    onHover: (e, items) => {
                        e.target.style.cursor = "pointer";
                    }
                }
            }}
            getElementAtEvent={handleClick}
        />
    );
}
