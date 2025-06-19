import { Edit, Eye, Mail, Phone, Search, Trash2, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/MonContext";

export default function EnseignantPage() {
  const { donnees } = useAuth();
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [filtreMatiere, setFiltreMatiere] = useState('');
  const [enseignantSelectionne, setEnseignantSelectionne] = useState(null);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [typeModal, setTypeModal] = useState('');

  const enseignants = donnees?.enseignants || [];
  const matieres = donnees?.matieres || [];
  const classes = donnees?.classes || [];

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

  // Composant pour afficher les informations dans la modal de visualisation
  const Info = ({ label, value }) => (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
      <p className="text-gray-900">{value || 'Non renseigné'}</p>
    </div>
  );

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
      // Ici vous ajouteriez la logique pour sauvegarder
      fermerModal();
    };

    return (
      <form onSubmit={gererSoumission} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Prénom *</label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Nom *</label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Téléphone *</label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="77 123 45 67"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Matière *</label>
            <select
              value={formData.matiere}
              onChange={(e) => setFormData({ ...formData, matiere: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une matière</option>
              {matieres.map((matiere) => (
                <option key={matiere.id} value={matiere.nom}>{matiere.nom}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Date d'embauche *</label>
            <input
              type="date"
              value={formData.dateEmbauche}
              onChange={(e) => setFormData({ ...formData, dateEmbauche: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 space-x-3">
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
      {/* Barre de recherche et filtre */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row sm:space-x-4 gap-4 sm:gap-0">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un enseignant..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={rechercheTexte}
              onChange={(e) => setRechercheTexte(e.target.value)}
            />
          </div>
          <select
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filtreMatiere}
            onChange={(e) => setFiltreMatiere(e.target.value)}
          >
            <option value="">Toutes les matières</option>
            {matieres.map((matiere) => (
              <option key={matiere.id} value={matiere.nom}>
                {matiere.nom}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          onClick={() => ouvrirModal('ajouter')}
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Ajouter un enseignant
        </button>
      </div>

      {/* Tableau des enseignants */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Enseignant</th>
                <th className="table-header-cell">Contact</th>
                <th className="table-header-cell">Matière</th>
                <th className="table-header-cell">Classes</th>
                <th className="table-header-cell">Date d'embauche</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {enseignantsFiltres.map((enseignant) => (
                <tr key={enseignant.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {enseignant.prenom?.[0]}{enseignant.nom?.[0]}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {enseignant.prenom} {enseignant.nom}
                        </div>
                        <div className="text-sm text-gray-500">
                          Enseignant
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {enseignant.telephone}
                    </div>
                    <div className="text-sm flex items-center mt-1">
                      <Mail className="h-4 w-4 mr-1" />
                      {enseignant.email}
                    </div>
                  </td>
                  <td className="table-cell ">
                    <span className="px-2 py-1 text-xs font-medium bg-fleuve-100 text-fleuve-700 rounded">{enseignant.matiere}</span>
                  </td>
                  <td className="table-cell text-sm text-gray-900">
                    {enseignant.classes?.join(', ') || 'Aucune'}
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">
                      {enseignant.dateEmbauche ? new Date(enseignant.dateEmbauche).toLocaleDateString('fr-FR') : 'Non renseigné'}
                    </div>
                  </td>
                  <td className="table-cell text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="p-2 text-gray-500 hover:text-blue-600 border border-gray-300 rounded hover:bg-blue-50"
                        onClick={() => ouvrirModal('voir', enseignant)}
                      >
                        <Eye className="h-4 w-4 text-blue-400" />
                      </button>
                      <button 
                        className="p-2 text-gray-500 hover:text-green-600 border border-gray-300 rounded hover:bg-green-50"
                        onClick={() => ouvrirModal('modifier', enseignant)}
                      >
                        <Edit className="h-4 w-4 text-yellow-600" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-600 border border-gray-300 rounded hover:bg-red-50">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOuverte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {typeModal === 'ajouter' && 'Ajouter un enseignant'}
                  {typeModal === 'modifier' && "Modifier l'enseignant"}
                  {typeModal === 'voir' && "Détails de l'enseignant"}
                </h3>
                <button onClick={fermerModal} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Corps */}
              {typeModal === 'voir' ? (
                <div className="space-y-6">
                  {/* Avatar + Nom */}
            <div className="flex flex-col items-center space-y-3">
              <img
                src={
                  enseignantSelectionne?.photo ||
                  "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150"
                }
                alt={`${enseignantSelectionne?.prenom} ${enseignantSelectionne?.nom}`}
                className="h-24 w-24 rounded-full object-cover border-4 border-fleuve-200"
              />
              <div className="text-center">
                <h4 className="text-xl font-bold text-gray-800">
                  {enseignantSelectionne?.prenom} {enseignantSelectionne?.nom}
                </h4>
                <p className="text-sm text-gray-500">
                  Enseignat
                </p>
              </div>
            </div>

                  {/* Infos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Info label="Email" value={enseignantSelectionne?.email} />
                    <Info label="Téléphone" value={enseignantSelectionne?.telephone} />
                    <Info label="Matière" value={enseignantSelectionne?.matiere} />
                    <Info label="Classes" value={enseignantSelectionne?.classes?.join(', ')} />
                    <Info 
                      label="Date d'embauche" 
                      value={enseignantSelectionne?.dateEmbauche ? 
                        new Date(enseignantSelectionne.dateEmbauche).toLocaleDateString("fr-FR") : 
                        'Non renseigné'
                      } 
                    />
                    <Info label="Statut" value={enseignantSelectionne?.statut} />
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
}