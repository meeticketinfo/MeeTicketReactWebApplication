import React, { useEffect, useRef } from 'react';
import { AgCharts } from 'ag-charts-community';

const PieChart = ({ data, title, angleKey, isLoading = false }) => {
    const chartRef = useRef(null);

    const numFormatter = new Intl.NumberFormat("en-US");

    useEffect(() => {
        const total = Array.isArray(data)
            ? data.reduce((sum, item) => sum + (Number(item?.[angleKey]) || 0), 0)
            : 0;

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
                    data: data, // Replace this with your actual data fetching or a function to retrieve data
                    type: "pie",
                    calloutLabelKey: "entity",
                    sectorLabelKey: angleKey,
                    angleKey: angleKey,
                    calloutLabel: {
                        offset: 10,
                    },
                    sectorLabel: {
                        formatter: ({ datum }) => {
                            const value = Number(datum?.[angleKey]) || 0;
                            const percent = total > 0 ? (value / total) * 100 : 0;
                            return `${numFormatter.format(value)} (${percent.toFixed(1)}%)`;
                        },
                    },
                    tooltip: {
                        renderer: ({ datum }) => {
                            const value = Number(datum?.[angleKey]) || 0;
                            const percent = total > 0 ? (value / total) * 100 : 0;
                            return {
                                title: `${datum.entity}`,
                                content: `${numFormatter.format(value)} (${percent.toFixed(1)}%)`,
                            };
                        },
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

    // Skeleton loader component that looks like a pie chart
    const SkeletonLoader = () => (
        <div className="w-full h-full p-4">
            {/* Title skeleton */}
            <div className="mb-6">
                <div className="h-7 bg-gray-200 rounded-lg animate-pulse w-2/3"></div>
            </div>
            
            {/* Chart area skeleton */}
            <div className="flex items-center justify-center h-80">
                <div className="relative">
                    {/* Main pie chart skeleton */}
                    <div className="w-64 h-64 relative">
                        {/* Background circle */}
                        <div className="w-full h-full bg-gray-100 rounded-full border-4 border-gray-200"></div>
                        
                        {/* Pie segments using CSS conic-gradient */}
                        <div 
                            className="absolute inset-0 rounded-full animate-pulse"
                            style={{
                                background: 'conic-gradient(from 0deg, #e5e7eb 0deg 90deg, #d1d5db 90deg 180deg, #9ca3af 180deg 270deg, #6b7280 270deg 360deg)',
                                mask: 'radial-gradient(circle at center, transparent 30%, black 30%)'
                            }}
                        ></div>
                        
                        {/* Center circle */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-2 border-gray-200"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    return <>
        {isLoading && <SkeletonLoader />}

        {!isLoading && <div ref={chartRef} style={{ width: '100%', height: '500px' }} />}
    </>;
};

export default PieChart;
