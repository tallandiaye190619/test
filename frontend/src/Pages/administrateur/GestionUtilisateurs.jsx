import {
    Edit,
    Eye,
    Filter,
    Lock,
    Mail,
    Phone,
    Plus,
    Save,
    Search,
    Trash2,
    Users,
    X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext';

const GestionUtilisateurs = () => {
  const { donnees, rafraichirDonnees } = useAuth(); // Ajout de rafraichirDonnees
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [filtreRole, setFiltreRole] = useState('');
  const [utilisateurSelectionne, setUtilisateurSelectionne] = useState(null);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [typeModal, setTypeModal] = useState(''); // 'ajouter', 'modifier', 'voir'

  // Accéder directement à la liste des utilisateurs fournie par le contexte
  const utilisateurs = donnees.utilisateurs || [];

  const utilisateursFiltres = utilisateurs.filter(user => {
    const correspondRecherche = `${user.prenom} ${user.nom} ${user.email}`
      .toLowerCase()
      .includes(rechercheTexte.toLowerCase());
    const correspondRole = !filtreRole || user.role === filtreRole;
    return correspondRecherche && correspondRole;
  });

  const rolesUniques = [...new Set(utilisateurs.map(user => user.role))].sort();

  const ouvrirModal = (type, user = null) => {
    setTypeModal(type);
    setUtilisateurSelectionne(user);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setUtilisateurSelectionne(null);
    setTypeModal('');
  };

  const FormulaireUtilisateur = () => {
    const [formData, setFormData] = useState(utilisateurSelectionne || {
      prenom: '',
      nom: '',
      email: '',
      motDePasse: '',
      role: 'eleve',
      telephone: '',
      photo: '',
      statut: 'actif'
    });
    const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);

    const gererSoumission = (e) => {
      e.preventDefault();
      console.log(`Action ${typeModal} utilisateur:`, formData);
      // Ici, dans un vrai projet, vous feriez un appel API pour ajouter/modifier/supprimer
      // Après l'opération, rafraîchissez les données du contexte
      rafraichirDonnees();
      fermerModal();
    };

    return (
      <form onSubmit={gererSoumission} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Prénom *</label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => setFormData({...formData, prenom: e.target.value})}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Nom *</label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Adresse email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Téléphone</label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData({...formData, telephone: e.target.value})}
              className="input-field"
              placeholder="77 123 45 67"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe {typeModal === 'ajouter' ? '*' : '(laisser vide pour ne pas changer)'}</label>
            <div className="relative">
              <input
                type={afficherMotDePasse ? 'text' : 'password'}
                value={formData.motDePasse}
                onChange={(e) => setFormData({...formData, motDePasse: e.target.value})}
                className="input-field pr-10"
                required={typeModal === 'ajouter'}
                placeholder={typeModal === 'modifier' ? '********' : '********'}
              />
              <button
                type="button"
                onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {afficherMotDePasse ? <Eye className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Rôle *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="input-field capitalize"
              required
            >
              {rolesUniques.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Statut</label>
            <select
              value={formData.statut}
              onChange={(e) => setFormData({...formData, statut: e.target.value})}
              className="input-field capitalize"
            >
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">URL Photo (optionnel)</label>
            <input
              type="url"
              value={formData.photo}
              onChange={(e) => setFormData({...formData, photo: e.target.value})}
              className="input-field"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
          <button type="button" onClick={fermerModal} className="btn-secondary shadow-sm hover:shadow-md">
            Annuler
          </button>
          <button type="submit" className="btn-primary flex items-center shadow-md hover:shadow-lg">
            <Save className="h-4 w-4 mr-2" />
            {typeModal === 'ajouter' ? 'Créer utilisateur' : 'Modifier utilisateur'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600">Gérez les comptes des administrateurs, enseignants, élèves et parents</p>
        </div>
        <button
          onClick={() => ouvrirModal('ajouter')}
          className="btn-primary flex items-center shadow-md hover:shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Utilisateur
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="card p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative form-group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher par nom, email..."
              value={rechercheTexte}
              onChange={(e) => setRechercheTexte(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          <div className="form-group">
            <select
              value={filtreRole}
              onChange={(e) => setFiltreRole(e.target.value)}
              className="input-field capitalize"
            >
              <option value="">Tous les rôles</option>
              {rolesUniques.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <button className="w-full btn-secondary flex items-center justify-center shadow-sm hover:shadow-md h-[42px]">
              <Filter className="h-4 w-4 mr-2" />
              Plus de filtres
            </button>
          </div>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="card table-container p-0">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Utilisateur</th>
              <th className="table-header-cell">Email</th>
              <th className="table-header-cell">Rôle</th>
              <th className="table-header-cell">Téléphone</th>
              <th className="table-header-cell">Statut</th>
              <th className="table-header-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {utilisateursFiltres.length > 0 ? (
              utilisateursFiltres.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <img
                        src={user.photo || 'https://i.pravatar.cc/40?img=user'}
                        alt={`${user.prenom} ${user.nom}`}
                        className="h-10 w-10 rounded-full object-cover shadow-sm"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.prenom} {user.nom}</div>
                        <div className="text-xs text-gray-500">{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">{user.email}</td>
                  <td className="table-cell capitalize">{user.role}</td>
                  <td className="table-cell">{user.telephone || 'N/A'}</td>
                  <td className="table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                      user.statut === 'actif' ? 'bg-acacia-100 text-acacia-800 border-acacia-200' :
                      'bg-terre-100 text-terre-800 border-terre-200'
                    }`}>
                      {user.statut || 'N/A'}
                    </span>
                  </td>
                  <td className="table-cell text-right font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => ouvrirModal('voir', user)}
                        className="p-2 rounded-full text-fleuve-600 hover:bg-fleuve-50 hover:text-fleuve-800 transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => ouvrirModal('modifier', user)}
                        className="p-2 rounded-full text-soleil-600 hover:bg-soleil-50 hover:text-soleil-800 transition-colors"
                        title="Modifier l'utilisateur"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 rounded-full text-terre-600 hover:bg-terre-50 hover:text-terre-800 transition-colors"
                        title="Supprimer l'utilisateur"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center">
                <td colSpan="6" className="py-12 text-gray-500">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  Aucun utilisateur trouvé pour cette sélection.
                  <p className="text-gray-400 text-sm mt-2">
                    Essayez d'ajuster vos filtres ou d'ajouter un nouvel utilisateur.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOuverte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {typeModal === 'ajouter' && 'Nouvel Utilisateur'}
                  {typeModal === 'modifier' && 'Modifier l\'utilisateur'}
                  {typeModal === 'voir' && 'Détails de l\'utilisateur'}
                </h3>
                <button
                  onClick={fermerModal}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Fermer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {typeModal === 'voir' ? (
                <div className="space-y-4 fade-in">
                  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
                    <img
                      src={utilisateurSelectionne?.photo || 'https://i.pravatar.cc/100?img=user'}
                      alt={`${utilisateurSelectionne?.prenom} ${utilisateurSelectionne?.nom}`}
                      className="h-24 w-24 rounded-full object-cover border-2 border-fleuve-200 shadow-md"
                    />
                    <div className="text-center sm:text-left">
                      <h4 className="text-2xl font-bold text-gray-900">
                        {utilisateurSelectionne?.prenom} {utilisateurSelectionne?.nom}
                      </h4>
                      <p className="text-gray-600 text-lg capitalize">{utilisateurSelectionne?.role}</p>
                      <span className={`inline-flex mt-2 px-3 py-1 text-sm font-semibold rounded-full border ${
                        utilisateurSelectionne?.statut === 'actif' ? 'bg-acacia-100 text-acacia-800 border-acacia-200' :
                        'bg-terre-100 text-terre-800 border-terre-200'
                      }`}>
                        {utilisateurSelectionne?.statut || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-base text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-soleil-600" />
                        {utilisateurSelectionne?.email}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Téléphone</p>
                      <p className="text-base text-gray-900 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-fleuve-600" />
                        {utilisateurSelectionne?.telephone || 'N/A'}
                      </p>
                    </div>
                    {utilisateurSelectionne?.role === 'enseignant' && (
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <p className="text-sm font-medium text-gray-700">Matière principale</p>
                            <p className="text-base text-gray-900 flex items-center">
                                <BookOpen className="h-4 w-4 mr-2 text-acacia-600" />
                                {utilisateurSelectionne.matiere || 'N/A'}
                            </p>
                        </div>
                    )}
                     {utilisateurSelectionne?.role === 'eleve' && (
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <p className="text-sm font-medium text-gray-700">Classe</p>
                            <p className="text-base text-gray-900 flex items-center">
                                <School className="h-4 w-4 mr-2 text-soleil-600" />
                                {utilisateurSelectionne.classe || 'N/A'}
                            </p>
                        </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => ouvrirModal('modifier', utilisateurSelectionne)}
                      className="btn-primary flex items-center shadow-sm hover:shadow-md"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </button>
                    <button className="btn-secondary text-terre-600 hover:bg-terre-50 flex items-center shadow-sm hover:shadow-md">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </button>
                  </div>
                </div>
              ) : (
                <FormulaireUtilisateur />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionUtilisateurs;