import React from "react";
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useWalkerpassStore } from "./store/walkerpassStore";

const WalkerpassMostPopularPassType = () => {
  const { walkerPassDashboard, isFetchWalkerpassDashboardLoading } = useWalkerpassStore();

  // Get the most popular pass type from the data
  const mostPopularPassType = walkerPassDashboard?.map(item => item.duration) || "Ordinary - Monthly";
  
  // Sample data for pie chart (you can replace with actual data)
  // const pieChartData = [
  //   { name: "Monthly", value: 45, color: "#1e40af" },
  //   { name: "Yearly", value: 30, color: "#1e40af" },
  //   { name: "Senior Citizen", value: 20, color: "#3b82f6" },
  //   { name: "Weekly/Day", value: 5, color: "#93c5fd" }
  // ];

  // // Render pie chart label
  // const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  //   const RADIAN = Math.PI / 180;
  //   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
  //   const y = cy + radius * Math.sin(-midAngle * RADIAN);

  //   return (
  //     <text 
  //       x={x} 
  //       y={y} 
  //       fill="white" 
  //       textAnchor={x > cx ? 'start' : 'end'} 
  //       dominantBaseline="central"
  //       fontSize={12}
  //       fontWeight="bold"
  //     >
  //       {`${(percent * 100).toFixed(0)}%`}
  //     </text>
  //   );
  // };

  // Loading skeleton for both cards
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  if (isFetchWalkerpassDashboardLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="col-span-full">
      {/* Most Popular Pass Type and Pie Chart Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Popular Pass Type Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Popular Pass Type</h3>
          <p className="text-2xl font-bold text-gray-800">{mostPopularPassType}</p>
        </div>

        {/* Pass Type Distribution Pie Chart */}
        {/* <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pass Type Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default WalkerpassMostPopularPassType;
