import {
    Edit,
    GraduationCap,
    MapPin,
    Plus,
    Search,
    Trash2,
    Users,
    X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext';

const ClassesPage = () => {
  const { donnees } = useAuth();
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [filtreNiveau, setFiltreNiveau] = useState('');
  const [classeSelectionnee, setClasseSelectionnee] = useState(null);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [typeModal, setTypeModal] = useState('');

  const classes = donnees?.classes || [];
  const enseignants = donnees?.enseignants || [];
  const eleves = donnees?.eleves || [];

  const niveaux = [...new Set(classes.map(classe => classe.niveau))];

  const classesFiltrees = classes.filter(classe => {
    const correspondRecherche = classe.nom.toLowerCase().includes(rechercheTexte.toLowerCase());
    const correspondNiveau = !filtreNiveau || classe.niveau === filtreNiveau;
    return correspondRecherche && correspondNiveau;
  });

  // Fonction pour compter les élèves par classe
  const compterElevesParClasse = (nomClasse) => {
    return eleves.filter(eleve => eleve.classe === nomClasse).length;
  };

  const ouvrirModal = (type, classe = null) => {
    setTypeModal(type);
    setClasseSelectionnee(classe);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setClasseSelectionnee(null);
    setTypeModal('');
  };

  const FormulaireClasse = () => {
    const [formData, setFormData] = useState(classeSelectionnee || {
      nom: '',
      niveau: '',
      effectif: 0,
      enseignantPrincipal: '',
      salle: ''
    });

    const gererSoumission = (e) => {
      e.preventDefault();
      console.log('Données classe:', formData);
      // Ici vous ajouteriez la logique pour sauvegarder
      fermerModal();
    };

    return (
      <form onSubmit={gererSoumission} className="space-y-4">wwwwwwwwwl
        <div className="grid grid-cols-1 md:grid-cols-2 gap- backdrop-blur-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la classe *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="6ème A"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niveau *
            </label>
            <select
              value={formData.niveau}
              onChange={(e) => setFormData({...formData, niveau: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un niveau</option>
              <option value="Primaire">Primaire</option>
              <option value="Collège">Collège</option>
              <option value="Lycée">Lycée</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Effectif maximum
            </label>
            <input
              type="number"
              value={formData.effectif}
              onChange={(e) => setFormData({...formData, effectif: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enseignant principal
            </label>
            <select
              value={formData.enseignantPrincipal}
              onChange={(e) => setFormData({...formData, enseignantPrincipal: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un enseignant</option>
              {enseignants.map(enseignant => (
                <option key={enseignant.id} value={`${enseignant.prenom} ${enseignant.nom}`}>
                  {enseignant.prenom} {enseignant.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salle de classe
            </label>
            <input
              type="text"
              value={formData.salle}
              onChange={(e) => setFormData({...formData, salle: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Salle 101"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button 
            type="button" 
            onClick={fermerModal} 
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Classes</h1>
          <p className="text-gray-600">Gérez les classes de l'établissement</p>
        </div>
        <button
          onClick={() => ouvrirModal('ajouter')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Classe
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher une classe..."
                value={rechercheTexte}
                onChange={(e) => setRechercheTexte(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={filtreNiveau}
              onChange={(e) => setFiltreNiveau(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les niveaux</option>
              {niveaux.map(niveau => (
                <option key={niveau} value={niveau}>{niveau}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grille des classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classesFiltrees.map((classe) => (
          <div key={classe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {classe.nom}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {classe.niveau}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="p-2 text-gray-500 hover:text-blue-600 border border-gray-300 rounded hover:bg-blue-50"
                    onClick={() => ouvrirModal('modifier', classe)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-600 border border-gray-300 rounded hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <GraduationCap className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Professeur principal</p>
                    <p className="text-sm text-gray-500">
                      {classe.enseignantPrincipal || 'Non assigné'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Effectif</p>
                    <p className="text-sm text-gray-500">
                      {compterElevesParClasse(classe.nom)} élèves
                    </p>
                  </div>
                </div>

              </div>

              <div className="mt-6">
                <button 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => ouvrirModal('voir', classe)}
                >
                  Voir les détails
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message si aucune classe */}
      {classesFiltrees.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune classe trouvée</h3>
          <p className="text-gray-500">
            {rechercheTexte || filtreNiveau 
              ? 'Aucune classe ne correspond à vos critères de recherche.' 
              : 'Commencez par ajouter votre première classe.'
            }
          </p>
        </div>
      )}

      {/* Modal */}
      {modalOuverte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {typeModal === 'ajouter' && 'Ajouter une classe'}
                  {typeModal === 'modifier' && 'Modifier la classe'}
                  {typeModal === 'voir' && 'Détails de la classe'}
                </h3>
                <button
                  onClick={fermerModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {typeModal === 'voir' ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="text-2xl font-bold text-gray-900">{classeSelectionnee?.nom}</h4>
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 mt-2">
                      {classeSelectionnee?.niveau}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">
                        {compterElevesParClasse(classeSelectionnee?.nom)}
                      </p>
                      <p className="text-sm text-gray-600">Élèves inscrits</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-lg font-medium text-gray-900">
                        {classeSelectionnee?.salle || 'Non définie'}
                      </p>
                      <p className="text-sm text-gray-600">Salle</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Enseignant principal</p>
                    <p className="text-lg text-blue-800">
                      {classeSelectionnee?.enseignantPrincipal || 'Non assigné'}
                    </p>
                  </div>
                  {classeSelectionnee?.effectif && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Effectif maximum</p>
                      <p className="text-lg text-gray-900">{classeSelectionnee.effectif} élèves</p>
                    </div>
                  )}
                </div>
              ) : (
                <FormulaireClasse />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesPage;