import {
  ArrowLeft,
  ArrowRight,
  Download,
  Edit,
  Eye,
  Filter // <-- AJOUTÉ: Pour l'icône du bouton de filtre mobile
  ,
  Mail,
  Phone,
  Plus,
  Save,
  School,
  Search,
  Trash2,
  Users,
  X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuth } from '../../context/MonContext';

const EnseignantsPage = () => {
  const { donnees } = useAuth();
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [filtreMatiere, setFiltreMatiere] = useState('');
  const [filtreClasse, setFiltreClasse] = useState('');
  const [ordreTri, setOrdreTri] = useState('nom_asc');
  const [filtreModalOuvert, setFiltreModalOuvert] = useState(false); // <-- NOUVEL ÉTAT pour le modal de filtre

  const [enseignantSelectionne, setEnseignantSelectionne] = useState(null);
  const [modalOuverte, setModalOuverte] = useState(false); // Pour le modal d'ajout/édition/vue
  const [typeModal, setTypeModal] = useState('');

  const enseignants = donnees.enseignants || [];
  const classes = donnees.classes || [];
  const matieres = donnees.matieres || [];

  // Fonction pour gérer le changement de filtre et réinitialiser la pagination
  const handleFilterChange = (setter, value) => {
    setCurrentPage(1); // Réinitialise la pagination à chaque changement de filtre
    setter(value);
  };

  const enseignantsFiltresEtTries = useMemo(() => {
    let tempEnseignants = enseignants.filter(enseignant => {
      const nomComplet = `${enseignant.prenom || ''} ${enseignant.nom || ''}`.toLowerCase();
      const correspondRecherche = nomComplet.includes(rechercheTexte.toLowerCase()) ||
                                  enseignant.email?.toLowerCase().includes(rechercheTexte.toLowerCase());

      const correspondMatiere = !filtreMatiere || enseignant.matiere === filtreMatiere;

      const correspondClasse = !filtreClasse ||
        (enseignant.classesIds && enseignant.classesIds.some(classId =>
          classes.find(c => c.id === classId)?.nom === filtreClasse
        ));

      return correspondRecherche && correspondMatiere && correspondClasse;
    });

    tempEnseignants.sort((a, b) => {
      const nomA = a.nom.toLowerCase();
      const prenomA = a.prenom.toLowerCase();
      const nomB = b.nom.toLowerCase();
      const prenomB = b.prenom.toLowerCase();

      if (ordreTri === 'nom_asc') {
        return nomA.localeCompare(nomB);
      } else if (ordreTri === 'nom_desc') {
        return nomB.localeCompare(nomA);
      } else if (ordreTri === 'prenom_asc') {
        return prenomA.localeCompare(prenomB);
      } else if (ordreTri === 'prenom_desc') {
        return prenomB.localeCompare(prenomA);
      }
      return 0;
    });

    return tempEnseignants;
  }, [enseignants, rechercheTexte, filtreMatiere, filtreClasse, ordreTri, classes]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(enseignantsFiltresEtTries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEnseignants = enseignantsFiltresEtTries.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

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

  const getClasseNamesByIds = (classeIds) => {
    if (!classeIds || classeIds.length === 0) return 'Aucune';
    return classeIds.map(id => classes.find(c => c.id === id)?.nom).filter(Boolean).join(', ');
  };

  const FormulaireEnseignant = () => {
    const [formData, setFormData] = useState(enseignantSelectionne || {
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      matiere: '',
      classesIds: [],
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
            <label className="form-label">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Téléphone *</label>
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
            <label className="form-label">Matière principale *</label>
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
            <label className="form-label">Classes enseignées</label>
            <select
              multiple
              value={formData.classesIds.map(String)}
              onChange={(e) => setFormData({...formData, classesIds: Array.from(e.target.selectedOptions, option => parseInt(option.value))})}
              className="input-field h-32"
            >
              {classes.map(classe => (
                <option key={classe.id} value={classe.id}>{classe.nom}</option>
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
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
          <button type="button" onClick={fermerModal} className="btn-secondary shadow-sm hover:shadow-md">
            Annuler
          </button>
          <button type="submit" className="btn-primary flex items-center shadow-md hover:shadow-lg">
            <Save className="h-4 w-4 mr-2" />
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
          <p className="text-gray-600">Gérez le personnel enseignant de l'établissement</p>
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

      {/* Filtres et recherche (Version pour GRANDS écrans) */}
      <div className="card p-6 shadow-sm hidden md:block"> {/* <-- Masqué sur petits écrans */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="relative form-group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un enseignant (nom, prénom, email)..."
              value={rechercheTexte}
              onChange={(e) => handleFilterChange(setRechercheTexte, e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          <div className="form-group">
            <select
              value={filtreMatiere}
              onChange={(e) => handleFilterChange(setFiltreMatiere, e.target.value)}
              className="input-field"
            >
              <option value="">Toutes les matières</option>
              {matieres.map(matiere => (
                <option key={matiere.id} value={matiere.nom}>{matiere.nom}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <select
              value={filtreClasse}
              onChange={(e) => handleFilterChange(setFiltreClasse, e.target.value)}
              className="input-field"
            >
              <option value="">Toutes les classes</option>
              {classes.map(classe => (
                <option key={classe.id} value={classe.nom}>{classe.nom}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <select
              value={ordreTri}
              onChange={(e) => handleFilterChange(setOrdreTri, e.target.value)}
              className="input-field"
            >
              <option value="nom_asc">Nom (A-Z)</option>
              <option value="nom_desc">Nom (Z-A)</option>
              <option value="prenom_asc">Prénom (A-Z)</option>
              <option value="prenom_desc">Prénom (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bouton de filtre pour PETITS écrans */}
      <div className="block md:hidden text-center mt-4"> {/* <-- Visible uniquement sur petits écrans */}
        <button
          onClick={() => setFiltreModalOuvert(true)}
          className="btn-secondary flex items-center justify-center mx-auto shadow-sm hover:shadow-md"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtrer les enseignants
        </button>
      </div>

      {/* Tableau des enseignants */}
      <div className="card table-container p-0">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Enseignant</th>
              <th className="table-header-cell">Matière</th>
              <th className="table-header-cell">Contact</th>
              <th className="table-header-cell">Classes</th>
              <th className="table-header-cell">Statut</th>
              <th className="table-header-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {currentEnseignants.length > 0 ? (
              currentEnseignants.map((enseignant) => (
                <tr key={enseignant.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <img
                        src={enseignant.photo || 'https://images.pexels.com/photos/2726047/pexels-photo-2726047.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                        alt={`${enseignant.prenom} ${enseignant.nom}`}
                        className="h-10 w-10 rounded-full object-cover shadow-sm"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {enseignant.prenom} {enseignant.nom}
                        </div>
                        <div className="text-xs text-gray-500">Enseignant</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-fleuve-100 text-fleuve-800 border border-fleuve-200">
                      {enseignant.matiere}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-fleuve-600" />
                      {enseignant.telephone}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-soleil-600" />
                      {enseignant.email}
                    </div>
                  </td>
                  <td className="table-cell">
                    {getClasseNamesByIds(enseignant.classesIds)}
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                        enseignant.statut === 'actif'
                          ? 'bg-acacia-100 text-acacia-800 border-acacia-200'
                          : 'bg-terre-100 text-terre-800 border-terre-200'
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
              ))
            ) : (
              <tr className="text-center">
                <td colSpan="6" className="py-12 text-gray-500">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  Aucun enseignant trouvé pour cette sélection.
                  <p className="text-gray-400 text-sm mt-2">Essayez d'ajuster vos filtres ou d'ajouter un nouvel enseignant.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {enseignantsFiltresEtTries.length > itemsPerPage && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="btn-secondary px-4 py-2 flex items-center shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Précédent
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="btn-secondary px-4 py-2 flex items-center shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      )}

      {/* Modal pour l'ajout/modification/visualisation des enseignants */}
      {modalOuverte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {typeModal === 'ajouter' && 'Ajouter un enseignant'}
                  {typeModal === 'modifier' && 'Modifier l\'enseignant'}
                  {typeModal === 'voir' && 'Détails de l\'enseignant'}
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
                      src={enseignantSelectionne?.photo || 'https://images.pexels.com/photos/2726047/pexels-photo-2726047.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                      alt={`${enseignantSelectionne?.prenom} ${enseignantSelectionne?.nom}`}
                      className="h-24 w-24 rounded-full object-cover border-2 border-fleuve-200 shadow-md"
                    />
                    <div className="text-center sm:text-left">
                      <h4 className="text-2xl font-bold text-gray-900">
                        {enseignantSelectionne?.prenom} {enseignantSelectionne?.nom}
                      </h4>
                      <p className="text-gray-600 text-lg">{enseignantSelectionne?.matiere}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Téléphone</p>
                      <p className="text-base text-gray-900 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-acacia-600" />
                        {enseignantSelectionne?.telephone}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-base text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-terre-600" />
                        {enseignantSelectionne?.email}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 col-span-1 md:col-span-2">
                      <p className="text-sm font-medium text-gray-700">Classes enseignées</p>
                      <p className="text-base text-gray-900 flex items-center">
                        <School className="h-4 w-4 mr-2 text-fleuve-600" />
                        {getClasseNamesByIds(enseignantSelectionne?.classesIds)}
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

      {/* Nouveau Modal pour les options de filtrage (pour petits écrans) */}
      {filtreModalOuvert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg w-full max-w-xs sm:max-w-md max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Options de Filtrage</h3>
                <button
                  onClick={() => setFiltreModalOuvert(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Fermer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4"> {/* Contenu des filtres */}
                <div className="relative form-group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Rechercher un enseignant..."
                    value={rechercheTexte}
                    onChange={(e) => handleFilterChange(setRechercheTexte, e.target.value)}
                    className="pl-10 input-field"
                  />
                </div>
                <div className="form-group">
                  <select
                    value={filtreMatiere}
                    onChange={(e) => handleFilterChange(setFiltreMatiere, e.target.value)}
                    className="input-field"
                  >
                    <option value="">Toutes les matières</option>
                    {matieres.map(matiere => (
                      <option key={matiere.id} value={matiere.nom}>{matiere.nom}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <select
                    value={filtreClasse}
                    onChange={(e) => handleFilterChange(setFiltreClasse, e.target.value)}
                    className="input-field"
                  >
                    <option value="">Toutes les classes</option>
                    {classes.map(classe => (
                      <option key={classe.id} value={classe.nom}>{classe.nom}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <select
                    value={ordreTri}
                    onChange={(e) => handleFilterChange(setOrdreTri, e.target.value)}
                    className="input-field"
                  >
                    <option value="nom_asc">Nom (A-Z)</option>
                    <option value="nom_desc">Nom (Z-A)</option>
                    <option value="prenom_asc">Prénom (A-Z)</option>
                    <option value="prenom_desc">Prénom (Z-A)</option>
                  </select>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={() => setFiltreModalOuvert(false)}
                        className="btn-primary"
                    >
                        Appliquer les filtres
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnseignantsPage;