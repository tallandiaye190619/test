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
      { nom: 'Tableau de bord', chemin: '/tableau-de-bord', icone: Home }
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
        { nom: 'Mes Classes', chemin: '/mes-classes', icone: Users },
        { nom: 'Gestion Notes', chemin: '/gestion-notes', icone: ClipboardList },
        { nom: 'Documents', chemin: '/documents', icone: FileText },
        { nom: 'Notifications', chemin: '/notifications', icone: Bell }
      ],
      eleve: [
        ...menusCommuns,
        { nom: 'Mes Notes', chemin: '/mes-notes', icone: FileText },
        { nom: 'Emploi du temps', chemin: '/emploi-du-temps', icone: Calendar },
        { nom: 'Documents', chemin: '/documents', icone: BookOpen },
        { nom: 'Notifications', chemin: '/notifications', icone: Bell }
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
        { nom: 'Gestion Paiements', chemin: '/gestion-paiements', icone: DollarSign },
        { nom: 'Statistiques', chemin: '/statistiques-financieres', icone: FileText },
        { nom: 'Reçus', chemin: '/recus', icone: FileText }
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
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300
        ${sidebarOuverte ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <School className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">GSCAB</span>
          </div>
          <button onClick={() => setSidebarOuverte(false)} className="lg:hidden">
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <nav className="px-3 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {menus.map((menu) => {
              const Icon = menu.icone;
              const actif = location.pathname === menu.chemin;

              return (
                <li key={menu.chemin}>
                  <Link
                    to={menu.chemin}
                    onClick={() => setSidebarOuverte(false)}
                    className={`
                      flex items-center px-4 py-3 rounded-lg text-sm font-medium
                      transition duration-200
                      ${actif
                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}
                    `}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {menu.nom}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={gererDeconnexion}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 sm:px-6 py-4 flex justify-between items-center">
          <div>
            <button onClick={() => setSidebarOuverte(true)} className="lg:hidden text-gray-700">
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <div className="relative">
            <button onClick={basculeMenu} className="flex items-center space-x-3 hover:bg-gray-100 px-2 py-1 rounded-lg transition">
              <div className="text-right">
                <p className="text-sm font-semibold">{utilisateur?.prenom} {utilisateur?.nom}</p>
                <p className="text-xs text-gray-500 capitalize">{utilisateur?.role}</p>
              </div>
              <img
                src={utilisateur?.photo || 'https://i.pravatar.cc/40?img=3'}
                alt="Profil"
                className="w-9 h-9 rounded-full object-cover border"
              />
            </button>

            {menuOuvert && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={() => navigate('/profil')}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Settings2 size={16} className="mr-2" />
                  Paramètres
                </button>
                {utilisateur?.role === 'admin' && (
                  <button
                    onClick={() => navigate('/notifications/nouvelle')}
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Bell size={16} className="mr-2" />
                    Envoyer une notif
                  </button>
                )}
                <button
                  onClick={gererDeconnexion}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>

      {/* Overlay mobile */}
      {sidebarOuverte && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setSidebarOuverte(false)}
        />
      )}
    </div>
  );
};

export default Layout;
