import { Eye, EyeOff, School } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/MonContext';

const Connexion = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const { seConnecter } = useAuth();
  const navigate = useNavigate();

  const gererSoumission = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    if (!email || !motDePasse) {
      setErreur('Veuillez remplir tous les champs');
      setChargement(false);
      return;
    }

    try {
      const resultat = await seConnecter(email, motDePasse);
      if (resultat.succes) {
        navigate('/');
      } else {
        setErreur(resultat.message || 'Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur de connexion :', error);
      setErreur('Une erreur est survenue lors de la connexion');
    } finally {
      setChargement(false);
    }
  };

  const comptesTest = [
    { role: 'Administrateur', email: 'admin@ecole.sn', motDePasse: 'admin123' },
    { role: 'Enseignant', email: 'moussa.ndiaye@ecole.sn', motDePasse: 'prof123' },
    { role: 'Parent', email: 'fatou.sow@parent.sn', motDePasse: 'parent123' },
    { role: 'Élève', email: 'ibrahima.sarr@eleve.sn', motDePasse: 'eleve123' },
    { role: 'Comptable', email: 'mariam.kane@comptable.sn', motDePasse: 'compta123' }
  ];

  const remplirCompte = (compte) => {
    setEmail(compte.email);
    setMotDePasse(compte.motDePasse);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fleuve-500 to-fleuve-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-soleil-500 rounded-full p-4">
              <School className="text-white w-8 h-8" />
            </div>
          </div>

          {/* Titre */}
          <h2 className="text-2xl font-bold text-center text-gray-800">École Sénégalaise</h2>
          <p className="text-center text-gray-600 mb-6">Système de gestion scolaire</p>

          {/* Formulaire */}
          <form onSubmit={gererSoumission} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fleuve-500"
                placeholder="votre@email.sn"
                required
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={afficherMotDePasse ? 'text' : 'password'}
                  id="motDePasse"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-fleuve-500"
                  placeholder="Votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400"
                >
                  {afficherMotDePasse ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Erreur */}
            {erreur && (
              <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                {erreur}
              </div>
            )}

            {/* Bouton */}
            <button
              type="submit"
              disabled={chargement}
              className="w-full bg-fleuve-600 text-white py-2 rounded-lg hover:bg-fleuve-700 transition disabled:opacity-50"
            >
              {chargement ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        {/* Comptes de test */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <h3 className="text-md font-semibold text-gray-800 mb-3">Comptes de test</h3>
          <div className="space-y-2">
            {comptesTest.map((compte, index) => (
              <button
                key={index}
                onClick={() => remplirCompte(compte)}
                className="w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="font-medium text-gray-900">{compte.role}</div>
                <div className="text-sm text-gray-600">{compte.email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connexion;
