import { Edit, Eye, Search, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/MonContext";

export default function ElevesPage() {
  const { donnees } = useAuth();
  const [rechercheTexte, setRechercheTexte] = useState("");
  const [filtreClasse, setFiltreClasse] = useState("");
  const [eleveSelectionne, setEleveSelectionne] = useState(null);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [typeModal, setTypeModal] = useState(""); // 'ajouter', 'modifier', 'voir'

  const eleves = donnees?.eleves || [];
  const classes = donnees?.classes || [];

  const elevesFiltres = eleves.filter((eleve) => {
    const correspondRecherche =
      `${eleve.prenom} ${eleve.nom} ${eleve.numeroMatricule}`
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
        <NavLink to="./ajouter">
          <button className="btn btn-primary">
            <UserPlus className="h-5 w-5 mr-2" />
            Ajouter un élève
          </button>
        </NavLink>
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
                      <button className="btn btn-outline p-2">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="btn btn-outline p-2">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="btn btn-outline p-2 text-terre-600 hover:text-terre-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
