import {
  Download,
  Edit,
  Eye,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext';

const EnseignantsPage = () => {
  const { donnees } = useAuth();
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [filtreMatiere, setFiltreMatiere] = useState('');
  const [enseignantSelectionne, setEnseignantSelectionne] = useState(null);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [typeModal, setTypeModal] = useState('');

  const enseignants = donnees.enseignants || [];
  const matieres = donnees.matieres || [];

  const enseignantsFiltres = enseignants.filter(enseignant => {
    const correspondRecherche = `${enseignant.prenom} ${enseignant.nom} ${enseignant.email}`
      .toLowerCase()
      .includes(rechercheTexte.toLowerCase());
    const correspondMatiere = !filtreMatiere || enseignant.matiere === filtreMatiere;
    return correspondRecherche && correspondMatiere;
  });

  const ouvrirModal = (type, enseignant = null) => {
    setTypeModal(type);
    setEnseignantSelectionne(enseignant);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setEnseignantSelectionne(null);
    setTypeModal('');
  };

  const FormulaireEnseignant = () => {
    const [formData, setFormData] = useState(enseignantSelectionne || {
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      matiere: '',
      classes: [],
      dateEmbauche: '',
      statut: 'actif'
    });

    const gererSoumission = (e) => {
      e.preventDefault();
      console.log('Données enseignant:', formData);
      fermerModal();
    };

    return (
      <form onSubmit={gererSoumission} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">
              Prénom *
            </label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => setFormData({...formData, prenom: e.target.value})}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Nom *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Téléphone *
            </label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData({...formData, telephone: e.target.value})}
              className="input-field"
              placeholder="77 123 45 67"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Matière principale *
            </label>
            <select
              value={formData.matiere}
              onChange={(e) => setFormData({...formData, matiere: e.target.value})}
              className="input-field"
              required
            >
              <option value="">Sélectionner une matière</option>
              {matieres.map(matiere => (
                <option key={matiere.id} value={matiere.nom}>{matiere.nom}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Date d'embauche *
            </label>
            <input
              type="date"
              value={formData.dateEmbauche}
              onChange={(e) => setFormData({...formData, dateEmbauche: e.target.value})}
              className="input-field"
              required
            />
          </div>
          {/* Les classes enseignées (multisélection) peuvent être ajoutées ici si nécessaire, mais demandent plus de logique */}
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={fermerModal} className="btn-secondary">
            Annuler
          </button>
          <button type="submit" className="btn-primary">
            {typeModal === 'ajouter' ? 'Ajouter' : 'Modifier'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Enseignants</h1>
          <p className="text-gray-600">Gérez le personnel enseignant</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center shadow-sm hover:shadow-md">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <button
            onClick={() => ouvrirModal('ajouter')}
            className="btn-primary flex items-center shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Enseignant
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un enseignant..."
                value={rechercheTexte}
                onChange={(e) => setRechercheTexte(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
          </div>
          <div className="form-group flex-shrink-0">
            <select
              value={filtreMatiere}
              onChange={(e) => setFiltreMatiere(e.target.value)}
              className="input-field"
            >
              <option value="">Toutes les matières</option>
              {matieres.map(matiere => (
                <option key={matiere.id} value={matiere.nom}>{matiere.nom}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des enseignants */}
      <div className="card table-container p-0">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">
                Enseignant
              </th>
              <th className="table-header-cell">
                Contact
              </th>
              <th className="table-header-cell">
                Matière
              </th>
              <th className="table-header-cell">
                Classes
              </th>
              <th className="table-header-cell">
                Date d'embauche
              </th>
              <th className="table-header-cell">
                Statut
              </th>
              <th className="table-header-cell text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="table-body">
            {enseignantsFiltres.map((enseignant) => (
              <tr key={enseignant.id} className="table-row">
                <td className="table-cell">
                  <div className="flex items-center">
                    <img
                      src={enseignant.photo || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                      alt={`${enseignant.prenom} ${enseignant.nom}`}
                      className="h-10 w-10 rounded-full object-cover shadow-sm"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {enseignant.prenom} {enseignant.nom}
                      </div>
                      <div className="text-sm text-gray-500">
                        Enseignant
                      </div>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="text-sm text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 mr-1 text-fleuve-600" /> {/* Couleur fleuve */}
                    {enseignant.telephone}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Mail className="h-4 w-4 mr-1 text-soleil-600" /> {/* Couleur soleil */}
                    {enseignant.email}
                  </div>
                </td>
                <td className="table-cell">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-fleuve-100 text-fleuve-800 border border-fleuve-200"> {/* Couleur fleuve */}
                    {enseignant.matiere}
                  </span>
                </td>
                <td className="table-cell">
                  {enseignant.classes?.join(', ') || 'Aucune'}
                </td>
                <td className="table-cell">
                  {new Date(enseignant.dateEmbauche).toLocaleDateString('fr-FR')}
                </td>
                <td className="table-cell">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                    enseignant.statut === 'actif' 
                      ? 'bg-acacia-100 text-acacia-800 border-acacia-200' // Couleur acacia pour actif
                      : 'bg-terre-100 text-terre-800 border-terre-200' // Couleur terre pour inactif
                  }`}>
                    {enseignant.statut === 'actif' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="table-cell text-right font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => ouvrirModal('voir', enseignant)}
                      className="p-2 rounded-full text-fleuve-600 hover:bg-fleuve-50 hover:text-fleuve-800 transition-colors duration-200"
                      title="Voir les détails"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => ouvrirModal('modifier', enseignant)}
                      className="p-2 rounded-full text-soleil-600 hover:bg-soleil-50 hover:text-soleil-800 transition-colors duration-200"
                      title="Modifier l'enseignant"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 rounded-full text-terre-600 hover:bg-terre-50 hover:text-terre-800 transition-colors duration-200"
                      title="Supprimer l'enseignant"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {enseignantsFiltres.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun enseignant trouvé</p>
            <p className="text-gray-400 text-sm mt-2">Essayez d'ajuster vos filtres ou d'ajouter un nouvel enseignant.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOuverte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {typeModal === 'ajouter' && 'Ajouter un enseignant'}
                  {typeModal === 'modifier' && 'Modifier l\'enseignant'}
                  {typeModal === 'voir' && 'Détails de l\'enseignant'}
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
                  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
                    <img
                      src={enseignantSelectionne?.photo || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                      alt={`${enseignantSelectionne?.prenom} ${enseignantSelectionne?.nom}`}
                      className="h-24 w-24 rounded-full object-cover border-2 border-fleuve-200 shadow-md"
                    />
                    <div className="text-center sm:text-left">
                      <h4 className="text-2xl font-bold text-gray-900">
                        {enseignantSelectionne?.prenom} {enseignantSelectionne?.nom}
                      </h4>
                      <p className="text-gray-600 text-lg">{enseignantSelectionne?.matiere}</p>
                      <span className={`inline-flex mt-2 px-3 py-1 text-sm font-semibold rounded-full border ${
                        enseignantSelectionne?.statut === 'actif' 
                          ? 'bg-acacia-100 text-acacia-800 border-acacia-200'
                          : 'bg-terre-100 text-terre-800 border-terre-200'
                      }`}>
                        {enseignantSelectionne?.statut === 'actif' ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-base text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-soleil-600" />
                        {enseignantSelectionne?.email}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Téléphone</p>
                      <p className="text-base text-gray-900 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-fleuve-600" />
                        {enseignantSelectionne?.telephone}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Classes</p>
                      <p className="text-base text-gray-900">
                        {enseignantSelectionne?.classes?.join(', ') || 'Aucune'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Date d'embauche</p>
                      <p className="text-base text-gray-900">
                        {new Date(enseignantSelectionne?.dateEmbauche).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => ouvrirModal('modifier', enseignantSelectionne)}
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
                <FormulaireEnseignant />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnseignantsPage;
