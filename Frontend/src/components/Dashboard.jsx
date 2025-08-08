import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import IMTMap from "../components/IMTMap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ico from '@/assets/genie-civil.png';
import icon from '@/assets/salles.png';
import icone from '@/assets/marker.png';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correction du bug d'icône par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Dashboard = () => {
  const { user, accessToken, refreshToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 403) {
          try {
            await refreshToken();
          } catch (err) {
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
    console.log("Logout triggered");
    try {
      await logout();
      console.log("Logout successful, navigating to /login");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-700">
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 animate-shimmer"
          style={{ background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)" }}
        />
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
                    Bienvenue,{' '}
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
                  className="bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-300 opacity-100"
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

      <div className="grid grid-cols-3 gap-6 mx-6 mt-6 mb-8">
        <Card className="bg-gradient-to-br from-gray-100 to-gray-200 shadow-md hover:shadow-lg transition-all duration-300 border-0 group">
          <CardContent className="p-6 text-center flex flex-col items-center justify-center">
            <div className="text-3xl mb-2 group-hover:animate-bounce ">
              <img src={ico} alt="Campus" style={{ width: '48px', marginBottom: '8px' }} />
            </div>
            <div className="text-2xl font-bold text-blue-600">5</div>
            <div className="text-sm text-gray-600">Bâtiments</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-100 to-gray-200 shadow-md hover:shadow-lg transition-all duration-300 border-0 group">
          <CardContent className="p-6 text-center flex flex-col items-center justify-center">
            <div className="text-3xl mb-2 group-hover:animate-bounce">
         <img src={icon} alt="Campus" style={{ width: '48px', marginBottom: '8px' }} />
            </div>
            <div className="text-2xl font-bold text-blue-600">120+</div>
            <div className="text-sm text-gray-600">Salles</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-100 to-gray-200 shadow-md hover:shadow-lg transition-all duration-300 border-0 group">
          <CardContent className="p-6 text-center flex flex-col items-center justify-center">
            <div className="text-3xl mb-2 group-hover:animate-bounce">
             <img src={icone} alt="Campus" style={{ width: '48px', marginBottom: '8px' }} /> 
            </div>
            <div className="text-2xl font-bold text-blue-600">Douai</div>
            <div className="text-sm text-gray-600">Centre de recherche</div>
          </CardContent>
        </Card>
      </div>

      {/* Carte de localisation IMT avec react-leaflet */}
      <div className="mx-6 mb-8">
        <Card className="bg-gray-100 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-600 flex items-center space-x-2">
              <span>📍</span>
              <span>Localisation IMT</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MapContainer center={[50.3754, 3.0813]} zoom={15} style={{ height: '400px', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[50.3917, 3.0776]}>
                <Popup>IMT Nord Europe - centre de recherche Douai</Popup>
              </Marker>
            </MapContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mx-6 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
        <IMTMap />
      </div>
    </div>
  );
};

export default Dashboard;