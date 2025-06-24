import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Download,
  Edit,
  Eye,
  Filter,
  Mail,
  Phone,
  Plus,
  School,
  Search,
  Trash2,
  Users,
  X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuth } from '../../context/MonContext';

const ElevesPage = () => {
  const { donnees } = useAuth();
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [filtreClasse, setFiltreClasse] = useState('');
  const [filtreSexe, setFiltreSexe] = useState('');
  const [ordreTri, setOrdreTri] = useState('nom_asc');
  const [filtreModalOuvert, setFiltreModalOuvert] = useState(false); // Nouvel état pour le modal de filtre

  const [eleveSelectionne, setEleveSelectionne] = useState(null);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [typeModal, setTypeModal] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const eleves = donnees.eleves || [];
  const classes = donnees.classes || [];

  const elevesFiltresEtTriés = useMemo(() => {
    let tempEleves = eleves.filter(eleve => {
      const nomComplet = `${eleve.prenom || ''} ${eleve.nom || ''}`.toLowerCase();
      const matricule = eleve.numeroMatricule?.toLowerCase() || '';

      const correspondRecherche = nomComplet.includes(rechercheTexte.toLowerCase()) ||
                                  matricule.includes(rechercheTexte.toLowerCase());
      const correspondClasse = !filtreClasse || eleve.classe === filtreClasse;
      const correspondSexe = !filtreSexe || eleve.sexe === filtreSexe;

      return correspondRecherche && correspondClasse && correspondSexe;
    });

    tempEleves.sort((a, b) => {
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

    return tempEleves;
  }, [eleves, rechercheTexte, filtreClasse, filtreSexe, ordreTri]);

  const totalPages = Math.ceil(elevesFiltresEtTriés.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEleves = elevesFiltresEtTriés.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const ouvrirModal = (type, eleve = null) => {
    setTypeModal(type);
    setEleveSelectionne(eleve);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setEleveSelectionne(null);
    setTypeModal('');
  };

  // Fonction pour gérer le changement de filtre et réinitialiser la pagination
  const handleFilterChange = (setter, value) => {
    setCurrentPage(1);
    setter(value);
  };


  const FormulairEleve = () => {
    const [formData, setFormData] = useState(eleveSelectionne || {
      prenom: '',
      nom: '',
      sexe: '',
      dateNaissance: '',
      classe: '',
      numeroMatricule: '',
      telephoneParent: '',
      emailParent: '',
      statut: 'actif'
    });

    const gererSoumission = (e) => {
      e.preventDefault();
      console.log('Données élève:', formData);
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
              Sexe *
            </label>
            <select
              value={formData.sexe}
              onChange={(e) => setFormData({...formData, sexe: e.target.value})}
              className="input-field"
              required
            >
              <option value="">Sélectionner</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Date de naissance *
            </label>
            <input
              type="date"
              value={formData.dateNaissance}
              onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Classe *
            </label>
            <select
              value={formData.classe}
              onChange={(e) => setFormData({...formData, classe: e.target.value})}
              className="input-field"
              required
            >
              <option value="">Sélectionner une classe</option>
              {classes.map(classe => (
                <option key={classe.id} value={classe.nom}>{classe.nom}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              N° Matricule
            </label>
            <input
              type="text"
              value={formData.numeroMatricule}
              onChange={(e) => setFormData({...formData, numeroMatricule: e.target.value})}
              className="input-field"
              placeholder="Auto-généré si vide"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Téléphone Parent *
            </label>
            <input
              type="tel"
              value={formData.telephoneParent}
              onChange={(e) => setFormData({...formData, telephoneParent: e.target.value})}
              className="input-field"
              placeholder="77 123 45 67"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Email Parent
            </label>
            <input
              type="email"
              value={formData.emailParent}
              onChange={(e) => setFormData({...formData, emailParent: e.target.value})}
              className="input-field"
              placeholder="parent@email.sn"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={fermerModal}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Élèves</h1>
          <p className="text-gray-600">Gérez les élèves de l'établissement</p>
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
            Nouvel Élève
          </button>
        </div>
      </div>

      {/* Filtres et recherche (Version pour grands écrans) */}
      <div className="card p-6 shadow-sm hidden md:block"> {/* Masqué sur petits écrans */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative form-group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un élève (nom, prénom, matricule)..."
              value={rechercheTexte}
              onChange={(e) => handleFilterChange(setRechercheTexte, e.target.value)}
              className="pl-10 input-field"
            />
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
              value={filtreSexe}
              onChange={(e) => handleFilterChange(setFiltreSexe, e.target.value)}
              className="input-field"
            >
              <option value="">Tous les sexes</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
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

      {/* Bouton de filtre pour petits écrans */}
      <div className="block md:hidden text-center mt-4">
        <button
          onClick={() => setFiltreModalOuvert(true)}
          className="btn-secondary flex items-center justify-center mx-auto shadow-sm hover:shadow-md"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtrer les élèves
        </button>
      </div>

      {/* Tableau des élèves */}
      <div className="card table-container p-0">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">
                Élève
              </th>
              <th className="table-header-cell">
                Matricule
              </th>
              <th className="table-header-cell">
                Classe
              </th>
              <th className="table-header-cell">
                Date de naissance
              </th>
              <th className="table-header-cell">
                Parent
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
            {currentEleves.length > 0 ? (
              currentEleves.map((eleve) => (
                <tr key={eleve.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <img
                        src={eleve.photo || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                        alt={`${eleve.prenom} ${eleve.nom}`}
                        className="h-10 w-10 rounded-full object-cover shadow-sm"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {eleve.prenom} {eleve.nom}
                        </div>
                        <div className="text-sm text-gray-500">
                          {eleve.sexe === 'M' ? 'Garçon' : 'Féminin'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    {eleve.numeroMatricule}
                  </td>
                  <td className="table-cell">
                    {eleve.classe}
                  </td>
                  <td className="table-cell">
                    {new Date(eleve.dateNaissance).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">{eleve.telephoneParent}</div>
                    <div className="text-sm text-gray-500">{eleve.emailParent}</div>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                        eleve.statut === 'actif'
                          ? 'bg-acacia-100 text-acacia-800 border-acacia-200'
                          : 'bg-terre-100 text-terre-800 border-terre-200'
                      }`}>
                      {eleve.statut === 'actif' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="table-cell text-right font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => ouvrirModal('voir', eleve)}
                        className="p-2 rounded-full text-fleuve-600 hover:bg-fleuve-50 hover:text-fleuve-800 transition-colors duration-200"
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => ouvrirModal('modifier', eleve)}
                        className="p-2 rounded-full text-soleil-600 hover:bg-soleil-50 hover:text-soleil-800 transition-colors duration-200"
                        title="Modifier l'élève"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 rounded-full text-terre-600 hover:bg-terre-50 hover:text-terre-800 transition-colors duration-200"
                        title="Supprimer l'élève"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center">
                <td colSpan="7" className="py-12 text-gray-500">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  Aucun élève trouvé pour cette sélection.
                  <p className="text-gray-400 text-sm mt-2">Essayez d'ajuster vos filtres ou d'ajouter un nouvel élève.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {elevesFiltresEtTriés.length > itemsPerPage && (
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

      {/* Modal pour l'ajout/modification/visualisation */}
      {modalOuverte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {typeModal === 'ajouter' && 'Ajouter un élève'}
                  {typeModal === 'modifier' && 'Modifier l\'élève'}
                  {typeModal === 'voir' && 'Détails de l\'élève'}
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
                      src={eleveSelectionne?.photo || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                      alt={`${eleveSelectionne?.prenom} ${eleveSelectionne?.nom}`}
                      className="h-24 w-24 rounded-full object-cover border-2 border-fleuve-200 shadow-md"
                    />
                    <div className="text-center sm:text-left">
                      <h4 className="text-2xl font-bold text-gray-900">
                        {eleveSelectionne?.prenom} {eleveSelectionne?.nom}
                      </h4>
                      <p className="text-gray-600 text-lg">{eleveSelectionne?.numeroMatricule}</p>
                      <span className={`inline-flex mt-2 px-3 py-1 text-sm font-semibold rounded-full border ${
                          eleveSelectionne?.statut === 'actif'
                            ? 'bg-acacia-100 text-acacia-800 border-acacia-200'
                            : 'bg-terre-100 text-terre-800 border-terre-200'
                        }`}>
                        {eleveSelectionne?.statut === 'actif' ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Classe</p>
                      <p className="text-base text-gray-900 font-semibold flex items-center">
                        <School className="h-4 w-4 mr-2 text-fleuve-600" />
                        {eleveSelectionne?.classe}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Date de naissance</p>
                      <p className="text-base text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-soleil-600" />
                        {new Date(eleveSelectionne?.dateNaissance).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Téléphone parent</p>
                      <p className="text-base text-gray-900 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-acacia-600" />
                        {eleveSelectionne?.telephoneParent}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Email parent</p>
                      <p className="text-base text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-terre-600" />
                        {eleveSelectionne?.emailParent}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => ouvrirModal('modifier', eleveSelectionne)}
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
                <FormulairEleve />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Nouveau Modal pour les options de filtrage (pour petits écrans) */}
      {filtreModalOuvert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
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
                    placeholder="Rechercher un élève..."
                    value={rechercheTexte}
                    onChange={(e) => handleFilterChange(setRechercheTexte, e.target.value)}
                    className="pl-10 input-field"
                  />
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
                    value={filtreSexe}
                    onChange={(e) => handleFilterChange(setFiltreSexe, e.target.value)}
                    className="input-field"
                  >
                    <option value="">Tous les sexes</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
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

export default ElevesPage;