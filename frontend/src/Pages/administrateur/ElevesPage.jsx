import { Edit, Eye, Search, Trash2, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/MonContext";

export default function ElevesPage() {
   const { donnees } = useAuth();
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [filtreClasse, setFiltreClasse] = useState('');
  const [eleveSelectionne, setEleveSelectionne] = useState(null);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [typeModal, setTypeModal] = useState(''); // 'ajouter', 'modifier', 'voir'

  const eleves = donnees.eleves || [];
  const classes = donnees.classes || [];

  const elevesFiltres = eleves.filter(eleve => {
    const correspondRecherche = `${eleve.prenom} ${eleve.nom} ${eleve.numeroMatricule}`
      .toLowerCase()
      .includes(rechercheTexte.toLowerCase());
    const correspondClasse = !filtreClasse || eleve.classe === filtreClasse;
    return correspondRecherche && correspondClasse;
  });

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
      // Ici, dans un vrai projet, on sauvegarderait les données
      console.log('Données élève:', formData);
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
        className="input-field"
        required
      />
    </div>
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">Nom *</label>
      <input
        type="text"
        value={formData.nom}
        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
        className="input-field"
        required
      />
    </div>
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">Sexe *</label>
      <select
        value={formData.sexe}
        onChange={(e) => setFormData({ ...formData, sexe: e.target.value })}
        className="input-field"
        required
      >
        <option value="">Sélectionner</option>
        <option value="M">Masculin</option>
        <option value="F">Féminin</option>
      </select>
    </div>
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">Date de naissance *</label>
      <input
        type="date"
        value={formData.dateNaissance}
        onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
        className="input-field"
        required
      />
    </div>
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">Classe *</label>
      <select
        value={formData.classe}
        onChange={(e) => setFormData({ ...formData, classe: e.target.value })}
        className="input-field"
        required
      >
        <option value="">Sélectionner une classe</option>
        {classes.map((classe) => (
          <option key={classe.id} value={classe.nom}>{classe.nom}</option>
        ))}
      </select>
    </div>
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">N° Matricule</label>
      <input
        type="text"
        value={formData.numeroMatricule}
        onChange={(e) => setFormData({ ...formData, numeroMatricule: e.target.value })}
        className="input-field"
        placeholder="Auto-généré si vide"
      />
    </div>
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">Téléphone Parent *</label>
      <input
        type="tel"
        value={formData.telephoneParent}
        onChange={(e) => setFormData({ ...formData, telephoneParent: e.target.value })}
        className="input-field"
        placeholder="77 123 45 67"
        required
      />
    </div>
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">Email Parent</label>
      <input
        type="email"
        value={formData.emailParent}
        onChange={(e) => setFormData({ ...formData, emailParent: e.target.value })}
        className="input-field"
        placeholder="parent@email.sn"
      />
    </div>
  </div>

  <div className="flex justify-end pt-4 space-x-3">
    <button
      type="button"
      onClick={fermerModal}
      className="btn btn-secondary"
    >
      Annuler
    </button>
    <button
      type="submit"
      className="btn btn-primary"
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
              placeholder="Rechercher un élève..."
              className="input pl-10"
              value={rechercheTexte}
              onChange={(e) => setRechercheTexte(e.target.value)}
            />
          </div>
          <select
            className="input sm:w-auto"
            value={filtreClasse}
            onChange={(e) => setFiltreClasse(e.target.value)}
          >
            <option value="">Toutes les classes</option>
            {classes.map((classe) => (
              <option key={classe.id} value={classe.nom}>
                {classe.nom}
              </option>
            ))}
          </select>
        </div>
        
          <button className="btn btn-primary" onClick={() => ouvrirModal('ajouter')}>
            <UserPlus className="h-5 w-5 mr-2" />
            Ajouter un élève
          </button>
      </div>

      {/* Tableau des élèves */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Nom</th>
                <th className="table-header-cell">Classe</th>
                <th className="table-header-cell">Matriule</th>
                <th className="table-header-cell">Date de Naissance</th>
                <th className="table-header-cell">Parent</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {elevesFiltres.map((eleve) => (
                <tr key={eleve.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-fleuve-100 flex items-center justify-center text-fleuve-600 font-medium">
                        {eleve.prenom[0]}
                        {eleve.nom[0]}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {eleve.prenom} {eleve.nom}
                        </div>
                        <div className="text-sm text-gray-500">
                          {eleve.sexe === "M" ? "Garçon" : "Fille"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="px-2 py-1 text-xs font-medium bg-fleuve-100 text-fleuve-700 rounded">
                      {eleve.classe}
                    </span>
                  </td>
                  <td className="table-cell">{eleve.numeroMatricule}</td>
                  <td className="table-cell">
                    {new Date(eleve.dateNaissance).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">
                      {eleve.telephoneParent}
                    </div>
                    <div className="text-sm text-gray-500">
                      {eleve.emailParent}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button 
                        className="p-2 text-gray-500 hover:text-blue-600 border border-gray-300 rounded hover:bg-blue-50"
                        onClick={() => ouvrirModal('voir', eleve)}
                      >
                        <Eye className="h-4 w-4 text-blue-400" />
                      </button>
                      <button 
                        className="p-2 text-gray-500 hover:text-green-600 border border-gray-300 rounded hover:bg-green-50"
                        onClick={() => ouvrirModal('modifier', eleve)}
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
      {/*Modal pour visualiser les details */}
      {modalOuverte && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in border border-fleuve-100">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <h3 className="text-xl font-semibold text-fleuve-700">
                    {typeModal === 'ajouter' && 'Ajouter un élève'}
                    {typeModal === 'modifier' && "Modifier l'élève"}
                    {typeModal === 'voir' && "Détails de l'élève"}
                  </h3>
                  <button onClick={fermerModal} className="text-gray-400 hover:text-gray-600 transition">
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
                          eleveSelectionne?.photo ||
                          "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150"
                        }
                        alt={`${eleveSelectionne?.prenom} ${eleveSelectionne?.nom}`}
                        className="h-24 w-24 rounded-full object-cover border-4 border-fleuve-200"
                      />
                      <div className="text-center">
                        <h4 className="text-xl font-bold text-gray-800">
                          {eleveSelectionne?.prenom} {eleveSelectionne?.nom}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Matricule : {eleveSelectionne?.numeroMatricule}
                        </p>
                      </div>
                    </div>

                    {/* Infos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Info label="Classe" value={eleveSelectionne?.classe} />
                      <Info
                        label="Date de naissance"
                        value={new Date(eleveSelectionne?.dateNaissance).toLocaleDateString("fr-FR")}
                      />
                      <Info label="Téléphone du parent" value={eleveSelectionne?.telephoneParent} />
                      <Info label="Email du parent" value={eleveSelectionne?.emailParent} />
                    </div>
                  </div>
                ) : (
                  <FormulairEleve />
                )}
              </div>
            </div>
          </div>
)}

      
      
    </div>
  );
}

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <p className="text-sm text-gray-900">{value}</p>
  </div>
);
