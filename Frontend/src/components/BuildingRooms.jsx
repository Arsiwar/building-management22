import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import LogoutButton from './LogoutButton';
import jsPDF from 'jspdf';
import axios from 'axios';

// Configuration des bâtiments
const buildingsData = {
  'A': { id: 'A', name: 'Bâtiment A - Administration', icon: '🏛️', description: 'Services administratifs et direction' },
  'B': { id: 'B', name: 'Bâtiment B - Laboratoires', icon: '🔬', description: 'Laboratoires de recherche avancée' },
  'C': { id: 'C', name: 'Bâtiment C - Enseignement', icon: '📚', description: 'Amphithéâtres et salles de cours' },
  'D': { id: 'D', name: 'Bâtiment D - Innovation', icon: '💡', description: 'Centre d\'innovation technologique' },
  'E': { id: 'E', name: 'Bâtiment E - Bibliothèque', icon: '📖', description: 'Bibliothèque et espaces d\'étude' }
};
// Coordonnées approximatives des bâtiments autour de IMT Nord Europe
const buildings = [
  { name: "A:", coords: [50.384874, 3.085626] },
  { name: "B", coords: [50.385111, 3.084750] },
  { name: "C", coords: [50.385556, 3.084444] },
  {name:  'D', coords:[50.3758, 3.0817]},
  {name:  'E',coords: [50.3750, 3.0809]},
];
// Types de salles
const roomTypes = [
  { type: 'Amphithéâtre', icon: '🎭', capacity: 150, equipment: ['Projecteur 4K', 'Système audio', 'Éclairage LED'] },
  { type: 'Salle de cours', icon: '📖', capacity: 30, equipment: ['Tableau interactif', 'WiFi', 'Climatisation'] },
  { type: 'Laboratoire', icon: '🔬', capacity: 20, equipment: ['Équipement spécialisé', 'Paillasses', 'Hotte aspirante'] },
  { type: 'Salle de réunion', icon: '🤝', capacity: 12, equipment: ['Écran tactile', 'Visioconférence', 'WiFi'] },
  { type: 'Bureau', icon: '💼', capacity: 4, equipment: ['WiFi', 'Téléphone', 'Mobilier ergonomique'] },
  { type: 'Salle informatique', icon: '💻', capacity: 25, equipment: ['PC dernière génération', 'Logiciels spécialisés', 'WiFi'] }
];

// Génération dynamique des salles
/*const generateRooms = (buildingId) => {
  const rooms = [];
  for (let floor = 0; floor <= 2; floor++) {
    for (let room = 1; room <= 8; room++) {
      const roomNumber = `${buildingId}${floor}${room.toString().padStart(2, '0')}`;
      const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
      rooms.push({
        id: roomNumber,
        name: roomNumber,
        icon: roomType.icon,
        type: roomType.type,
        capacity: roomType.capacity + Math.floor(Math.random() * 20),
        equipment: roomType.equipment,
        available: Math.random() > 0.25,
        floor: floor === 0 ? 'Rez-de-chaussée' : `${floor}${floor === 1 ? 'er' : 'ème'} étage`,
        description: `${roomType.type} moderne équipée pour l'excellence académique`
      });
    }
  }
  return rooms;
};*/

