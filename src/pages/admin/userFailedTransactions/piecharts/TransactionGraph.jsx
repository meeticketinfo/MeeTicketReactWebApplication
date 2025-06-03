import React, { useEffect, useRef } from "react";
import { AgCharts } from "ag-charts-community";

const TransactionGraph = ({ data, title, angleKey, calloutLabelKey }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // store chart instance

  useEffect(() => {
    if (!data || data.length === 0) return;

    const tooltip = {
      renderer: ({ datum, xKey, yKey }) => ({
        title: datum[xKey],
        content: `${datum[yKey]}`,
      }),
    };

    const options = {
      container: chartRef.current,
      data,
      title: { text: title },
      series: [
        {
          type: "line",
          xKey: calloutLabelKey,
          yKey: angleKey,
          yName: angleKey,
          stroke: "#001f3f",
          marker: { fill: "#001f3f", stroke: "#001f3f" },
          tooltip,
        },
      ],
      axes: [
        { position: "bottom", type: "category" },
        { position: "left", type: "number", title: { text: "Transaction Count" } },
      ],
    };

    // If chart already exists, update it
    if (chartInstance.current) {
      chartInstance.current.update(options);
    } else {
      // Otherwise, create a new chart
      chartInstance.current = AgCharts.create(options);
    }

    // Optional: clean up on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, title, angleKey, calloutLabelKey]);

  return <div ref={chartRef} style={{ width: "100%", height: "500px" }} />;
};

export default TransactionGraph;
