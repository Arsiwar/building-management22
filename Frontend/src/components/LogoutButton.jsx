import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Déconnexion réussie', {
        description: 'Vous avez été déconnecté avec succès.',
      });
      navigate('/login');
    } catch (err) {
      console.error('Erreur de déconnexion :', err);
      toast.error('Erreur', {
        description: 'Erreur lors de la déconnexion.',
      });
    }
  };

  return (
    <Button onClick={handleLogout} variant="destructive" size="sm">
      <LogOut className="h-4 w-4 mr-2" />
      Déconnexion
    </Button>
  );
};

export default LogoutButton;