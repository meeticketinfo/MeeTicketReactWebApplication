import React, { useEffect, useRef } from "react";
import { AgCharts } from "ag-charts-community";

const TransactionDepartment = () => {
  const chartRef = useRef(null);

  const data = [
    { department: "GHMC", count: 40, color: "#001F54" },
    { department: "Endowment", count: 20, color: "#005B96" },
    { department: "TGTDC", count: 15, color: "#3399FF" },
    { department: "HMDA", count: 15, color: "#678CB1" },
    { department: "Forest Department", count: 10, color: "#A0BFE0" },
  ];

  useEffect(() => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const options = {
      container: chartRef.current,
      autoSize: true,
      title: {
        text: "Failed Transactions By Departments",
        fontSize: 16,
        fontWeight: "bold",
        spacing: 10,
      },
      data,
      series: [
        {
          type: "donut",
          angleKey: "count",
          calloutLabelKey: "department",
          calloutLabel: {
            fontSize: 12,
            color: "#333",
          },
          sectorLabelKey: "count",
          sectorLabel: {
            formatter: ({ datum }) => `${datum.count}%`,
            fontSize: 12,
            color: "#fff",
          },
          fills: data.map((d) => d.color),
          strokes: data.map(() => "#fff"),
          innerRadiusRatio: 0.7,
          sectorSpacing: 2,
          innerLabels: [
            {
              text: "",
              fontSize: 18,
              color: "#888",
            },
          ],
        },
      ],
      legend: {
        enabled: false,
      },
    };

    AgCharts.create(options);
  }, []);

  return (
    <div
      className="card"
      style={{
        width: 500,
        margin: "10px 10px",
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <div ref={chartRef} style={{ width: "100%", height: 300 }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginTop: 20,
        }}
      >
        {data.map((item) => (
          <div
            key={item.department}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "4px 0",
              minWidth: "40%",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: item.color,
                marginRight: 8,
              }}
            />
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              {item.department}
            </span>
            <span
              style={{ marginLeft: "auto", color: item.color, fontWeight: 600 }}
            >
              {item.count.toString().padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionDepartment;
