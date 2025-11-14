import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ChevronDown, Calendar } from "lucide-react";

const red = "#E21E0F";
const blue = "#2d7dfa";
const yellow = "#F6A400";

const DashboardStats = () => {
  // Companies data
  const companiesData = [
    { day: "M", value: 40 },
    { day: "T", value: 70 },
    { day: "W", value: 25 },
    { day: "T", value: 80 },
    { day: "F", value: 70 },
    { day: "S", value: 70 },
    { day: "S", value: 70 },
  ];

  // Revenue data
  const revenueData = [
    { month: "Jan", revenue: 40 },
    { month: "Feb", revenue: 30 },
    { month: "Mar", revenue: 50 },
    { month: "Apr", revenue: 80 },
    { month: "May", revenue: 85 },
    { month: "Jun", revenue: 90 },
    { month: "Jul", revenue: 80 },
    { month: "Aug", revenue: 80 },
    { month: "Sep", revenue: 80 },
    { month: "Oct", revenue: 85 },
    { month: "Nov", revenue: 20 },
    { month: "Dec", revenue: 80 },
  ];
  const plansData = [
    { name: "Basic", value: 60, color: blue },
    { name: "Premium", value: 20, color: yellow },
    { name: "Enterprise", value: 20, color: red },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-golos">
      <div className="bg-white dark:bg-darkBg border border-lightGray dark:border-darkGray rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-lightGray dark:border-darkGray">
          <h2 className="font-semibold text-lg">Companies</h2>
          <button className="flex items-center text-sm border rounded-md px-2 py-1 text-gray-600 dark:text-white">
            <Calendar className="w-4 h-4 mr-1" />
            This Week <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={companiesData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <Bar dataKey="value" radius={[10, 10, 0, 0]} fill={blue} />
          </BarChart>
        </ResponsiveContainer>

        <p className="text-sm text-center mt-2 font-medium">
          <span className="text-green-600">↑ 12.5% </span>
          from last month
        </p>
      </div>

      {/* Revenue div */}
      <div className="cols-span-2 bg-white dark:bg-darkBg border border-lightGray dark:border-darkGray rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-lightGray dark:border-darkGray">
          <h2 className="font-semibold text-lg">Revenue</h2>
          <button className="flex items-center text-sm border rounded-md px-2 py-1 text-gray-600 dark:text-white">
            <Calendar className="w-4 h-4 mr-1" />
            2025 <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[1rem] font-bold mb-1">$89,878.58</p>
            <p className="text-sm font-medium">
              <span className="text-green-600">↑ 40% </span>
              increased from last year
            </p>
          </div>
          <p>Revenue</p>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={revenueData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={{
                fontSize: 12,
                fill: "#6B7280",
              }}
            />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="revenue" radius={[10, 10, 0, 0]} fill={blue} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Plans div */}
      <div className="bg-white dark:bg-darkBg border border-lightGray dark:border-darkGray rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-lightGray dark:border-darkGray">
          <h2 className="font-semibold text-lg">Top Plans</h2>
          <button className="flex items-center text-sm border rounded-md px-2 py-1 text-gray-600 dark:text-white">
            <Calendar className="w-4 h-4 mr-1" />
            Last 30 Days <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={plansData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
              >
                {plansData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-col items-start mt-4 w-full">
            {plansData.map((plan, index) => (
              <div key={index} className="flex justify-between w-full mb-1">
                <div className="flex items-center">
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: plan.color }}
                  ></span>
                  <span className="text-gray-700 dark:text-white text-sm">
                    {plan.name}
                  </span>
                </div>
                <span className="text-gray-700 dark:text-white text-sm font-medium">
                  {plan.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

// import React, { useEffect, useState } from "react";
// import { useAuth } from "../../auth/AuthContext";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";

// const DashboardStats = () => {
//   const { token } = useAuth();
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [filters, setFilters] = useState({
//     userId: "",
//     startDate: "",
//     endDate: "",
//   });

//   useEffect(() => {
//     fetchStats();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const fetchStats = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       // Build query string from filters
//       const queryParams = new URLSearchParams();
//       if (filters.userId) queryParams.append("userId", filters.userId);
//       if (filters.startDate) queryParams.append("startDate", filters.startDate);
//       if (filters.endDate) queryParams.append("endDate", filters.endDate);

//       const url = `https://crm-backend-qbz0.onrender.com/api/profiles/stats${
//         queryParams.toString() ? `?${queryParams.toString()}` : ""
//       }`;

//       const res = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         throw new Error(`Error: ${res.statusText}`);
//       }

//       const data = await res.json();
//       if (!data.success) throw new Error("Failed to fetch stats");

//       setStats(data.stats);
//     } catch (err) {
//       console.error("Error fetching stats:", err);
//       setError(err.message || "Failed to fetch statistics");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const handleFilter = () => {
//     fetchStats();
//   };

//   if (loading)
//     return <p className="text-center mt-10 text-gray-500">Loading stats...</p>;
//   if (error)
//     return (
//       <p className="text-center mt-10 text-red-500">
//         {error || "Something went wrong"}
//       </p>
//     );
//   if (!stats)
//     return <p className="text-center mt-10 text-gray-500">No data found.</p>;

//   const chartData = stats.byStatus.map((s) => ({
//     status: s._id,
//     count: s.count,
//   }));

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Profile Statistics Dashboard</h1>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 mb-6">
//         <input
//           type="text"
//           name="userId"
//           placeholder="User ID"
//           value={filters.userId}
//           onChange={handleInputChange}
//           className="border p-2 rounded w-48"
//         />
//         <input
//           type="date"
//           name="startDate"
//           value={filters.startDate}
//           onChange={handleInputChange}
//           className="border p-2 rounded"
//         />
//         <input
//           type="date"
//           name="endDate"
//           value={filters.endDate}
//           onChange={handleInputChange}
//           className="border p-2 rounded"
//         />
//         <button
//           onClick={handleFilter}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Apply Filters
//         </button>
//       </div>

//       {/* Summary */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
//         <div className="p-4 text-center shadow-md rounded bg-white">
//           <h2 className="text-gray-600 text-sm">Total Profiles</h2>
//           <p className="text-2xl font-bold">{stats.total}</p>
//         </div>

//         <div className="p-4 text-center shadow-md rounded bg-white">
//           <h2 className="text-gray-600 text-sm">Recent Submissions</h2>
//           <p className="text-2xl font-bold">{stats.recentSubmissions}</p>
//         </div>

//         <div className="p-4 text-center shadow-md rounded bg-white">
//           <h2 className="text-gray-600 text-sm">Unique Statuses</h2>
//           <p className="text-2xl font-bold">{stats.byStatus.length}</p>
//         </div>
//       </div>

//       {/* Chart */}
//       <div className="bg-white shadow rounded-lg p-6">
//         <h3 className="text-lg font-semibold mb-4">Profiles by Status</h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="status" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="count" fill="#3b82f6" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default DashboardStats;
