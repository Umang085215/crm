import React from "react";
import DashboardCard from "../components/cards/DashboardCard";
import img1 from "../assets/adminImages/d1.png";
import img2 from "../assets/adminImages/d2.png";
import img3 from "../assets/adminImages/d3.png";
import img4 from "../assets/adminImages/d4.png";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const products = [
  {
    id: 1,
    name: "Apple Juice",
    category: "Juice",
    price: "999",
    stock: 25,
  },
  {
    id: 2,
    name: "Lemon Juice",
    category: "Juice",
    price: "150",
    stock: 50,
  },
  {
    id: 3,
    name: "Banana shake",
    category: "Shake",
    price: "899",
    stock: 30,
  },
  {
    id: 4,
    name: "Grapes juice",
    category: "Juice",
    price: "499",
    stock: 10,
  },
];

const pieData = [
  { name: "Javascript", value: 400 },
  { name: "React", value: 300 },
  { name: "Java", value: 250 },
  { name: "MERN", value: 500 },
  { name: "Others", value: 200 },
];

const barData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4000 },
  { name: "May", sales: 6000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#fb06ab"];

const SuperDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <DashboardCard
          title="Total Orders"
          value="2.5K"
          ratio="10% Increase"
          img={img1}
          color="green"
        />
        <DashboardCard
          title="Total Sales"
          value="5.2k"
          ratio="5% Increase"
          img={img2}
          color="green"
        />
        <DashboardCard
          title="Customers"
          value="25k"
          ratio="2% Decrease"
          img={img3}
          color="red"
        />
        <DashboardCard
          title="People Online"
          value="8"
          img={img4}
          color="green"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="border border-lightGray dark:border-darkGray rounded-xl p-4">
          <h2 className="text-xl font-bold mb-4 ">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="border border-lightGray dark:border-darkGray rounded-xl p-4 ">
          <h2 className="text-xl font-bold mb-4">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#fb6506" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Details Table */}
      <div className="border border-lightGray dark:border-darkGray rounded-xl p-4  overflow-x-auto">
        <h2 className="text-xl font-bold mb-4 ">Product Details</h2>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-[#e0f2e9] text-[#003b19]">
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{product.id}</td>
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.category}</td>
                <td className="py-2 px-4">{product.price}</td>
                <td className="py-2 px-4">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperDashboard;
