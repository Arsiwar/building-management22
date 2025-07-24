import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import LogoutButton from './LogoutButton';



const Dashboard = () => {
  const { user, accessToken, refreshToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 403) {
          try {
            await refreshToken();
          } catch (err) {
            navigate('/login');
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [user, refreshToken, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Tableau de bord</h2>
        <p className="text-center">Bienvenue, {user.email} !</p>
        <LogoutButton />
      </div>
    </div>
  );
};

export default Dashboard;