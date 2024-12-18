
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { db } from '../firebase'; // Importation de la configuration Firebase
import { collection, getDocs } from "firebase/firestore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const Dashboard = () => {
  // États pour les données
  const [ordersData, setOrdersData] = useState([]);
  const [produitsData, setProduitsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [messagesData, setMessagesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour les graphiques
  const [barData, setBarData] = useState({});
  const [lineData, setLineData] = useState({});
  const [doughnutData, setDoughnutData] = useState({});

  // Récupération des données Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Récupérer les commandes (orders)
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const orders = [];
        ordersSnapshot.forEach((doc) => {
          orders.push(doc.data());
        });

        // 2. Récupérer les produits
        const produitsSnapshot = await getDocs(collection(db, 'produit'));
        const produit = [];
        produitsSnapshot.forEach((doc) => {
          produit.push(doc.data());
        });

        // 3. Récupérer les utilisateurs
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = [];
        usersSnapshot.forEach((doc) => {
          users.push(doc.data());
        });

        // 4. Récupérer les catégories
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categories = [];
        categoriesSnapshot.forEach((doc) => {
          categories.push(doc.data());
        });

        // 5. Récupérer les messages
        const messagesSnapshot = await getDocs(collection(db, 'messages'));
        const messages = [];
        messagesSnapshot.forEach((doc) => {
          messages.push(doc.data());
        });

        // Mise à jour des états
        setOrdersData(orders);
        setProduitsData(produit);
        setUsersData(users);
        setCategoriesData(categories);
        setMessagesData(messages);

        setLoading(false);

        // Préparer les graphiques
        prepareChartData(orders, produit, categories);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, []);

  // Préparation des données pour les graphiques
  const prepareChartData = (orders, produits, categories) => {
    // 1. Ventes par date (bar chart)
    const dates = orders.map((order) => {
      const date = new Date(order.timestamp); // Convertir le timestamp en objet Date
      return date.toLocaleDateString(); // Formater la date (ex : "12/18/2024")
    });
    
    const totals = orders.map((order) => order.totalAmount); // Champ hypothétique: "total"
    
    setBarData({
      labels: dates,
      datasets: [
        {
          label: 'Ventes par date (€)',
          data: totals,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    });
    

    // 2. Tendance des ventes (line chart)
    setLineData({
      labels: dates,
      datasets: [
        {
          label: 'Tendance des ventes',
          data: totals,
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
        },
      ],
    });

    // 3. Répartition des produits par catégories (doughnut chart)
    const categoryCounts = categories.reduce((acc, categories) => {
      acc[categories.name] = (acc[categories.name] || 0) + 1; // Champ hypothétique: "nom"
      return acc;
    }, {});

    setDoughnutData({
      labels: Object.keys(categoryCounts),
      datasets: [
        {
          data: Object.values(categoryCounts),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        },
      ],
    });
  };

  if (loading) {
    return <div>Chargement des données...</div>;
  }

  return (
    <Container fluid>
      {/* Statistiques principales */}
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <h5>Total des commandes</h5>
              <h2>{ordersData.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <h5>Nombre total de produits</h5>
              <h2>{produitsData.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <h5>Nombre d'utilisateurs</h5>
              <h2>{usersData.length}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Graphiques */}
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <h5>Ventes par date</h5>
              <Bar data={barData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <h5>Tendance des ventes</h5>
              <Line data={lineData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="offset-md-3">
          <Card className="mb-4">
            <Card.Body>
              <h5>Répartition des produits par catégories</h5>
              <Doughnut data={doughnutData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
