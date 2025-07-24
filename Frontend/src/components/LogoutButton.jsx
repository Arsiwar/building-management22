import React, { useContext } from 'react';
import { AuthContext } from "../context/AuthContext";


const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout(); // Appelle le backend
      alert("Déconnexion réussie");
      // Optionnel : redirection vers la page login
      // navigate("/login");
    } catch (err) {
      console.error("Erreur de déconnexion :", err);
    }
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
      Déconnexion
    </button>
  );
};

export default LogoutButton;
