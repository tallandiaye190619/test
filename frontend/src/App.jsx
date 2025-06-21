import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Connexion from './communs/connexion';
import Layout from './communs/Layout';
import { AuthProvider, useAuth } from './context/MonContext';
import ClassesPage from './Pages/administrateur/ClassesPages';
import ElevesPage from './Pages/administrateur/ElevesPage';
import EmploisDuTempsPage from './Pages/administrateur/EmploidetempsPage';
import EnseignantPage from './Pages/administrateur/EnseignatPage';
import GestionUtilisateurs from './Pages/administrateur/GestionUtilisateurs';
import ImportElevesPage from './Pages/administrateur/ImportElevesPage';
import MatieresPage from './Pages/administrateur/MatieresPage';
import NotesBulletinsPage from './Pages/administrateur/NotesPages';
import Notifications from './Pages/administrateur/NotificationsPage';
import PaiementsPage from './Pages/administrateur/PaiementsPage';
import GestionPaiements from './Pages/comptable/GestionPaiements';
import GestionRecus from './Pages/comptable/GestionRecus';
import StatistiquesFinancieres from './Pages/comptable/Statistiques';
import DocumentsEleve from './Pages/eleve/DocumentsEleve';
import EmploiDuTemps from './Pages/eleve/EmploiDuTemps';
import HistoriquePaiementsEleve from './Pages/eleve/HistoriquesPaiementsEleve';
import MesNotes from './Pages/eleve/MesNotes';
import NotificationsEleve from './Pages/eleve/NotificationsEleve';
import Documents from './Pages/enseignant/Documents';
import GestionNotes from './Pages/enseignant/GestionNotes';
import MesClasses from './Pages/enseignant/MesClasses';
import MonEmploiDuTemps from './Pages/enseignant/MonEmploiDuTemps';
import NotificationsEnseignant from './Pages/enseignant/NotificationsEnseignant';
import HistoriquePaiementsParents from './Pages/parent/HistoriquePaiementsParent';
import MesEnfants from './Pages/parent/Mesenfants';
import NotificationsParents from './Pages/parent/NotificationsParents';
import SuiviScolaireEnfant from './Pages/parent/SuiviScolaire';
import TableauDeBord from './Pages/TableuDeBord';

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
      return <Navigate to="/enseignant/tableau-de-bord" replace />;
    case 'eleve':
      return <Navigate to="/eleve/tableau-de-bord" replace />;
    case 'parent':
      return <Navigate to="/parent/tableau-de-bord" replace />;
    case 'comptable':
      return <Navigate to="/comptable/tableau-de-bord" replace />;  
    default:
      return <Navigate to="/connexion/tableau-de-bord" replace />;
  }
}

const AppRoutes = () => {
  return (

    <Layout>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        
        {/* Routes Administrateur */}
        <Route path="/admin/tableau-de-bord" element={<TableauDeBord />} />
        <Route path="/admin/eleves" element={<ElevesPage />} />
        <Route path="/admin/enseignants" element={<EnseignantPage />} />
        <Route path="/admin/classes" element={<ClassesPage />} />
        <Route path="/admin/matieres" element={<MatieresPage />} />
        <Route path="/admin/emplois-du-temps" element={<EmploisDuTempsPage />} />
        <Route path="/admin/notes-bulletins" element={<NotesBulletinsPage />} />
        <Route path="/admin/paiements" element={<PaiementsPage />} />
        <Route path="/admin/notifications" element={<Notifications />} />
        <Route path="/admin/import-eleves" element={<ImportElevesPage />} />
        <Route path="/admin/gestion-utilisateurs" element={<GestionUtilisateurs />} />
        
        {/* Routes Enseignant */}
        <Route path="/enseignant/tableau-de-bord" element={<TableauDeBord />} />
        <Route path="/enseignant/emploi-du-temps" element={<MonEmploiDuTemps />} />
        <Route path="/enseignant/mes-classes" element={<MesClasses />} />
        <Route path="/enseignant/gestion-notes" element={<GestionNotes />} />
        <Route path="/enseignant/documents" element={<Documents />} />
        <Route path="/enseignant/notifications" element={<NotificationsEnseignant />} />

        {/* Routes Élève */}
        <Route path="/eleve/tableau-de-bord" element={<TableauDeBord />} />
        <Route path="/eleve/mes-notes" element={<MesNotes />} />
        <Route path="/eleve/emploi-du-temps" element={<EmploiDuTemps />} />
        <Route path="/eleve/documents" element={<DocumentsEleve />} />
        <Route path="/eleve/paiements" element={<HistoriquePaiementsEleve />} />
        <Route path="/eleve/notifications" element={<NotificationsEleve />} />

        {/* Routes Parent */}
        <Route path="/parent/tableau-de-bord" element={<TableauDeBord />} />
        <Route path="/parent/mes-enfants" element={<MesEnfants />} />
        <Route path="/parent/suivi-scolaire" element={<SuiviScolaireEnfant />} />
        <Route path="/parent/paiements" element={<HistoriquePaiementsParents />} />
        <Route path="/parent/notifications" element={<NotificationsParents />} />


        {/* Routes Comptable */}
        <Route path="/comptable/tableau-de-bord" element={<TableauDeBord />} />
        <Route path="/comptable/gestion-paiements" element={<GestionPaiements />} />
        <Route path="/comptable/statistiques-financieres" element={<StatistiquesFinancieres />} />
        <Route path="/comptable/recus" element={<GestionRecus />} />

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