import React, { useEffect, useRef } from 'react';
import { AgCharts } from 'ag-charts-community';

const ToursimPieChart = ({ data, title, angleKey }) => {
    const chartRef = useRef(null);

    const numFormatter = new Intl.NumberFormat("en-US");

    useEffect(() => {
        const options = {
            container: chartRef.current,
            title: {
                text: title,
            },
            // subtitle: {
            //     text: "Easy Apple Pie (Serves 4)",
            // },
            // footnote: {
            //     text: "Bake the pie in the oven for 25 minutes at 180℃",
            // },
            series: [
                {
                    data: data, 
                    type: "pie",
                    calloutLabelKey: "packageTypeName",
                    sectorLabelKey: angleKey,
                    angleKey: angleKey,
                    calloutLabel: {
                        offset: 10,
                    },
                    sectorLabel: {
                        formatter: ({ datum, sectorLabelKey = "weight" }) => {
                            return `${numFormatter.format(datum[sectorLabelKey])}`;
                        },
                    },
                    tooltip: {
                        renderer: ({ datum }) => ({
                            title: `${datum.packageTypeName}`,
                            content: `${datum[angleKey]}`,
                        }),
                    },
                },
            ],
            legend: {
                enabled: false,
            },
        };

        const chart = AgCharts.create(options);

        return () => {
            chart.destroy();
        };
    }, [data, angleKey, title]);

    return <>
        <div ref={chartRef} style={{ width: '100%', height: '500px' }} />
    </>;
};

export default ToursimPieChart;
