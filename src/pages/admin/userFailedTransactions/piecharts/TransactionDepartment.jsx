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
      style={{
        width: 500,
        margin: "10px",
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <div ref={chartRef} style={{ width: "100%", height: 300 }} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
          marginTop: 20,
        }}
      >
        {data.map((item) => (
          <div
            key={item.department}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 10px",
              borderRadius: 8,
              backgroundColor: "#F5F6F8",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: item.color,
              }}
            />
            <span>{item.department}</span>
            <div
              style={{
                marginLeft: "auto",
                padding: "2px 8px",
                borderRadius: 4,
                fontWeight: 600,
                color: "#3399FF",
                fontSize: 13,
              }}
            >
              {item.count.toString().padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionDepartment;
