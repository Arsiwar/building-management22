import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import LogoutButton from "./LogoutButton";
import jsPDF from "jspdf";
import axios from "axios";
import { buildings } from "../utils/buildingsData";

const roomTypes = [
  { type: "Amphithéâtre", icon: "🎭" },
  { type: "Salle de cours", icon: "📖" },
  { type: "Laboratoire", icon: "🔬" },
  { type: "Salle de réunion", icon: "🤝" },
  { type: "Bureau", icon: "💼" },
  { type: "Salle informatique", icon: "💻" },
];

const BuildingRooms = () => {
  const { buildingId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: "",
    equipment: [],
    floor: "",
    description: "",
    newEquipmentName: "",
    newEquipmentStatus: "",
  });
  const [editRoomId, setEditRoomId] = useState(null);

  useEffect(() => {
    if (buildingId) {
      fetchRooms();
    }
  }, [buildingId]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/rooms/${buildingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      setRooms(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des salles:", error);
      setLoading(false);
    }
  };

  if (loading) return <p>Chargement...</p>;

  const building = buildings.find((b) => b.id === buildingId);
  if (!buildingId || !building || rooms.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-center">
        <Card className="bg-gray-100 shadow-lg border-0 max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">
              {!buildingId ? "❌ Bâtiment non trouvé" : "❌ Aucune salle disponible"}
            </h2>
            <Button onClick={() => navigate("/dashboard")} className="bg-gradient-to-r from-blue-600 to-blue-400">
              🏠 Retour au dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const openModal = (equipment) => setSelectedEquipment(equipment);
  const closeModal = () => setSelectedEquipment(null);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Fiche d'équipement : ${selectedEquipment.name}`, 10, 10);
    doc.setFontSize(12);
    doc.text(
      `Description : Cet équipement est un ${selectedEquipment.name.toLowerCase()} de haute qualité, conçu pour une utilisation optimale dans les salles de l'IMT.`,
      10,
      20
    );
    doc.text(`État : ${selectedEquipment.status || "Inconnu"}`, 10, 30);
    doc.text("Manuel : Disponible sur demande auprès de l'administration.", 10, 40);
    doc.save(`fiche_${selectedEquipment.name.toLowerCase()}.pdf`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Réservée":
        return "bg-red-200 text-red-800 border-red-300";
      case "En maintenance":
        return "bg-yellow-200 text-yellow-800 border-yellow-300";
      case "Disponible":
        return "bg-green-200 text-green-800 border-green-300";
      default:
        return "bg-gray-200 text-gray-800 border-gray-300";
    }
  };

  const handleCreate = async () => {
    if (formData.name && formData.type && formData.capacity && formData.floor && formData.description) {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/rooms`,
          {
            name: formData.name,
            type: formData.type,
            capacity: parseInt(formData.capacity),
            equipment: formData.equipment,
            floor: formData.floor,
            description: formData.description,
            buildingId,
          },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` } }
        );
        setRooms([...rooms, response.data]);
        setFormData({
          name: "",
          type: "",
          capacity: "",
          equipment: [],
          floor: "",
          description: "",
          newEquipmentName: "",
          newEquipmentStatus: "",
        });
      } catch (error) {
        console.error("Erreur création:", error.response?.data || error.message);
      }
    }
  };

  const handleUpdate = async () => {
    if (editRoomId) {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/rooms/${editRoomId}`,
          {
            name: formData.name,
            type: formData.type,
            capacity: parseInt(formData.capacity),
            equipment: formData.equipment,
            floor: formData.floor,
            description: formData.description,
          },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` } }
        );
        setRooms(rooms.map((room) => (room._id === editRoomId ? response.data : room)));
        setEditRoomId(null);
        setFormData({
          name: "",
          type: "",
          capacity: "",
          equipment: [],
          floor: "",
          description: "",
          newEquipmentName: "",
          newEquipmentStatus: "",
        });
      } catch (error) {
        console.error("Erreur mise à jour:", error.response?.data || error.message);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      setRooms(rooms.filter((room) => room._id !== id));
    } catch (error) {
      console.error("Erreur suppression:", error.response?.data || error.message);
    }
  };

  const handleEdit = (room) => {
    setEditRoomId(room._id);
    setFormData({
      name: room.name,
      type: room.type,
      capacity: room.capacity,
      equipment: room.equipment || [],
      floor: room.floor,
      description: room.description,
      newEquipmentName: "",
      newEquipmentStatus: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-700">
      <div className="mb-8">
        <Card className="mx-6 mt-6 bg-gray-100 shadow-lg border-0 animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="border-blue-200 hover:bg-gray-100 transition-all duration-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au campus
                </Button>
                <div>
                  <CardTitle className="text-3xl font-bold flex items-center space-x-3">
                    <span className="text-4xl">{building.icon}</span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                      {building.name}
                    </span>
                  </CardTitle>
                  <p className="text-gray-600 mt-1">{building.description}</p>
                </div>
              </div>
              <LogoutButton />
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="mx-6 mb-8">
        <Card className="bg-gray-100 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-600">
              {editRoomId ? "Modifier la Salle" : "Ajouter une Salle"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Nom de la salle"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border border-gray-300 rounded p-2"
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="border border-gray-300 rounded p-2"
              >
                <option value="">Sélectionner un type</option>
                {roomTypes.map((type) => (
                  <option key={type.type} value={type.type}>
                    {type.type}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Capacité"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="border border-gray-300 rounded p-2"
              />
              <input
                placeholder="Étage"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="border border-gray-300 rounded p-2"
              />
              <input
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border border-gray-300 rounded p-2"
              />
              <div className="flex space-x-2">
                <input
                  placeholder="Nom de la machine"
                  value={formData.newEquipmentName || ""}
                  onChange={(e) => setFormData({ ...formData, newEquipmentName: e.target.value })}
                  className="border border-gray-300 rounded p-2 flex-1"
                />
                <select
                  value={formData.newEquipmentStatus || ""}
                  onChange={(e) => setFormData({ ...formData, newEquipmentStatus: e.target.value })}
                  className="border border-gray-300 rounded p-2 flex-1"
                >
                  <option value="">Statut</option>
                  <option value="Disponible">Disponible</option>
                  <option value="Réservée">Réservée</option>
                  <option value="En maintenance">En maintenance</option>
                </select>
              </div>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  if (formData.newEquipmentName && formData.newEquipmentStatus) {
                    setFormData({
                      ...formData,
                      equipment: [
                        ...formData.equipment,
                        { name: formData.newEquipmentName, status: formData.newEquipmentStatus },
                      ],
                      newEquipmentName: "",
                      newEquipmentStatus: "",
                    });
                  }
                }}
              >
                Ajouter une machine
              </Button>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button
                className="bg-green-500 hover:bg-green-600"
                onClick={editRoomId ? handleUpdate : handleCreate}
              >
                {editRoomId ? "Sauvegarder" : "Ajouter"}
              </Button>
              {editRoomId && (
                <Button
                  className="bg-gray-500 hover:bg-gray-600"
                  onClick={() => {
                    setEditRoomId(null);
                    setFormData({
                      name: "",
                      type: "",
                      capacity: "",
                      equipment: [],
                      floor: "",
                      description: "",
                      newEquipmentName: "",
                      newEquipmentStatus: "",
                    });
                  }}
                >
                  Annuler
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
            <div className="text-2xl mb-1 group-hover:animate-float">👥</div>
            <div className="text-xl font-bold text-yellow-600">
              {Math.max(...rooms.map((room) => room.capacity || 0))}
            </div>
            <div className="text-xs text-gray-600">Capacité max</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300 border-0 group">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-1 group-hover:animate-float">📊</div>
            <div className="text-xl font-bold text-blue-600">
              {rooms.length > 0 ? Math.round((rooms.filter((room) => room.available).length / rooms.length) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-600">Taux dispo.</div>
          </CardContent>
        </Card>
      </div>

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
                  key={room._id}
                  className="transition-all duration-300 hover:shadow-md border-0 animate-fade-in bg-gray-100 hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "both" }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-blue-600 flex items-center space-x-2">
                          <span>{roomTypes.find((t) => t.type === room.type)?.icon || "🏠"}</span>
                          <span>{room.name}</span>
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{room.type}</p>
                      </div>
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
                                className={`text-xs border-blue-200 cursor-pointer hover:bg-blue-100 ${getStatusColor(
                                  machine.status || "Disponible"
                                )}`}
                                onClick={() => openModal(machine)}
                              >
                                {machine.name} ({machine.status || "Inconnu"})
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
                        <p className="text-xs text-gray-600">💡 {room.description}</p>
                      </div>
                      <div className="flex space-x-2 mt-2">
                        <Button
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() => handleEdit(room)}
                        >
                          Modifier
                        </Button>
                        <Button
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => handleDelete(room._id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
              <p className="text-gray-600">
                Description : Cet équipement est un {selectedEquipment.name.toLowerCase()} de haute qualité, conçu pour
                une utilisation optimale dans les salles de l'IMT.
              </p>
              <p className="text-gray-600 mt-2">État : {selectedEquipment.status || "Inconnu"}</p>
              <p className="text-gray-600 mt-2">Manuel : Disponible sur demande auprès de l'administration.</p>
              <Button className="mt-4 bg-green-500 text-white hover:bg-green-600" onClick={downloadPDF}>
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