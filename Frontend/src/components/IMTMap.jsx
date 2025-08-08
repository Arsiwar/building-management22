import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const buildings = [
  {
    id: 'A',
    name: 'Bâtiment A - Administration',
    icon: '🏛️',
    coordinates: [50.3780, 3.0710],
    description: 'Services administratifs et direction',
    color: 'bg-gray-200',
  },
  {
    id: 'B',
    name: 'Bâtiment B - Laboratoires',
    icon: '🔬',
    coordinates: [50.3782, 3.0715],
    description: 'Laboratoires de recherche avancée',
    color: 'bg-gray-200',
  },
  {
    id: 'C',
    name: 'Bâtiment C - Enseignement',
    icon: '📚',
    coordinates: [50.3778, 3.0708],
    description: 'Amphithéâtres et salles de cours',
    color: 'bg-gray-200',
  },
  {
    id: 'D',
    name: 'Bâtiment D - Innovation',
    icon: '💡',
    coordinates: [50.3784, 3.0712],
    description: 'Centre d\'innovation technologique',
    color: 'bg-gray-200',
  },
  {
    id: 'E',
    name: 'Bâtiment E - Bibliothèque',
    icon: '📖',
    coordinates: [50.3776, 3.0713],
    description: 'Bibliothèque et espaces d\'étude',
    color: 'bg-gray-200',
  },
];

const IMTMap = () => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const navigate = useNavigate();

  const handleBuildingSelect = (buildingId) => {
    setSelectedBuilding(buildingId);
  };

  const handleBuildingClick = (buildingId) => {
    navigate(`/building/${buildingId}`);
  };

  return (
    <Card className="bg-gray-100 shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center space-x-2">
              <span className="text-3xl">🗺️</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                Centre de recherche IMT Nord Europe
              </span>
            </CardTitle>
            <p className="text-gray-600 mt-1">Explorez les bâtiments du CERI MP</p>
          </div>
          <Select value={selectedBuilding || ''} onValueChange={handleBuildingSelect}>
            <SelectTrigger className="w-[280px] bg-gradient-to-r from-blue-700 to-blue-500 text-white border-0 shadow-md">
              <SelectValue placeholder="🏢 Sélectionner un bâtiment" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              {buildings.map((building) => (
                <SelectItem
                  key={building.id}
                  value={building.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span>{building.icon}</span>
                    <span className="font-medium">{building.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg p-8 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {buildings.map((building, index) => (
              <Card
                key={building.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-0 bg-gray-100 animate-fade-in group ${
                  selectedBuilding === building.id ? 'ring-2 ring-blue-500 shadow-md' : ''
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both',
                }}
                onClick={() => handleBuildingClick(building.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3 group-hover:animate-float">{building.icon}</div>
                  <Badge
                    variant="secondary"
                    className="text-lg font-bold px-3 py-1 mb-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white"
                  >
                    {building.id}
                  </Badge>
                  <h3 className="font-bold text-sm text-blue-600 mb-2">{building.name}</h3>
                  <p className="text-gray-600 text-xs mb-4">{building.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center text-gray-600 text-xs">
                      <span className="mr-1">📍</span>
                      <span>{building.coordinates[0].toFixed(4)}, {building.coordinates[1].toFixed(4)}</span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-500 hover:to-blue-700 transition-all duration-300 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuildingClick(building.id);
                      }}
                    >
                      🚪 Voir les salles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-gray-600 p-3 rounded-lg max-w-xs">
            <h4 className="font-semibold text-sm mb-1">💡 Navigation</h4>
            <p className="text-xs opacity-90">Cliquez sur un bâtiment pour explorer ses salles</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4"> {/* Changé de grid-cols-1 md:grid-cols-3 à grid-cols-3 */}
          <Card className="bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300 border-0 group">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2 group-hover:animate-float">🏢</div>
              <div className="text-2xl font-bold text-blue-600">{buildings.length}</div>
              <div className="text-gray-600 text-sm">Bâtiments</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300 border-0 group">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2 group-hover:animate-float">🚪</div>
              <div className="text-2xl font-bold text-green-600">120+</div>
              <div className="text-gray-600 text-sm">Salles totales</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300 border-0 group">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2 group-hover:animate-float">🌟</div>
              <div className="text-2xl font-bold text-yellow-600">24/7</div>
              <div className="text-gray-600 text-sm">Accès du Centre de recherche</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default IMTMap;