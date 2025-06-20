import {
    AlertCircle,
    Bell,
    BookmarkCheck, // Icône pour priorité haute/urgente
    Calendar, // Icône pour marquer comme non lue
    CheckCircle, // Icône pour marquer comme lue
    Filter,
    Info,
    Trash2, // Pour la date d'envoi
    UserCircle // Pour l'expéditeur
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext';

const NotificationsParents = () => {
  const { donnees } = useAuth();
  const [filtrePriorite, setFiltrePriorite] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('');

  // Les notifications sont déjà filtrées pour les parents via obtenirDonneesParRole
  const notifications = donnees.notifications || [];

  const notificationsFiltrees = notifications.filter(notification => {
    const correspondPriorite = !filtrePriorite || notification.priorite === filtrePriorite;
    const correspondStatut = filtreStatut === '' || 
      (filtreStatut === 'lue' && notification.lue) ||
      (filtreStatut === 'non_lue' && !notification.lue);
    return correspondPriorite && correspondStatut;
  });

  const marquerCommeLue = (id) => {
    console.log('Marquer comme lue:', id);
    // Implémenter la logique de mise à jour de l'état ou de l'API ici (dans un vrai projet)
  };

  const marquerCommeNonLue = (id) => {
    console.log('Marquer comme non lue:', id);
    // Implémenter la logique de mise à jour de l'état ou de l'API ici (dans un vrai projet)
  };

  const supprimerNotification = (id) => {
    console.log('Supprimer notification:', id);
    // Implémenter la logique de suppression ici (dans un vrai projet)
  };

  const obtenirIconePriorite = (priorite) => {
    switch (priorite) {
      case 'haute':
        return <AlertCircle className="h-5 w-5 text-soleil-500" />;
      case 'urgente':
        return <AlertCircle className="h-5 w-5 text-terre-500" />;
      default:
        return <Info className="h-5 w-5 text-fleuve-500" />;
    }
  };

  const obtenirCouleurPriorite = (priorite) => {
    switch (priorite) {
      case 'haute':
        return 'border-l-soleil-500 bg-soleil-50';
      case 'urgente':
        return 'border-l-terre-500 bg-terre-50';
      default:
        return 'border-l-fleuve-500 bg-fleuve-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Notifications</h1>
          <p className="text-gray-600">Restez informé des actualités de l'école</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-soleil-100 text-soleil-800 px-3 py-1 rounded-full text-sm font-medium border border-soleil-200 shadow-sm">
            {notifications.filter(n => !n.lue).length} non lues
          </span>
        </div>
      </div>

      {/* Filtres */}
      <div className="card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Filter className="h-6 w-6 text-gray-500 flex-shrink-0" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
            <div className="form-group">
              <select
                value={filtrePriorite}
                onChange={(e) => setFiltrePriorite(e.target.value)}
                className="input-field"
              >
                <option value="">Toutes les priorités</option>
                <option value="normale">Normale</option>
                <option value="haute">Haute</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            <div className="form-group">
              <select
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
                className="input-field"
              >
                <option value="">Toutes</option>
                <option value="non_lue">Non lues</option>
                <option value="lue">Lues</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="space-y-4">
        {notificationsFiltrees.length > 0 ? (
          notificationsFiltrees.map((notification) => (
            <div
              key={notification.id}
              className={`card border-l-4 p-4 shadow-sm hover:shadow-md transition-shadow duration-200 transform hover:scale-[1.01]
                ${obtenirCouleurPriorite(notification.priorite)}
                ${!notification.lue ? 'bg-white border-r border-b' : 'bg-gray-50 border-gray-200'}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {obtenirIconePriorite(notification.priorite)}
                    <h3 className={`text-lg font-bold ${
                      !notification.lue ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {notification.titre}
                    </h3>
                    {!notification.lue && (
                      <span className="w-3 h-3 bg-terre-500 rounded-full animate-pulse flex-shrink-0"></span>
                    )}
                  </div>
                  
                  <p className={`mb-3 ml-8 ${
                    !notification.lue ? 'text-gray-800' : 'text-gray-600'
                  } line-clamp-3`}>
                    {notification.message}
                  </p>
                  
                  <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500 ml-8 mt-4">
                    <span className="flex items-center"><UserCircle className="h-4 w-4 mr-1 text-gray-500" /> De: {notification.expediteur}</span>
                    <span>•</span>
                    <span className="flex items-center"><Calendar className="h-4 w-4 mr-1 text-gray-500" /> {new Date(notification.date).toLocaleDateString('fr-FR')}</span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                      notification.priorite === 'urgente' ? 'bg-terre-100 text-terre-800 border-terre-200' :
                      notification.priorite === 'haute' ? 'bg-soleil-100 text-soleil-800 border-soleil-200' :
                      'bg-fleuve-100 text-fleuve-800 border-fleuve-200'
                    }`}>
                      {notification.priorite.charAt(0).toUpperCase() + notification.priorite.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-2 ml-4 flex-shrink-0">
                  {!notification.lue ? (
                    <button
                      onClick={() => marquerCommeLue(notification.id)}
                      className="p-2 rounded-full text-acacia-600 hover:bg-acacia-100 hover:text-acacia-800 transition-colors duration-200 shadow-sm"
                      title="Marquer comme lue"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => marquerCommeNonLue(notification.id)}
                      className="p-2 rounded-full text-fleuve-600 hover:bg-fleuve-100 hover:text-fleuve-800 transition-colors duration-200 shadow-sm"
                      title="Marquer comme non lue"
                    >
                      <BookmarkCheck className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    className="p-2 rounded-full text-terre-600 hover:bg-terre-100 hover:text-terre-800 transition-colors duration-200 shadow-sm"
                    onClick={() => supprimerNotification(notification.id)}
                    title="Supprimer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-bounce" />
            <p className="text-gray-500">Aucune notification trouvée pour cette sélection.</p>
            <p className="text-gray-400 text-sm mt-2">
              {notifications.length === 0 
                ? "Vous n'avez pas encore de notifications."
                : "Essayez d'ajuster vos filtres ou attendez de nouvelles annonces."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsParents;