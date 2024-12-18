import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SellProductForm from './SellProductForm'; // Import the SellProductForm component
import AjouterUtilisateur from './AjouterUtilisateur'; // Import the AjouterUtilisateur component
import SupprimerProduit from './SupprimerProduit'; // Import the SupprimerProduit component
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS import
import './AdminInterface.css'; // Local CSS import
import SupprimerUtilisateur from "./SupprimerUtilisateur"; // Import the SupprimerUtilisateur component
import ConsulterCanal from './ConsulterCanal'; // Import the ConsulterCanal component
import Dashboard from './Dashboard';
import GererAvis from './GererAvis';

const AdminInterface = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false); // State for "Ajouter Utilisateur" modal
  const [showAddProductModal, setShowAddProductModal] = useState(false); // State for "Ajouter Produit" modal
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for "SupprimerProduit" modal
  const [menuOpen, setMenuOpen] = useState(true); // State to toggle the menu
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false); // State for deleting user modal
  const [showCanalModal, setShowCanalModal] = useState(false); // State for "Consulter Canal" modal
  const [showDashboardModal, setShowDashboardModal] = useState(false); // State for "Consulter Canal" modal
  const[showAvisModal, setShowAvisModal]=useState(false);


  const handleDeleteUser = () => {
    setShowDeleteUserModal(true);
    setShowAddUserModal(false); // Show the delete user modal
  };

  const handleAddProduct = () => {
    setShowAddProductModal(true); // Show the product selling form
    setShowAddUserModal(false); // Ensure "Ajouter Utilisateur" modal is closed
  };

  const handleAddUser = () => {
    setShowAddUserModal(true); // Show the add user form
    setShowAddProductModal(false); // Ensure "Ajouter Produit" modal is closed
  };

  const handleViewDashboard = () => {
    setShowDashboardModal(true); // Show the add user form
    
  };
  const handleGererAvis = () => {
    setShowAvisModal(true); // Set to true
    
  };
  

  const handleConsultCanal = () => {
    setShowCanalModal(true); // Open the "Consulter Canal" modal
  };

  const closeAddUserModal = () => {
    setShowAddUserModal(false); // Close the "Ajouter Utilisateur" modal
  };

  const closeAddProductModal = () => {
    setShowAddProductModal(false); // Close the "Ajouter Produit" modal
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true); // Open the "SupprimerProduit" modal
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false); // Close the "SupprimerProduit" modal
  };

 

  return (
    <div className="container-fluid vh-100 d-flex">
      {/* Sidebar */}
      <div className={`cute-sidebar ${menuOpen ? 'open' : 'collapsed'}`}>
        <button
          className="toggle-menu btn btn-light mb-4 w-100 rounded-pill"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? 'Collapse Menu ✖' : '☰'}
        </button>
        <ul className="menu-items list-unstyled">
          <li className="menu-item">
            <button className="menu-link" onClick={handleAddUser}>
              <i className="bi bi-person-plus"></i>
              {menuOpen && <span>Add User</span>}
            </button>
          </li>
          <li className="menu-item">
            <button className="menu-link" onClick={handleDeleteUser}>
              <i className="bi bi-person-dash"></i>
              {menuOpen && <span>Delete User</span>}
            </button>
          </li>
          <li className="menu-item">
            <button className="menu-link" onClick={handleAddProduct}>
              <i className="bi bi-bag-plus"></i>
              {menuOpen && <span>Add Product</span>}
            </button>
          </li>
          <li className="menu-item">
            <button className="menu-link" onClick={openDeleteModal}>
              <i className="bi bi-bag-dash"></i>
              {menuOpen && <span>Delete Product</span>}
            </button>
          </li>
          <li className="menu-item">
            <button className="menu-link" onClick={handleViewDashboard}>
              <i className="bi bi-graph-up"></i>
              {menuOpen && <span> Dashboard</span>}
            </button>
          </li>
          <li className="menu-item">
            <button className="menu-link" onClick={handleConsultCanal}>
              <i className="bi bi-chat-dots"></i>
              {menuOpen && <span>Handle discussion channel</span>}
            </button>
          </li>
          <li className="menu-item">
            <button className="menu-link" onClick={handleGererAvis}>
              <i className="bi bi-chat-dots"></i>
              {menuOpen && <span>Handle reviews</span>}
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <h2>Admin Dashboard</h2>
        <p>Welcome to the Admin Dashboard. Manage users, products, and other administrative actions.</p>

        {/* Render the AjouterUtilisateur Modal if showAddUserModal is true */}
        {showAddUserModal && (
          <div className="modal-overlay" onClick={closeAddUserModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <AjouterUtilisateur />
            </div>
          </div>
        )}

        {/* Render the SellProductForm Modal if showAddProductModal is true */}
        {showAddProductModal && (
          <div className="modal-overlay" onClick={closeAddProductModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <SellProductForm />
            </div>
          </div>
        )}

        {/* Render the SupprimerProduit Modal if showDeleteModal is true */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={closeDeleteModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <SupprimerProduit />
            </div>
          </div>
        )}

        {/* Render the SupprimerUtilisateur Modal if showDeleteUserModal is true */}
        {showDeleteUserModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteUserModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <SupprimerUtilisateur />
            </div>
          </div>
        )}

        {/* Render the SupprimerUtilisateur Modal if showDeleteUserModal is true */}
        {showDashboardModal && (
          <div className="modal-overlay" onClick={() => setShowDashboardModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <Dashboard />
            </div>
          </div>
        )}

        {/* Render the ConsulterCanal Modal if showCanalModal is true */}
        {showCanalModal && (
          <div className="modal-overlay" onClick={() => setShowCanalModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <ConsulterCanal />
            </div>
          </div>
        )}

        {showAvisModal && (
          <div className="modal-overlay" onClick={() => setShowAvisModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <GererAvis />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInterface;
