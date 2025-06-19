import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Connexion from './communs/connexion';
import Layout from './communs/Layout';
import { AuthProvider, useAuth } from './context/MonContext';
import TableauDeBordAdministrateur from './Pages/administrateur/TableuDeBord';

const RouteProtegee = ({ children }) => {
  const { estConnecte, chargement } = useAuth();

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return estConnecte ? children : <Navigate to="/connexion" />;
};

function RootRedirect() {
  const { utilisateur, estConnecte } = useAuth();

  if (!estConnecte || !utilisateur) {
    return <Navigate to="/connexion" replace />;
  }

  // Redirection par rôle
  switch (utilisateur.role) {
    case 'administrateur':
      return <Navigate to="/admin/tableau-de-bord" replace />;
    case 'enseignant':
      return <Navigate to="/enseignant" replace />;
    case 'eleve':
      return <Navigate to="/eleve" replace />;
    case 'parent':
      return <Navigate to="/parent" replace />;
    default:
      return <Navigate to="/connexion" replace />;
  }
}

const AppRoutes = () => {
  return (

    <Layout>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        
        {/* Routes Administrateur */}
        <Route path="/admin/tableau-de-bord" element={<TableauDeBordAdministrateur />} />
        
        {/* Redirection pour routes inconnues */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Route publique */}
          <Route path="/connexion" element={<Connexion />} />

          {/* Routes protégées */}
          <Route
            path="/*"
            element={
              <RouteProtegee>
                <AppRoutes />
              </RouteProtegee>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