const BuildingRooms = () => {
  const { buildingId } = useParams();
  const navigate = useNavigate();
  // Liste des salles du backend
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(15); // État pour suivre le zoom
  
  useEffect(() => {
    if (buildingId) {
      // generateRooms par une requête au backend
      axios.get(`http://localhost:5000/api/rooms/${buildingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` } 
      })
        .then(response => {
          setRooms(response.data); // Met les salles du backend
          setLoading(false);
        })
        .catch(error => {
          console.error('Erreur:', error); 
          setLoading(false);
        });
    }
  }, [buildingId]); 

  if (loading) return <p>Chargement...</p>; 

  if (!buildingId || !buildingsData[buildingId]|| rooms.length === 0) {

  /*useEffect(() => {
    if (buildingId) {
      setRooms(generateRooms(buildingId));
    }
  }, [buildingId]);

  if (!buildingId || !buildingsData[buildingId]) {*/
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-center">
        <Card className="bg-gray-100 shadow-lg border-0 max-w-md">
          <CardContent className="text-center py-8">
           <h2 className="text-xl font-semibold mb-4">{!buildingId ? '❌ Bâtiment non trouvé' : '❌ Aucune salle disponible'}</h2>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-600 to-blue-400"
            >
              🏠 Retour au dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const building = buildingsData[buildingId];

  const openModal = (equipment) => {
  setSelectedEquipment(equipment);
};

const closeModal = () => {
  setSelectedEquipment(null);
};

const downloadPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Fiche d'équipement : ${selectedEquipment.name}`, 10, 10);
  doc.setFontSize(12);
  doc.text(`Description : Cet équipement est un ${selectedEquipment.name.toLowerCase()} de haute qualité, conçu pour une utilisation optimale dans les salles de l'IMT.`, 10, 20);
  doc.text(`État : ${selectedEquipment.status || 'Inconnu'}`, 10, 30);
  doc.text('Manuel : Disponible sur demande auprès de l\'administration.', 10, 40);
  doc.save(`fiche_${selectedEquipment.name.toLowerCase()}.pdf`);
};
 
  const getStatusColor = (status) => {
  switch (status) {
    case 'Réservée':
      return 'bg-red-200 text-red-800 border-red-300';
    case 'En maintenance':
      return 'bg-yellow-200 text-yellow-800 border-yellow-300';
    case 'Disponible':
      return 'bg-green-200 text-green-800 border-green-300';
    default:
      return 'bg-gray-200 text-gray-800 border-gray-300';
  }
};
const handleMapZoom = (map) => {
  map.on("zoomend", () => {
    setZoomLevel(map.getZoom());
    console.log("Zoom level:", map.getZoom()); // Vérifie dans la console
  });
};
  const handleBuildingClick = (buildingId) => {
    navigate(`/building/${buildingId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-700">
      {/* Header avec retour */}
      <div className="mb-8">
        <Card className="mx-6 mt-6 bg-gray-100 shadow-lg border-0 animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="border-blue-200 hover:bg-gray-100 transition-all duration-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au campus
                </Button>
                <div>
                  <CardTitle className="text-3xl font-bold flex items-center space-x-3">
                    <span className="text-4xl">{building?.icon}</span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                      {building?.name}
                    </span>
                  </CardTitle>
                  <p className="text-gray-600 mt-1">{building?.description}</p>
                </div>
              </div>
              <LogoutButton />
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Stats du bâtiment */}
      <div className="grid grid-cols-4 sm:grid-cols-1 gap-6 mx-6 mb-8">
        <Card className="bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300 border-0 group">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-1 group-hover:animate-float">🚪</div>
            <div className="text-xl font-bold text-blue-600">{rooms.length}</div>
            <div className="text-xs text-gray-600">Salles totales</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300 border-0 group">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-1 group-hover:animate-float">✅</div>
            <div className="text-xl font-bold text-green-600">
              {rooms.filter(room => room.available).length}
            </div>
            <div className="text-xs text-gray-600">Disponibles</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300 border-0 group">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-1 group-hover:animate-float">👥</div>
            <div className="text-xl font-bold text-yellow-600">
              {Math.max(...rooms.map(room => room.capacity))}
            </div>
            <div className="text-xs text-gray-600">Capacité max</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300 border-0 group">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-1 group-hover:animate-float">📊</div>
            <div className="text-xl font-bold text-blue-600">
              {Math.round((rooms.filter(room => room.available).length / rooms.length) * 100)}%
            </div>
            <div className="text-xs text-gray-600">Taux dispo.</div>
          </CardContent>
        </Card>
      </div>
      {/* Carte interactive des bâtiments */}
      <div className="mx-6 mb-8">
        <Card className="bg-gray-100 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-600 flex items-center space-x-2">
              <span>📍</span>
              <span>Carte des bâtiments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MapContainer
              center={[50.3754, 3.0813]} // Centre sur IMT Nord Europe
              zoom={15} // Zoom initial
              style={{ height: '400px', width: '100%' }}
              whenCreated={handleMapZoom} // Capture l'instance de la carte
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {zoomLevel > 17 &&
                Object.entries(buildingsCoords).map(([id, coords]) => {
                  const building = buildingsData[id];
                  return (
                    <Marker
                      key={id}
                      position={coords}
                      eventHandlers={{
                        click: () => handleBuildingClick(id),
                      }}
                    >
                      <Popup>
                        <button
                          onClick={() => handleBuildingClick(id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "blue",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          Voir les salles de {building.name}
                        </button>
                      </Popup>
                    </Marker>
                  );
                })}
            </MapContainer>
          </CardContent>
        </Card>
      </div>

      {/* Liste des salles avec design amélioré */}
      <div className="mx-6 pb-8">
        <Card className="bg-gray-100 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-600 flex items-center space-x-2">
              <span>🏛️</span>
              <span>Salles disponibles</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-1 gap-6">
              {rooms.map((room, index) => (
                <Card 
                  key={room.id} 
                  className={`transition-all duration-300 hover:shadow-md border-0 animate-fade-in ${
                    room.available 
                      ? 'bg-gray-100 hover:scale-105' 
                      : 'bg-gray-200 opacity-75'
                  }`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-blue-600 flex items-center space-x-2">
                          <span>{room.icon}</span>
                          <span>{room.name}</span>
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{room.type}</p>
                      </div>
                      <Badge 
                        variant={room.available ? "default" : "secondary"}
                        className={room.available 
                          ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" 
                          : "bg-gray-400"
                        }
                      >
                        {room.available ? '✅ Libre' : '❌ Occupée'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">👥 Capacité:</span>
                        <span className="font-medium text-blue-600">{room.capacity} personnes</span>
                      </div>
                      
                      {room.equipment && room.equipment.length > 0 && (
  <div>
    <p className="text-sm text-gray-600 mb-2">🛠️ Machines:</p>
    <div className="flex flex-wrap gap-1">
      {room.equipment.slice(0, 3).map((machine, index) => (
        <Badge
          key={index}
          variant="outline"
          className={`text-xs border-blue-200 cursor-pointer hover:bg-blue-100 ${getStatusColor(machine.status || 'Disponible')}`}
          onClick={() => openModal(machine)}
        >
          {machine.name} ({machine.status || 'Inconnu'})
        </Badge>
      ))}
      {room.equipment.length > 3 && (
        <Badge variant="outline" className="text-xs border-blue-200">
          +{room.equipment.length - 3}
        </Badge>
      )}
    </div>
  </div>
)}
                      
                      <div className="pt-2 border-t border-blue-200">
                        <p className="text-xs text-gray-600">
                          💡 {room.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modale pour les équipements */}
      {selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-blue-600">
                   Détails de la machine : {selectedEquipment.name}
              </CardTitle>
              <Button 
                className="absolute top-4 right-4 bg-red-500 text-white hover:bg-red-600"
                onClick={closeModal}
              >
                X
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Description : Cet équipement est un {selectedEquipment.name.toLowerCase()} de haute qualité, conçu pour une utilisation optimale dans les salles de l'IMT.</p>
              <p className="text-gray-600 mt-2">État : Fonctionnel</p>
              <p className="text-gray-600 mt-2">Manuel : Disponible sur demande auprès de l'administration.</p>
              <Button 
                className="mt-4 bg-green-500 text-white hover:bg-green-600"
                onClick={downloadPDF}
              >
                Télécharger la fiche
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BuildingRooms;