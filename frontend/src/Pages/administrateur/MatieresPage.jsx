
import {
  Book,
  BookOpen,
  Edit,
  Hash,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext'; // Assurez-vous que c'est bien useAuth ou votre hook correct

const MatieresPage = () => {
  const { donnees } = useAuth();
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [matiereSelectionnee, setMatiereSelectionnee] = useState(null);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [typeModal, setTypeModal] = useState('');

  const matieres = donnees.matieres || [];

  const matieresFiltrees = matieres.filter(matiere => {
    return matiere.nom.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
           matiere.code.toLowerCase().includes(rechercheTexte.toLowerCase());
  });

  const ouvrirModal = (type, matiere = null) => {
    setTypeModal(type);
    setMatiereSelectionnee(matiere);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setMatiereSelectionnee(null);
    setTypeModal('');
  };

  const FormulaireMatiere = () => {
    const [formData, setFormData] = useState(matiereSelectionnee || {
      nom: '',
      code: '',
      coefficient: 1,
      description: ''
    });

    const gererSoumission = (e) => {
      e.preventDefault();
      console.log('Données matière:', formData);
      fermerModal();
    };

    return (
      <form onSubmit={gererSoumission} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group"> {/* Utilisation du composant form-group */}
            <label className="form-label"> {/* Utilisation du composant form-label */}
              Nom de la matière *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              className="input-field"
              placeholder="Mathématiques"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Code matière *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
              className="input-field"
              placeholder="MATH"
              maxLength="5"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Coefficient *
            </label>
            <input
              type="number"
              value={formData.coefficient}
              onChange={(e) => setFormData({...formData, coefficient: parseInt(e.target.value)})}
              className="input-field"
              min="1"
              max="10"
              required
            />
          </div>
          <div className="md:col-span-2 form-group"> {/* Ajout de form-group */}
            <label className="form-label">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="input-field"
              rows="3"
              placeholder="Description de la matière..."
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Matières</h1>
          <p className="text-gray-600">Gérez les matières enseignées</p>
        </div>
        <button
          onClick={() => ouvrirModal('ajouter')}
          className="btn-primary flex items-center shadow-md hover:shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Matière
        </button>
      </div>

      {/* Recherche */}
      <div className="card p-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher une matière par nom ou code..."
            value={rechercheTexte}
            onChange={(e) => setRechercheTexte(e.target.value)}
            className="pl-10 input-field"
          />
        </div>
      </div>

      {/* Grille des matières */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matieresFiltrees.map(matiere => (
            <div key={matiere.id} className="card p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-fleuve-100 flex items-center justify-center shadow-inner"> {/* Couleur fleuve */}
                      <Book className="h-5 w-5 text-fleuve-600" />
                    </div>
                    <div className="ml-4">
                      <div className="block">
                           <p className="text-lg font-semibold text-gray-900">
                            {matiere.nom}
                          </p>
                          <p className="text-sm text-gray-600">
                            {matiere.code}
                          </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 rounded-full text-soleil-600 hover:bg-soleil-50 hover:text-soleil-800 transition-colors duration-200"
                      onClick={() => ouvrirModal('modifier', matiere)}
                      title="Modifier la matière"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 rounded-full text-terre-600 hover:bg-terre-50 hover:text-terre-800 transition-colors duration-200" 
                      title="Supprimer la matière"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button 
                    className="btn btn-outline w-full hover:bg-gray-50 hover:shadow-sm" 
                    onClick={() => ouvrirModal('voir', matiere)}
                  >
                    Voir les détails
                  </button>
                </div>
            </div>
          ))}
      </div>

      {matieresFiltrees.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune matière trouvée</p>
          <p className="text-gray-400 text-sm mt-2">Ajoutez de nouvelles matières pour commencer.</p>
        </div>
      )}

      {/* Modal */}
      {modalOuverte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {typeModal === 'ajouter' && 'Ajouter une matière'}
                  {typeModal === 'modifier' && 'Modifier la matière'}
                  {typeModal === 'voir' && 'Détails de la matière'}
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
                    <BookOpen className="h-12 w-12 text-fleuve-600 mx-auto mb-4" /> {/* Couleur fleuve */}
                    <h4 className="text-2xl font-bold text-gray-900">{matiereSelectionnee?.nom}</h4>
                    <p className="text-gray-600 text-lg">{matiereSelectionnee?.code}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Coefficient</p>
                      <p className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                        <Hash className="h-6 w-6 mr-2 text-soleil-600" /> {/* Couleur soleil */}
                        {matiereSelectionnee?.coefficient}
                      </p>
                    </div>
                    <div className="bg-soleil-50 p-3 rounded-lg border border-soleil-200"> {/* Couleur soleil pour le second bloc */}
                      <p className="text-sm font-medium text-soleil-900">Type</p>
                      <p className="text-lg text-soleil-800 font-semibold">Matière Principale</p>
                    </div>
                  </div>
                  {matiereSelectionnee?.description && (
                    <div className="bg-acacia-50 p-4 rounded-lg border border-acacia-200 shadow-sm"> {/* Couleur acacia */}
                      <p className="text-sm font-medium text-acacia-900">Description</p>
                      <p className="text-acacia-800 mt-1">{matiereSelectionnee.description}</p>
                    </div>
                  )}
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => ouvrirModal('modifier', matiereSelectionnee)}
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
                <FormulaireMatiere />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatieresPage;