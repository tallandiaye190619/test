import {
  AlertCircle,
  Bell,
  CheckCircle,
  Eye,
  Info,
  Plus,
  Send,
  Trash2,
  Users,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext';

const Notifications = () => {
  const { donnees } = useAuth();
  const [modalOuverte, setModalOuverte] = useState(false);
  const [typeModal, setTypeModal] = useState('');
  const [notificationSelectionnee, setNotificationSelectionnee] = useState(null);

  const notifications = donnees.notifications || [];

  const ouvrirModal = (type, notification = null) => {
    setTypeModal(type);
    setNotificationSelectionnee(notification);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setNotificationSelectionnee(null);
    setTypeModal('');
  };

  const FormulaireNotification = () => {
    const [formData, setFormData] = useState(notificationSelectionnee || {
      titre: '',
      message: '',
      destinataires: [],
      priorite: 'normale',
      dateEnvoi: new Date().toISOString().split('T')[0]
    });

    const destinatairesOptions = [
      { value: 'eleve', label: 'Élèves' },
      { value: 'parent', label: 'Parents' },
      { value: 'enseignant', label: 'Enseignants' },
      { value: 'comptable', label: 'Comptables' },
      { value: 'tous', label: 'Tous' }
    ];

    const gererDestinataireChange = (destinataire) => {
      if (destinataire === 'tous') {
        const allExceptTous = destinatairesOptions
                                .filter(opt => opt.value !== 'tous')
                                .map(opt => opt.value);
        setFormData({
          ...formData,
          destinataires: formData.destinataires.length === allExceptTous.length && allExceptTous.every(d => formData.destinataires.includes(d))
            ? []
            : allExceptTous
        });
      } else {
        const nouveauxDestinataires = formData.destinataires.includes(destinataire)
          ? formData.destinataires.filter(d => d !== destinataire)
          : [...formData.destinataires, destinataire];
        setFormData({...formData, destinataires: nouveauxDestinataires});
      }
    };

    const gererSoumission = (e) => {
      e.preventDefault();
      console.log('Données notification:', formData);
      fermerModal();
    };

    return (
      <form onSubmit={gererSoumission} className="space-y-4">
        <div className="form-group">
          <label className="form-label">
            Titre *
          </label>
          <input
            type="text"
            value={formData.titre}
            onChange={(e) => setFormData({...formData, titre: e.target.value})}
            className="input-field"
            placeholder="Titre de la notification"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">
            Message *
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="input-field"
            rows="4"
            placeholder="Contenu de la notification..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label mb-2">
            Destinataires *
          </label>
          <div className="space-y-2">
            {destinatairesOptions.map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={
                    option.value === 'tous' 
                      ? destinatairesOptions.filter(opt => opt.value !== 'tous').every(opt => formData.destinataires.includes(opt.value))
                      : formData.destinataires.includes(option.value)
                  }
                  onChange={() => gererDestinataireChange(option.value)}
                  className="rounded border-gray-300 text-fleuve-600 focus:ring-fleuve-500" 
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">
              Priorité
            </label>
            <select
              value={formData.priorite}
              onChange={(e) => setFormData({...formData, priorite: e.target.value})}
              className="input-field"
            >
              <option value="normale">Normale</option>
              <option value="haute">Haute</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Date d'envoi
            </label>
            <input
              type="date"
              value={formData.dateEnvoi}
              onChange={(e) => setFormData({...formData, dateEnvoi: e.target.value})}
              className="input-field"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={fermerModal} className="btn-secondary">
            Annuler
          </button>
          <button type="submit" className="btn-primary flex items-center shadow-sm hover:shadow-md">
            <Send className="h-4 w-4 mr-2" />
            Envoyer
          </button>
        </div>
      </form>
    );
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
        return 'bg-soleil-100 text-soleil-800 border border-soleil-200';
      case 'urgente':
        return 'bg-terre-100 text-terre-800 border border-terre-200';
      default:
        return 'bg-fleuve-100 text-fleuve-800 border border-fleuve-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Envoyez des notifications aux utilisateurs</p>
        </div>
        <button
          onClick={() => ouvrirModal('ajouter')}
          className="btn-primary flex items-center shadow-md hover:shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Notification
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card border border-gray-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center">
            <Bell className="h-8 w-8 text-fleuve-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              <p className="text-sm text-gray-600">Total envoyées</p>
            </div>
          </div>
        </div>
        <div className="card border border-gray-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-acacia-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.lue).length}
              </p>
              <p className="text-sm text-gray-600">Lues</p>
            </div>
          </div>
        </div>
        <div className="card border border-gray-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-soleil-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.priorite === 'haute').length}
              </p>
              <p className="text-sm text-gray-600">Priorité haute</p>
            </div>
          </div>
        </div>
        <div className="card border border-gray-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-fleuve-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.reduce((total, n) => total + n.destinataires.length, 0)}
              </p>
              <p className="text-sm text-gray-600">Destinataires</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className={`card border-l-4 p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ${
            notification.priorite === 'urgente' ? 'border-l-terre-500' :
            notification.priorite === 'haute' ? 'border-l-soleil-500' :
            'border-l-fleuve-500'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {obtenirIconePriorite(notification.priorite)}
                  <h3 className="text-lg font-medium text-gray-900">
                    {notification.titre}
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${obtenirCouleurPriorite(notification.priorite)}`}>
                    {notification.priorite}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">{notification.message}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Envoyé le {new Date(notification.date).toLocaleDateString('fr-FR')}</span>
                  <span>•</span>
                  <span>Par {notification.expediteur}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{notification.destinataires.join(', ')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => ouvrirModal('voir', notification)}
                  className="p-2 rounded-full text-fleuve-600 hover:bg-fleuve-50 hover:text-fleuve-800 transition-colors duration-200"
                  title="Voir les détails"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  className="p-2 rounded-full text-terre-600 hover:bg-terre-50 hover:text-terre-800 transition-colors duration-200"
                  title="Supprimer la notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-bounce" />
          <p className="text-gray-500">Aucune notification envoyée</p>
          <p className="text-gray-400 text-sm">Commencez par envoyer votre première notification !</p>
        </div>
      )}

      {/* Modal */}
      {modalOuverte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {typeModal === 'ajouter' && 'Nouvelle notification'}
                  {typeModal === 'voir' && 'Détails de la notification'}
                </h3>
                <button
                  onClick={fermerModal}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title="Fermer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {typeModal === 'voir' ? (
                <div className="space-y-4 fade-in">
                  <div className="flex items-center space-x-2">
                    {obtenirIconePriorite(notificationSelectionnee?.priorite)}
                    <h4 className="text-xl font-bold text-gray-900">
                      {notificationSelectionnee?.titre}
                    </h4>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800">{notificationSelectionnee?.message}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Date d'envoi</p>
                      <p className="text-sm text-gray-900">
                        {new Date(notificationSelectionnee?.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Expéditeur</p>
                      <p className="text-sm text-gray-900">{notificationSelectionnee?.expediteur}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Priorité</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${obtenirCouleurPriorite(notificationSelectionnee?.priorite)}`}>
                        {notificationSelectionnee?.priorite}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Destinataires</p>
                      <p className="text-sm text-gray-900">
                        {notificationSelectionnee?.destinataires.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <FormulaireNotification />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
