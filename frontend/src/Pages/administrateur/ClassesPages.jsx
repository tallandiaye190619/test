import {
  Edit,
  Eye,
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

  const classes = donnees.classes || [];
  const enseignants = donnees.enseignants || [];

  const niveaux = [...new Set(classes.map(classe => classe.niveau))];

  const classesFiltrees = classes.filter(classe => {
    const correspondRecherche = classe.nom.toLowerCase().includes(rechercheTexte.toLowerCase());
    const correspondNiveau = !filtreNiveau || classe.niveau === filtreNiveau;
    return correspondRecherche && correspondNiveau;
  });

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
      fermerModal();
    };

    return (
      <form onSubmit={gererSoumission} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group"> {/* Utilisation de form-group */}
            <label className="form-label"> {/* Utilisation de form-label */}
              Nom de la classe *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              className="input-field" 
              placeholder="6ème A"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Niveau *
            </label>
            <select
              value={formData.niveau}
              onChange={(e) => setFormData({...formData, niveau: e.target.value})}
              className="input-field"
              required
            >
              <option value="">Sélectionner un niveau</option>
              <option value="Primaire">Primaire</option>
              <option value="Collège">Collège</option>
              <option value="Lycée">Lycée</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Effectif maximum
            </label>
            <input
              type="number"
              value={formData.effectif}
              onChange={(e) => setFormData({...formData, effectif: parseInt(e.target.value)})}
              className="input-field"
              min="0"
              max="50"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Enseignant principal
            </label>
            <select
              value={formData.enseignantPrincipal}
              onChange={(e) => setFormData({...formData, enseignantPrincipal: e.target.value})}
              className="input-field"
            >
              <option value="">Sélectionner un enseignant</option>
              {enseignants.map(enseignant => (
                <option key={enseignant.id} value={`${enseignant.prenom} ${enseignant.nom}`}>
                  {enseignant.prenom} {enseignant.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 form-group"> {/* Assure que le form-group prend 2 colonnes */}
            <label className="form-label">
              Salle de classe
            </label>
            <input
              type="text"
              value={formData.salle}
              onChange={(e) => setFormData({...formData, salle: e.target.value})}
              className="input-field"
              placeholder="Salle 101"
            />
          </div>
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Classes</h1>
          <p className="text-gray-600">Gérez les classes de l'établissement</p>
        </div>
        <button
          onClick={() => ouvrirModal('ajouter')}
          className="btn-primary flex items-center shadow-md hover:shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Classe
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher une classe..."
                value={rechercheTexte}
                onChange={(e) => setRechercheTexte(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
          </div>
          <div className="form-group flex-shrink-0">
            <select
              value={filtreNiveau}
              onChange={(e) => setFiltreNiveau(e.target.value)}
              className="input-field"
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
          <div key={classe.id} className="card p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{classe.nom}</h3>
                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-fleuve-100 text-fleuve-800 border border-fleuve-200"> {/* Couleur fleuve */}
                  {classe.niveau}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => ouvrirModal('voir', classe)}
                  className="p-2 rounded-full text-fleuve-600 hover:bg-fleuve-50 hover:text-fleuve-800 transition-colors duration-200"
                  title="Voir les détails"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => ouvrirModal('modifier', classe)}
                  className="p-2 rounded-full text-soleil-600 hover:bg-soleil-50 hover:text-soleil-800 transition-colors duration-200"
                  title="Modifier la classe"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  className="p-2 rounded-full text-terre-600 hover:bg-terre-50 hover:text-terre-800 transition-colors duration-200"
                  title="Supprimer la classe"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-700">
                <Users className="h-4 w-4 mr-2 text-fleuve-600" /> {/* Couleur fleuve */}
                <span className="font-medium text-gray-900">{classe.effectif}</span> élèves
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <GraduationCap className="h-4 w-4 mr-2 text-acacia-600" /> {/* Couleur acacia */}
                <span>{classe.enseignantPrincipal || 'Aucun enseignant assigné'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <MapPin className="h-4 w-4 mr-2 text-soleil-600" /> {/* Couleur soleil */}
                <span>{classe.salle || 'Salle non définie'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {classesFiltrees.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune classe trouvée</p>
          <p className="text-gray-400 text-sm mt-2">Essayez d'ajuster vos filtres ou d'ajouter une nouvelle classe.</p>
        </div>
      )}

      {/* Modal */}
      {modalOuverte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {typeModal === 'ajouter' && 'Ajouter une classe'}
                  {typeModal === 'modifier' && 'Modifier la classe'}
                  {typeModal === 'voir' && 'Détails de la classe'}
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
                  <div className="text-center bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
                    <GraduationCap className="h-12 w-12 text-fleuve-600 mx-auto mb-3" /> {/* Icône plus grande et colorée */}
                    <h4 className="text-2xl font-bold text-gray-900">{classeSelectionnee?.nom}</h4>
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-fleuve-100 text-fleuve-800 border border-fleuve-200 mt-2">
                      {classeSelectionnee?.niveau}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Effectif</p>
                      <p className="text-2xl font-bold text-gray-900">{classeSelectionnee?.effectif}</p>
                      <p className="text-sm text-gray-600">Élèves</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Salle</p>
                      <p className="text-lg font-bold text-gray-900">{classeSelectionnee?.salle || 'Non définie'}</p>
                      <p className="text-sm text-gray-600">de classe</p>
                    </div>
                  </div>
                  <div className="bg-soleil-50 p-4 rounded-lg border border-soleil-200 shadow-sm"> {/* Couleur soleil */}
                    <p className="text-sm font-medium text-soleil-900 flex items-center mb-2">
                      <GraduationCap className="h-5 w-5 mr-2 text-soleil-600" /> Enseignant principal
                    </p>
                    <p className="text-lg text-soleil-800 font-semibold">{classeSelectionnee?.enseignantPrincipal || 'Non assigné'}</p>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => ouvrirModal('modifier', classeSelectionnee)}
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