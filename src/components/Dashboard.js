import React, { useState, useEffect } from 'react';
import { db } from '../firebase';  // Import Firebase
import { collection, getDocs } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState([]);  // Sales data for the chart
  const [labels, setLabels] = useState([]);  // Labels for the chart (e.g., days)
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalSales: 0,
    salesByCategory: {},  // Sales by category
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);  // Start loading

        // Fetch user data from Firestore
        const userSnapshot = await getDocs(collection(db, 'users'));
        const users = userSnapshot.docs.map(doc => doc.data());
        setMetrics(prevState => ({
          ...prevState,
          totalUsers: users.length,  // Set total users
        }));

        // Fetch category data from Firestore
        const categorySnapshot = await getDocs(collection(db, 'categories'));
        const categories = categorySnapshot.docs.map(doc => doc.data().name); // Assuming each category has a 'name' field

        // Fetch sales data from Firestore
        const salesSnapshot = await getDocs(collection(db, 'sales'));
        const salesData = salesSnapshot.docs.map(doc => doc.data());  // Assuming sales have an 'amount' and 'categoryId'
        
        // Initialize sales by category object
        const salesByCategory = categories.reduce((acc, category) => {
          acc[category] = 0;
          return acc;
        }, {});

        // Calculate total sales and sales by category
        let totalSales = 0;
        const salesAmounts = salesData.map(sale => {
          const category = categories.find(c => c.id === sale.categoryId);  // Find category by ID
          if (category) {
            salesByCategory[category.name] += sale.amount;  // Add to corresponding category sales
          }
          totalSales += sale.amount;
          return sale.amount;
        });

        // Create labels for chart (Day 1, Day 2, etc.)
        const salesLabels = salesSnapshot.docs.map((_, index) => `Day ${index + 1}`);
        
        // Set state with fetched data
        setData(salesAmounts);
        setLabels(salesLabels);
        setMetrics(prevState => ({
          ...prevState,
          totalSales: totalSales,  // Set total sales
          salesByCategory: salesByCategory,  // Set sales by category
        }));

        setLoading(false);  // Set loading to false after data fetch
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);  // Set loading to false if there's an error
      }
    };

    fetchData();
  }, []);

  // Chart data for displaying sales over time
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Sales Over Time',
        data: data,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  // Conditional rendering to show loading state while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <div>
        <h2>Key Metrics</h2>
        <p><strong>Total Users:</strong> {metrics.totalUsers}</p>
        <p><strong>Total Sales:</strong> ${metrics.totalSales}</p>

        <h2>Sales by Category</h2>
        <ul>
          {Object.entries(metrics.salesByCategory).map(([category, sales]) => (
            <li key={category}><strong>{category}:</strong> ${sales}</li>
          ))}
        </ul>

        <h2>Sales Over Time</h2>
        {/* Render the chart only when chartData is valid */}
        {data.length > 0 && labels.length > 0 && (
          <Line data={chartData} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
