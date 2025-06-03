import React, { useEffect, useRef } from "react";
import { AgCharts } from "ag-charts-community";

const TransactionGraph = () => {
const chartRef = useRef(null);

const getData = () => [
{ date: new Date("2023-01-01"), petrol: 145.3, diesel: 149.2 },
{ date: new Date("2023-02-01"), petrol: 148.0, diesel: 150.1 },
{ date: new Date("2023-03-01"), petrol: 147.1, diesel: 151.5 },
{ date: new Date("2023-04-01"), petrol: 144.2, diesel: 148.8 },
{ date: new Date("2023-05-01"), petrol: 143.9, diesel: 147.3 },
];

useEffect(() => {
const dateFormatter = new Intl.DateTimeFormat("en-US");
const tooltip = {
  renderer: ({ datum, xKey }) => ({
    title: dateFormatter.format(datum[xKey]),
  }),
};

const options = {
  container: chartRef.current,
  data: getData(),
  title: {
    text: "Road Fuel Prices",
  },
  footnote: {
    text: "Source: Department for Business, Energy & Industrial Strategy",
  },
  series: [
    {
      type: "line",
      xKey: "date",
      yKey: "petrol",
      yName: "Petrol",
      tooltip,
    },
  ],
  axes: [
    {
      position: "bottom",
      type: "time",
      title: {
        text: "Date",
      },
    },
    {
      position: "left",
      type: "number",
      title: {
        text: "Price in Pence",
      },
    },
  ],
};

AgCharts.create(options);
}, []);

return <div id="myChart" ref={chartRef} style={{ width: "100%", height: "500px" }} />;
};

export default TransactionGraph;
