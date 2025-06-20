import {
  Bell,
  BookOpen,
  Calendar,
  ClipboardList,
  DollarSign,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  School,
  Settings2,
  Upload,
  Users,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/MonContext';

const Layout = ({ children }) => {
  const [sidebarOuverte, setSidebarOuverte] = useState(false);
  const { utilisateur, seDeconnecter } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOuvert, setMenuOuvert] = useState(false);

  const basculeMenu = () => setMenuOuvert(!menuOuvert);

  const obtenirMenusParRole = (role) => {
    const menusCommuns = [
      { nom: 'Tableau de bord', chemin: `/${role}/tableau-de-bord`, icone: Home }
    ];

    const menusParRole = {
      administrateur: [
        ...menusCommuns,
        { nom: 'Élèves', chemin: '/admin/eleves', icone: Users },
        { nom: 'Enseignants', chemin: '/admin/enseignants', icone: GraduationCap },
        { nom: 'Classes', chemin: '/admin/classes', icone: School },
        { nom: 'Matières', chemin: '/admin/matieres', icone: BookOpen },
        { nom: 'Emplois du temps', chemin: '/admin/emplois-du-temps', icone: Calendar },
        { nom: 'Notes & Bulletins', chemin: '/admin/notes-bulletins', icone: FileText },
        { nom: 'Paiements', chemin: '/admin/paiements', icone: DollarSign },
        { nom: 'Notifications', chemin: '/admin/notifications', icone: Bell },
        { nom: 'Import Élèves', chemin: '/admin/import-eleves', icone: Upload }
      ],
      enseignant: [
        ...menusCommuns,
        { nom: 'Mon Emploi-du-temps', chemin: '/enseignant/emploi-du-temps', icone: Calendar },
        { nom: 'Mes Classes', chemin: '/enseignant/mes-classes', icone: Users },
        { nom: 'Gestion Notes', chemin: '/enseignant/gestion-notes', icone: ClipboardList },
        { nom: 'Documents', chemin: '/enseignant/documents', icone: FileText },
        { nom: 'Notifications', chemin: '/enseignant/notifications', icone: Bell }
      ],
      eleve: [
        ...menusCommuns,
        { nom: 'Mes Notes', chemin: '/eleve/mes-notes', icone: FileText },
        { nom: 'Emploi du temps', chemin: '/eleve/emploi-du-temps', icone: Calendar },
        { nom: 'Documents', chemin: '/eleve/documents', icone: BookOpen },
        { nom: 'Notifications', chemin: '/eleve/notifications', icone: Bell }
      ],
      parent: [
        ...menusCommuns,
        { nom: 'Mes Enfants', chemin: '/mes-enfants', icone: Users },
        { nom: 'Suivi Scolaire', chemin: '/suivi-scolaire', icone: FileText },
        { nom: 'Paiements', chemin: '/paiements', icone: DollarSign },
        { nom: 'Notifications', chemin: '/notifications', icone: Bell }
      ],
      comptable: [
        ...menusCommuns,
        { nom: 'Gestion Paiements', chemin: '/comptable/gestion-paiements', icone: DollarSign },
        { nom: 'Statistiques', chemin: '/comptable/statistiques-financieres', icone: FileText },
        { nom: 'Reçus', chemin: '/comptable/recus', icone: FileText }
      ]
    };

    return menusParRole[role] || menusCommuns;
  };

  const menus = obtenirMenusParRole(utilisateur?.role);

  const gererDeconnexion = () => {
    seDeconnecter();
    navigate('/connexion');
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300
        ${sidebarOuverte ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <School className="h-7 w-7 text-fleuve-600" /> {/* Couleur fleuve */}
            <span className="text-xl font-bold text-gray-800">CCHT</span>
          </div>
          <button onClick={() => setSidebarOuverte(false)} className="lg:hidden p-1 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="px-3 py-4 overflow-y-auto custom-scrollbar"> {/* Ajout de custom-scrollbar si défini */}
          <ul className="space-y-2">
            {menus.map(({ nom, chemin, icone: Icon }) => {
              const actif = location.pathname === chemin;
              return (
                <li key={chemin}>
                  <Link
                    to={chemin}
                    onClick={() => setSidebarOuverte(false)}
                    className={`
                      flex items-center px-4 py-3 rounded-lg text-sm font-medium
                      transition-all duration-200 group
                      ${actif
                        ? 'bg-fleuve-100 text-fleuve-700 font-semibold border-l-4 border-fleuve-500 shadow-sm' // Couleurs fleuve
                        : 'text-gray-700 hover:bg-gray-100 hover:text-fleuve-600'}
                    `}
                  >
                    <Icon className={`w-5 h-5 mr-3 transition-colors duration-200 ${actif ? 'text-fleuve-600' : 'text-gray-500 group-hover:text-fleuve-600'}`} /> {/* Couleurs fleuve pour icône */}
                    {nom}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={gererDeconnexion}
            className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-terre-50 hover:text-terre-600 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md" // Couleurs terre
          >
            <LogOut className="h-5 w-5 mr-3" />
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-1 flex justify-between items-center z-30">
          <button onClick={() => setSidebarOuverte(true)} className="lg:hidden text-gray-700 p-1 rounded-full hover:bg-gray-100 hover:text-gray-900 transition-colors" aria-label="Ouvrir le menu">
            <Menu className="h-6 w-6" />
          </button>

          <div className="relative ml-auto"> {/* Aligner à droite */}
            <button onClick={basculeMenu} className="flex items-center space-x-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-fleuve-500 shadow-sm">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{utilisateur?.prenom || 'Utilisateur'} {utilisateur?.nom || ''}</p>
                <p className="text-xs text-gray-500 capitalize">{utilisateur?.role || 'role inconnu'}</p>
              </div>
              <img
                src={utilisateur?.photo || 'https://i.pravatar.cc/40?img=3'}
                alt="Profil"
                className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-inner"
              />
            </button>

            {menuOuvert && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50 animate-scale-in"> {/* Ajout d'animation et ombre plus prononcée */}
                <button
                  onClick={() => { navigate('/profil'); basculeMenu(); }}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors duration-150"
                >
                  <Settings2 size={16} className="mr-2 text-gray-500" />
                  Paramètres
                </button>
                {utilisateur?.role === 'administrateur' && (
                  <button
                    onClick={() => { navigate('/admin/notifications'); basculeMenu(); }} // Correction du chemin pour admin
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors duration-150"
                  >
                    <Bell size={16} className="mr-2 text-gray-500" />
                    Envoyer une notif
                  </button>
                )}
                <div className="border-t border-gray-100 my-1"></div> {/* Séparateur */}
                <button
                  onClick={gererDeconnexion}
                  className="w-full px-4 py-2 text-sm text-terre-600 hover:bg-terre-50 flex items-center transition-colors duration-150" // Couleurs terre
                >
                  <LogOut size={16} className="mr-2" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar min-h-[calc(100vh-80px)] p-4 md:p-6 bg-gray-50"> {/* Hauteur ajustée (64px + padding) */}
          {children}
        </main>
      </div>

      {sidebarOuverte && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOuverte(false)}
        />
      )}
    </div>
  );
};

export default Layout;