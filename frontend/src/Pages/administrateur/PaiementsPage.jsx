import {
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  Eye,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/MonContext";

const PaiementsPage = () => {
  const { donnees } = useAuth();
  const [rechercheTexte, setRechercheTexte] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");
  const [filtreType, setFiltreType] = useState("");
  const [paiementSelectionne, setPaiementSelectionne] = useState(null);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [typeModal, setTypeModal] = useState("");

  const paiements = donnees.paiements || [];
  const eleves = donnees.eleves || [];

  const paiementsFiltres = paiements.filter((paiement) => {
    const eleve = eleves.find((e) => e.id === paiement.eleveId);
    const correspondRecherche = eleve
      ? `${eleve.prenom} ${eleve.nom}`
          .toLowerCase()
          .includes(rechercheTexte.toLowerCase()) ||
        paiement.numeroRecu.toLowerCase().includes(rechercheTexte.toLowerCase())
      : false;
    const correspondStatut = !filtreStatut || paiement.statut === filtreStatut;
    const correspondType = !filtreType || paiement.typePaiement === filtreType;

    return correspondRecherche && correspondStatut && correspondType;
  });

  const calculerStatistiques = () => {
    const total = paiements.reduce((sum, p) => sum + p.montant, 0);
    const paye = paiements
      .filter((p) => p.statut === "payé")
      .reduce((sum, p) => sum + p.montant, 0);
    const enAttente = paiements
      .filter((p) => p.statut === "en_attente")
      .reduce((sum, p) => sum + p.montant, 0);

    return { total, paye, enAttente };
  };

  const stats = calculerStatistiques();

  const ouvrirModal = (type, paiement = null) => {
    setTypeModal(type);
    setPaiementSelectionne(paiement);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setPaiementSelectionne(null);
    setTypeModal("");
  };

  const FormulairePaiement = () => {
    const [formData, setFormData] = useState(
      paiementSelectionne || {
        eleveId: "",
        montant: "",
        typePaiement: "Scolarité",
        methode: "Espèces",
        datePayment: new Date().toISOString().split("T")[0],
        statut: "payé",
      }
    );

    const gererSoumission = (e) => {
      e.preventDefault();
      console.log("Données paiement:", formData);
      fermerModal();
      // Ici, vous ajouteriez la logique pour enregistrer ou modifier le paiement
    };

    return (
      <form onSubmit={gererSoumission} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Élève *</label>
            <select
              value={formData.eleveId}
              onChange={(e) =>
                setFormData({ ...formData, eleveId: e.target.value })
              }
              className="input-field"
              required
            >
              <option value="">Sélectionner un élève</option>
              {eleves.map((eleve) => (
                <option key={eleve.id} value={eleve.id}>
                  {eleve.prenom} {eleve.nom} - {eleve.classe}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Montant (FCFA) *</label>
            <input
              type="number"
              value={formData.montant}
              onChange={(e) =>
                setFormData({ ...formData, montant: parseInt(e.target.value) })
              }
              className="input-field"
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Type de paiement *</label>
            <select
              value={formData.typePaiement}
              onChange={(e) =>
                setFormData({ ...formData, typePaiement: e.target.value })
              }
              className="input-field"
              required
            >
              <option value="Scolarité">Scolarité</option>
              <option value="Inscription">Inscription</option>
              <option value="Cantine">Cantine</option>
              <option value="Transport">Transport</option>
              <option value="Activités">Activités</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Méthode de paiement *</label>
            <select
              value={formData.methode}
              onChange={(e) =>
                setFormData({ ...formData, methode: e.target.value })
              }
              className="input-field"
              required
            >
              <option value="Espèces">Espèces</option>
              <option value="Orange Money">Orange Money</option>
              <option value="Wave">Wave</option>
              <option value="Virement">Virement</option>
              <option value="Chèque">Chèque</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date de paiement *</label>
            <input
              type="date"
              value={formData.datePayment}
              onChange={(e) =>
                setFormData({ ...formData, datePayment: e.target.value })
              }
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Statut *</label>
            <select
              value={formData.statut}
              onChange={(e) =>
                setFormData({ ...formData, statut: e.target.value })
              }
              className="input-field"
              required
            >
              <option value="payé">Payé</option>
              <option value="en_attente">En attente</option>
              <option value="annulé">Annulé</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={fermerModal} className="btn-secondary">
            Annuler
          </button>
          <button type="submit" className="btn-primary">
            {typeModal === "ajouter" ? "Enregistrer" : "Modifier"}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des Paiements
          </h1>
          <p className="text-gray-600">Suivez les paiements des élèves</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center shadow-sm hover:shadow-md">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <button
            onClick={() => ouvrirModal("ajouter")}
            className="btn-primary flex items-center shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Paiement
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-acacia-50 border border-acacia-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-acacia-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-acacia-900">
                {stats.paye.toLocaleString()} FCFA
              </p>
              <p className="text-sm text-acacia-700">Montant collecté</p>
            </div>
          </div>
        </div>
        <div className="card bg-soleil-50 border border-soleil-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-soleil-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-soleil-900">
                {stats.enAttente.toLocaleString()} FCFA
              </p>
              <p className="text-sm text-soleil-700">En attente</p>
            </div>
          </div>
        </div>
        <div className="card bg-fleuve-50 border border-fleuve-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-fleuve-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-fleuve-900">
                {stats.total.toLocaleString()} FCFA
              </p>
              <p className="text-sm text-fleuve-700">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="card p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <div className="form-group">
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="input-field"
            >
              <option value="">Tous les statuts</option>
              <option value="payé">Payé</option>
              <option value="en_attente">En attente</option>
              <option value="annulé">Annulé</option>
            </select>
          </div>
          <div className="form-group">
            <select
              value={filtreType}
              onChange={(e) => setFiltreType(e.target.value)}
              className="input-field"
            >
              <option value="">Tous les types</option>
              <option value="Scolarité">Scolarité</option>
              <option value="Inscription">Inscription</option>
              <option value="Cantine">Cantine</option>
              <option value="Transport">Transport</option>
            </select>
          </div>
          <div></div>
        </div>
      </div>

      {/* Tableau des paiements */}
      <div className="card table-container p-0">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Élève</th>
              <th className="table-header-cell">Montant</th>
              <th className="table-header-cell">Type</th>
              <th className="table-header-cell">Méthode</th>
              <th className="table-header-cell">Date</th>
              <th className="table-header-cell">Statut</th>
              <th className="table-header-cell">Reçu</th>
              <th className="table-header-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {paiementsFiltres.map((paiement) => {
              const eleve = eleves.find((e) => e.id === paiement.eleveId);

              return (
                <tr key={paiement.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <img
                        src={
                          eleve?.photo ||
                          "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"
                        }
                        alt={`${eleve?.prenom} ${eleve?.nom}`}
                        className="h-8 w-8 rounded-full object-cover shadow-sm"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {eleve?.prenom} {eleve?.nom}
                        </div>
                        <div className="text-sm text-gray-500">
                          {eleve?.classe}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm font-medium text-gray-900">
                      {paiement.montant.toLocaleString()} FCFA
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-fleuve-100 text-fleuve-800 border border-fleuve-200">
                      {paiement.typePaiement}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                      {paiement.methode}
                    </div>
                  </td>
                  <td className="table-cell">
                    {new Date(paiement.datePayment).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="table-cell">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                        paiement.statut === "payé"
                          ? "bg-acacia-100 text-acacia-800 border-acacia-200"
                          : paiement.statut === "en_attente"
                          ? "bg-soleil-100 text-soleil-800 border-soleil-200"
                          : "bg-terre-100 text-terre-800 border-terre-200"
                      }`}
                    >
                      {paiement.statut === "payé"
                        ? "Payé"
                        : paiement.statut === "en_attente"
                        ? "En attente"
                        : "Annulé"}
                    </span>
                  </td>
                  <td className="table-cell">{paiement.numeroRecu}</td>
                  <td className="table-cell text-right font-medium">
                    <button
                      onClick={() => ouvrirModal("voir", paiement)}
                      className="p-2 rounded-full text-fleuve-600 hover:bg-fleuve-50 hover:text-fleuve-800 transition-colors duration-200"
                      title="Voir les détails"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 rounded-full text-acacia-600 hover:bg-acacia-50 hover:text-acacia-800 transition-colors duration-200 ml-2"
                      title="Télécharger le reçu"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    {/* Optionnel: bouton de modification, nécessite l'icône Edit */}
                    {/* <button
                        onClick={() => ouvrirModal('modifier', paiement)}
                        className="p-2 rounded-full text-soleil-600 hover:bg-soleil-50 hover:text-soleil-800 transition-colors duration-200 ml-2"
                        title="Modifier le paiement"
                      >
                        <Edit className="h-4 w-4" />
                      </button> */}
                    {/* Optionnel: bouton de suppression, nécessite l'icône Trash2 */}
                    {/* <button
                        className="p-2 rounded-full text-terre-600 hover:bg-terre-50 hover:text-terre-800 transition-colors duration-200 ml-2"
                        title="Supprimer le paiement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button> */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {paiementsFiltres.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun paiement trouvé</p>
          <p className="text-gray-400 text-sm mt-2">
            Essayez d'ajuster vos filtres ou d'ajouter un nouveau paiement.
          </p>
        </div>
      )}

      {/* Modal */}
      {modalOuverte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {typeModal === "ajouter" && "Nouveau paiement"}
                  {typeModal === "modifier" && "Modifier le paiement"}
                  {typeModal === "voir" && "Détails du paiement"}
                </h3>
                <button
                  onClick={fermerModal}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title="Fermer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {typeModal === "voir" ? (
                <div className="space-y-4 fade-in">
                  {/* Contenu de visualisation du paiement */}
                  <div className="text-center">
                    <div className="bg-acacia-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 shadow-inner">
                      <DollarSign className="h-8 w-8 text-acacia-600 mx-auto" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900">
                      {paiementSelectionne?.montant.toLocaleString()} FCFA
                    </h4>
                    <p className="text-gray-600">
                      {paiementSelectionne?.typePaiement}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Élève</p>
                      <p className="text-sm text-gray-900">
                        {
                          eleves.find(
                            (e) => e.id === paiementSelectionne?.eleveId
                          )?.prenom
                        }{" "}
                        {
                          eleves.find(
                            (e) => e.id === paiementSelectionne?.eleveId
                          )?.nom
                        }
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">
                        Méthode
                      </p>
                      <p className="text-sm text-gray-900">
                        {paiementSelectionne?.methode}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Date</p>
                      <p className="text-sm text-gray-900">
                        {new Date(
                          paiementSelectionne?.datePayment
                        ).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">
                        N° Reçu
                      </p>
                      <p className="text-sm text-gray-900">
                        {paiementSelectionne?.numeroRecu}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => {
                        setTypeModal("modifier");
                      }}
                      className="btn-primary flex items-center shadow-sm hover:shadow-md"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </button>
                    {/* Vous pouvez ajouter un bouton de suppression ici si nécessaire */}
                    {/* <button className="btn-secondary text-terre-600 hover:bg-terre-50 flex items-center ml-3 shadow-sm hover:shadow-md">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                    </button> */}
                  </div>
                </div>
              ) : (
                <FormulairePaiement />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaiementsPage;
