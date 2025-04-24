import { useEffect, useState } from "react";
import "./Analytics.scss";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getStatistic } from "../../redux/apiCalls";

const usersPerMonth = [
  { month: "January", users: 120 },
  { month: "February", users: 98 },
  { month: "March", users: 110 },
  { month: "April", users: 95 },
  { month: "May", users: 130 },
  { month: "June", users: 140 },
  { month: "July", users: 115 },
  { month: "August", users: 150 },
  { month: "September", users: 120 },
  { month: "October", users: 125 },
  { month: "November", users: 90 },
  { month: "December", users: 100 },
];
const productsPerMonth = [
  { month: "January", total: 250 },
  { month: "February", total: 300 },
  { month: "March", total: 280 },
  { month: "April", total: 310 },
  { month: "May", total: 400 },
  { month: "June", total: 350 },
  { month: "July", total: 370 },
  { month: "August", total: 420 },
  { month: "September", total: 390 },
  { month: "October", total: 450 },
  { month: "November", total: 480 },
  { month: "December", total: 500 },
];

const Analytics = () => {
  const [userData, setUserData] = useState([]);
  const [productData, setProductData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const usersPerMonth = await getStatistic("user");
      const productPerMonth = await getStatistic();
      setUserData(usersPerMonth);
      setProductData(productPerMonth);
    }
    fetchData();
  }, []);
  return (
    <div className="analytics">
      <div className="item user">
        <h2>Total user activity in this year</h2>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={userData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#8884d8"
              fill="#1b6392"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="item product">
        <h2>Total product in this year</h2>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={productData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#fa8232"
              fill="#fa8232"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
