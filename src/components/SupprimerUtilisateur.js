import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Import Firebase configuration
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const SupprimerUtilisateur = ({ closeModal }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch users from Firestore when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (!userId) {
      alert("Please select a user to delete.");
      return;
    }

    if (userId === "admin") {
      alert("The admin account cannot be deleted.");
      return;
    }

    setLoading(true);
    try {
      await deleteDoc(doc(db, "users", userId)); // Delete user from Firestore
      setUsers(users.filter((user) => user.id !== userId)); // Remove deleted user from state
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h3>Supprimer Utilisateur</h3>
      <div>
        <ul>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            users.map((user) => (
              <li key={user.id} className="mb-3">
                <strong>{user.name}</strong> ({user.email || "No email"}){" "}
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => setSelectedUserId(user.id)}
                >
                  Select
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {selectedUserId && (
        <div className="mt-4">
          <h5>Are you sure you want to delete this user?</h5>
          <button
            className="btn btn-danger me-2"
            onClick={() => handleDeleteUser(selectedUserId)}
            disabled={loading}
          >
            Confirm Delete
          </button>
          <button className="btn btn-secondary" onClick={() => setSelectedUserId(null)}>
            Cancel
          </button>
        </div>
      )}

      <button className="btn btn-secondary mt-4" onClick={closeModal}>
        Close
      </button>
    </div>
  );
};

export default SupprimerUtilisateur;
