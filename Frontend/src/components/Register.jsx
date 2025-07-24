import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(first_name, last_name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6"> {/* Réduit mt-10 à mt-6 */}
    
      <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto"> {/* Réduit p-8 à p-6, ajoute max-h et overflow-y-auto */}
        <h2 className="text-3xl font-bold mb-4 text-center">Inscription</h2> {/* Réduit mb-6 à mb-4 */}
        {error && <p className="text-red-500 mb-3 text-center">{error}</p>} {/* Réduit mb-4 à mb-3 */}
        <form onSubmit={handleSubmit} className="space-y-4"> {/* Réduit space-y-6 à space-y-4 */}
          <div className="flex space-x-4"> {/* Place prénom et nom sur la même ligne */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            S'inscrire
          </button>
          <div className="text-center">
            <Link to="/login" className="text-blue-500 hover:text-blue-700">Déjà inscrit ? Connectez-vous</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;