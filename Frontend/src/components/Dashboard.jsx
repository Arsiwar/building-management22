import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import IMTMapComponent from "../components/IMTMap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ico from "@/assets/genie-civil.png";
import icon from "@/assets/salles.png";
import icone from "@/assets/marker.png";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { buildings } from "../utils/buildingsData";

// Correction du bug d'icône par défaut Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Icône personnalisée
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Dashboard = () => {
  const { user, refreshToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const interceptor = axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (error.response?.status === 403) {
          try {
            await refreshToken();
          } catch {
            navigate("/login");
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [user, refreshToken, navigate]);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  const handleClick = (buildingId) => {
    navigate(`/building/${buildingId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-700">
      <div className="relative overflow-hidden">
        <Card className="mx-6 mt-6 shadow-lg border-0 animate-fade-in bg-white">
          <CardHeader className="pb-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="text-4xl font-bold animate-scale-in">
                  <span>🏛️</span>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                    Dashboard Administrateur
                  </span>
                </CardTitle>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-lg text-gray-700">
                    Bienvenue,{" "}
                    <span className="font-semibold text-blue-600">
                      {user.first_name || "Utilisateur"} {user.last_name || ""}
                    </span>
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>📧</span>
                  <span>{user.email || "Non défini"}</span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-3">
                <LogoutButton
                  className="bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-300"
                  onClick={handleLogout}
                />
                <div className="text-xs text-gray-600 bg-gray-200 px-3 py-1 rounded-lg">
                  Campus IMT Nord Europe
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mx-6 mt-6 mb-8">
        <Card className="bg-gradient-to-br from-gray-100 to-gray-200 shadow-md hover:shadow-lg transition-all duration-300 border-0 group">
          <CardContent className="p-6 text-center flex flex-col items-center justify-center">
            <img src={ico} alt="Bâtiments" style={{ width: "48px", marginBottom: "8px" }} />
            <div className="text-2xl font-bold text-blue-600">{buildings.length}</div>
            <div className="text-sm text-gray-600">Bâtiments</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-100 to-gray-200 shadow-md hover:shadow-lg transition-all duration-300 border-0 group">
          <CardContent className="p-6 text-center flex flex-col items-center justify-center">
            <img src={icon} alt="Salles" style={{ width: "48px", marginBottom: "8px" }} />
            <div className="text-2xl font-bold text-blue-600">120+</div>
            <div className="text-sm text-gray-600">Salles</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-100 to-gray-200 shadow-md hover:shadow-lg transition-all duration-300 border-0 group">
          <CardContent className="p-6 text-center flex flex-col items-center justify-center">
            <img src={icone} alt="Douai" style={{ width: "48px", marginBottom: "8px" }} />
            <div className="text-2xl font-bold text-blue-600">Douai</div>
            <div className="text-sm text-gray-600">Centre de recherche</div>
          </CardContent>
        </Card>
      </div>

      {/* Carte */}
      <div className="mx-6 mb-8">
        <Card className="bg-gray-100 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-600 flex items-center space-x-2">
              <span>📍</span>
              <span>Localisation IMT</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MapContainer
              center={[50.384874, 3.085626]} // Centre sur Bâtiment A
              zoom={15}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {buildings.map((b) => (
                <Marker
                  key={b.id}
                  position={b.coordinates}
                  icon={customIcon}
                  eventHandlers={{
                    
                  }}
                >
                  <Popup>
                    <button
                      onClick={() => handleClick(b.id)}
                      style={{
                        backgroundColor: "#d37bbdff",
                        color: "#fff",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        transition: "background-color 0.3s ease, transform 0.2s ease",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#c22f80ff";
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "#810566ff";
                        e.target.style.transform = "scale(1)";
                      }}
                    >
                      Voir les salles de {b.name} {b.icon}
                    </button>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </CardContent>
        </Card>
      </div>

      {/* Garde l'autre composant carte */}
      <div className="mx-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <IMTMapComponent />
      </div>
    </div>
  );
};

export default Dashboard;