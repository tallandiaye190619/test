import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  DollarSign,
  GraduationCap,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAuth } from '../context/MonContext';

const TableauDeBord = () => {
  const { utilisateur, donnees } = useAuth();

  const obtenirStatistiquesParRole = () => {
    switch (utilisateur?.role) {
      case 'administrateur':
        return [
          {
            titre: 'Total Élèves',
            valeur: donnees.statistiques?.nombreEleves || 0,
            icone: Users,
            couleur: 'bg-blue-500',
            tendance: '+5%'
          },
          {
            titre: 'Enseignants',
            valeur: donnees.statistiques?.nombreEnseignants || 0,
            icone: GraduationCap,
            couleur: 'bg-green-500',
            tendance: '+2%'
          },
          {
            titre: 'Classes',
            valeur: donnees.statistiques?.nombreClasses || 0,
            icone: BookOpen,
            couleur: 'bg-purple-500',
            tendance: '0%'
          },
          {
            titre: 'Revenus (FCFA)',
            valeur: (donnees.statistiques?.montantCollecte || 0).toLocaleString(),
            icone: DollarSign,
            couleur: 'bg-yellow-500',
            tendance: '+12%'
          }
        ];
      case 'enseignant':
        return [
          {
            titre: 'Mes Classes',
            valeur: donnees.classes?.length || 0,
            icone: BookOpen,
            couleur: 'bg-blue-500'
          },
          {
            titre: 'Mes Élèves',
            valeur: donnees.eleves?.length || 0,
            icone: Users,
            couleur: 'bg-green-500'
          },
          {
            titre: 'Notes saisies',
            valeur: donnees.notes?.length || 0,
            icone: CheckCircle,
            couleur: 'bg-purple-500'
          },
          {
            titre: 'Documents',
            valeur: donnees.documents?.length || 0,
            icone: BookOpen,
            couleur: 'bg-yellow-500'
          }
        ];
      case 'eleve':
        return [
          {
            titre: 'Ma Classe',
            valeur: donnees.profil?.classe || 'N/A',
            icone: BookOpen,
            couleur: 'bg-blue-500'
          },
          {
            titre: 'Mes Notes',
            valeur: donnees.notes?.length || 0,
            icone: CheckCircle,
            couleur: 'bg-green-500'
          },
          {
            titre: 'Documents',
            valeur: donnees.documents?.length || 0,
            icone: BookOpen,
            couleur: 'bg-purple-500'
          },
          {
            titre: 'Notifications',
            valeur: donnees.notifications?.filter(n => !n.lue).length || 0,
            icone: AlertCircle,
            couleur: 'bg-red-500'
          }
        ];
      case 'parent':
        return [
          {
            titre: 'Mes Enfants',
            valeur: donnees.enfants?.length || 0,
            icone: Users,
            couleur: 'bg-blue-500'
          },
          {
            titre: 'Paiements',
            valeur: donnees.paiements?.filter(p => p.statut === 'payé').length || 0,
            icone: CheckCircle,
            couleur: 'bg-green-500'
          },
          {
            titre: 'En attente',
            valeur: donnees.paiements?.filter(p => p.statut === 'en_attente').length || 0,
            icone: AlertCircle,
            couleur: 'bg-yellow-500'
          },
          {
            titre: 'Notifications',
            valeur: donnees.notifications?.filter(n => !n.lue).length || 0,
            icone: AlertCircle,
            couleur: 'bg-red-500'
          }
        ];
      case 'comptable':
        return [
          {
            titre: 'Collecté (FCFA)',
            valeur: (donnees.statistiques?.montantCollecte || 0).toLocaleString(),
            icone: DollarSign,
            couleur: 'bg-green-500'
          },
          {
            titre: 'Attendu (FCFA)',
            valeur: (donnees.statistiques?.montantAttendu || 0).toLocaleString(),
            icone: DollarSign,
            couleur: 'bg-blue-500'
          },
          {
            titre: 'Paiements reçus',
            valeur: donnees.paiements?.filter(p => p.statut === 'payé').length || 0,
            icone: CheckCircle,
            couleur: 'bg-green-500'
          },
          {
            titre: 'En attente',
            valeur: donnees.paiements?.filter(p => p.statut === 'en_attente').length || 0,
            icone: AlertCircle,
            couleur: 'bg-yellow-500'
          }
        ];
      default:
        return [];
    }
  };

  const statistiques = obtenirStatistiquesParRole();

  const obtenirActivitesRecentes = () => {
    const activites = [];
    
    if (utilisateur?.role === 'administrateur') {
      activites.push(
        { titre: 'Nouveau paiement reçu', temps: 'Il y a 2h', type: 'paiement' },
        { titre: 'Note ajoutée par M. Ndiaye', temps: 'Il y a 4h', type: 'note' },
        { titre: 'Nouvel élève inscrit', temps: 'Il y a 1 jour', type: 'eleve' }
      );
    } else if (utilisateur?.role === 'enseignant') {
      activites.push(
        { titre: 'Note ajoutée pour Ibrahima', temps: 'Il y a 1h', type: 'note' },
        { titre: 'Document uploadé', temps: 'Il y a 3h', type: 'document' }
      );
    } else if (utilisateur?.role === 'eleve') {
      activites.push(
        { titre: 'Nouvelle note en Mathématiques', temps: 'Il y a 2h', type: 'note' },
        { titre: 'Document ajouté en Français', temps: 'Il y a 1 jour', type: 'document' }
      );
    }
    
    return activites;
  };

  const activitesRecentes = obtenirActivitesRecentes();

  return (
    <div className="space-y-8 fade-in">
  {/* Header */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
    <h1 className="text-3xl sm:text-xl font-bold text-fleuve-700">
      Tableau de bord – {utilisateur?.role?.charAt(0).toUpperCase() + utilisateur?.role?.slice(1)}
    </h1>
    <span className="text-sm text-gray-500 mt-2 sm:mt-0">
      Dernière connexion : {new Date().toLocaleDateString('fr-FR')}
    </span>
  </div>

  {/* Statistiques */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {statistiques.map((stat, index) => {
      const IconeStat = stat.icone;
      return (
        <div key={index} className="card p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">{stat.titre}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.valeur}</p>
              {stat.tendance && (
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.tendance}
                </p>
              )}
            </div>
            <div className={`p-3 rounded-full ${stat.couleur}`}>
              <IconeStat className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      );
    })}
  </div>

  {/* Activités + Événements */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Activités récentes */}
    <div className="card p-5">
      <h3 className="text-lg font-bold text-fleuve-700 mb-4">Activités récentes</h3>
      <div className="space-y-3">
        {activitesRecentes.length > 0 ? (
          activitesRecentes.map((a, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-fleuve-50 rounded-md">
              <span className={`w-2 h-2 rounded-full ${
                a.type === 'paiement' ? 'bg-green-500' :
                a.type === 'note' ? 'bg-blue-500' :
                a.type === 'document' ? 'bg-purple-500' : 'bg-gray-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{a.titre}</p>
                <p className="text-xs text-gray-500">{a.temps}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Aucune activité récente</p>
        )}
      </div>
    </div>

    {/* Événements */}
    <div className="card p-5">
      <h3 className="text-lg font-bold text-fleuve-700 mb-4">Prochains événements</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-acacia-50 rounded-md">
          <Calendar className="h-5 w-5 text-acacia-600" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Réunion des parents</p>
            <p className="text-xs text-gray-500">25 janvier 2024 à 15h00</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-soleil-50 rounded-md">
          <BookOpen className="h-5 w-5 text-soleil-600" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Compositions 1er trimestre</p>
            <p className="text-xs text-gray-500">30 janvier 2024</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Notifications importantes */}
  {donnees.notifications && donnees.notifications.filter(n => !n.lue && n.priorite === 'haute').length > 0 && (
    <div className="card border border-red-200 bg-red-50 p-5">
      <h3 className="text-lg font-bold text-red-700 flex items-center mb-4">
        <AlertCircle className="h-5 w-5 mr-2" />
        Notifications importantes
      </h3>
      <div className="space-y-2">
        {donnees.notifications
          .filter(n => !n.lue && n.priorite === 'haute')
          .slice(0, 3)
          .map((notification, i) => (
            <div key={i} className="p-3 bg-white border border-red-100 rounded-md">
              <p className="text-sm font-semibold text-red-900">{notification.titre}</p>
              <p className="text-xs text-red-600 mt-1">{notification.message}</p>
            </div>
          ))}
      </div>
    </div>
  )}
</div>

  );
};

export default TableauDeBord;