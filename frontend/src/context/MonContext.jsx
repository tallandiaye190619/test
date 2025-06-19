import { createContext, useContext, useEffect, useState } from 'react';
import { authentifier, obtenirDonneesParRole } from '../Donnees/donneesTemporaires';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [donnees, setDonnees] = useState({});

 useEffect(() => {
  const utilisateurStocke = localStorage.getItem('utilisateurEcole');
  if (utilisateurStocke) {
    const utilisateurParse = JSON.parse(utilisateurStocke);
    setUtilisateur(utilisateurParse);
    chargerDonnees(utilisateurParse.role, utilisateurParse.id);
  } else {
    setChargement(false);
  }
}, []);


  const chargerDonnees = (role, utilisateurId) => {
  try {
    const donneesRole = obtenirDonneesParRole(role, utilisateurId);
    setDonnees(donneesRole);
    setChargement(false);
  } catch (e) {
    console.error("Erreur lors du chargement des données :", e);
    setDonnees({});
    setChargement(false);
  }
};


  const seConnecter = async (email, motDePasse) => {
    try {
      const resultat = authentifier(email, motDePasse);
      if (resultat.succes) {
        setUtilisateur(resultat.utilisateur);
        localStorage.setItem('utilisateurEcole', JSON.stringify(resultat.utilisateur));
        chargerDonnees(resultat.utilisateur.role, resultat.utilisateur.id);
        return { succes: true };
      } else {
        return { succes: false, message: resultat.message };
      }
    } catch (error) {
      return { succes: false, message: 'Erreur de connexion' };
    }
  };

  const seDeconnecter = () => {
    setUtilisateur(null);
    setDonnees({});
    localStorage.removeItem('utilisateurEcole');
  };

  const valeur = {
    utilisateur,
    donnees,
    chargement,
    seConnecter,
    seDeconnecter,
    estConnecte: !!utilisateur,
    rafraichirDonnees: () => chargerDonnees(utilisateur?.role, utilisateur?.id)
  };

  return (
    <AuthContext.Provider value={valeur}>
      {children}
    </AuthContext.Provider>
  );
};