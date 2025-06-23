import {
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  Info // Pour icône d'info dans le modal
  ,

  Search,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext';

const HistoriquePaiementsParents = () => {
  const { utilisateur, donnees } = useAuth();
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [filtreType, setFiltreType] = useState('');
  const [filtrePeriode, setFiltrePeriode] = useState('');
  const [filtreEnfant, setFiltreEnfant] = useState(''); // Nouveau filtre par enfant

  const [modalOuverte, setModalOuverte] = useState(false);
  const [paiementSelectionne, setPaiementSelectionne] = useState(null);

  // Les paiements sont déjà filtrés pour les enfants du parent via obtenirDonneesParRole
  const paiementsDesEnfants = donnees.paiements || [];
  const mesEnfants = donnees.eleves || []; // Liste des objets enfants du parent

  const paiementsFiltres = paiementsDesEnfants.filter(paiement => {
    const enfant = mesEnfants.find(e => e.id === paiement.eleveId); // Trouver l'enfant pour la recherche
    const correspondRecherche = enfant ?
      `${enfant.prenom} ${enfant.nom}`.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
      paiement.numeroRecu?.toLowerCase().includes(rechercheTexte.toLowerCase()) : false;

    const correspondType = !filtreType || paiement.typePaiement === filtreType;
    const correspondEnfant = !filtreEnfant || (enfant && enfant.id.toString() === filtreEnfant);

    let correspondPeriode = true;
    if (filtrePeriode) {
      const datePaiement = new Date(paiement.datePayment);
      const maintenant = new Date();
      
      switch (filtrePeriode) {
        case 'semaine':
          const debutSemaine = new Date(maintenant);
          debutSemaine.setDate(maintenant.getDate() - 7);
          correspondPeriode = datePaiement >= debutSemaine;
          break;
        case 'mois':
          correspondPeriode = datePaiement.getMonth() === maintenant.getMonth() &&
                             datePaiement.getFullYear() === maintenant.getFullYear();
          break;
        case 'trimestre':
          const trimestreActuel = Math.floor(maintenant.getMonth() / 3);
          const trimestrePaiement = Math.floor(datePaiement.getMonth() / 3);
          correspondPeriode = trimestrePaiement === trimestreActuel &&
                             datePaiement.getFullYear() === maintenant.getFullYear();
          break;
        case 'annee':
          correspondPeriode = datePaiement.getFullYear() === maintenant.getFullYear();
          break;
      }
    }
    return correspondRecherche && correspondType && correspondEnfant && correspondPeriode;
  });

  const typesPaiementUniques = [...new Set(paiementsDesEnfants.map(p => p.typePaiement))].sort();

  const ouvrirModalDetails = (paiement) => {
    setPaiementSelectionne(paiement);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setPaiementSelectionne(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historique des Paiements de mes Enfants</h1>
          <p className="text-gray-600">Consultez tous les paiements effectués pour vos enfants</p>
        </div>
        <button className="btn-secondary flex items-center justify-center shadow-sm hover:shadow-md py-2.5 px-4">
          <Download className="h-4 w-4 mr-2" />
          Télécharger relevé
        </button>
      </div>

      {/* Filtres */}
      <div className="card p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div className="relative form-group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher par enfant ou N° reçu..."
              value={rechercheTexte}
              onChange={(e) => setRechercheTexte(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          <div className="form-group">
            <select
              value={filtreEnfant}
              onChange={(e) => setFiltreEnfant(e.target.value)}
              className="input-field"
            >
              <option value="">Tous les enfants</option>
              {mesEnfants.map(enfant => (
                <option key={enfant.id} value={enfant.id}>{enfant.prenom} {enfant.nom}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <select
              value={filtreType}
              onChange={(e) => setFiltreType(e.target.value)}
              className="input-field"
            >
              <option value="">Tous les types</option>
              {typesPaiementUniques.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <select
              value={filtrePeriode}
              onChange={(e) => setFiltrePeriode(e.target.value)}
              className="input-field"
            >
              <option value="">Toutes les périodes</option>
              <option value="semaine">Cette semaine</option>
              <option value="mois">Ce mois</option>
              <option value="trimestre">Ce trimestre</option>
              <option value="annee">Cette année</option>
            </select>
          </div>
          <div className="form-group">
            <button className="w-full btn-secondary flex items-center justify-center shadow-sm hover:shadow-md h-[42px]">
              <Filter className="h-4 w-4 mr-2" />
              Plus de filtres
            </button>
          </div>
        </div>
      </div>

      {/* Liste des paiements */}
      <div className="card table-container p-0">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Enfant</th>
              <th className="table-header-cell">N° Reçu</th>
              <th className="table-header-cell">Montant</th>
              <th className="table-header-cell">Type</th>
              <th className="table-header-cell">Méthode</th>
              <th className="table-header-cell">Date</th>
              <th className="table-header-cell">Statut</th>
              <th className="table-header-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {paiementsFiltres.length > 0 ? (
              paiementsFiltres.map((paiement) => {
                const enfant = mesEnfants.find(e => e.id === paiement.eleveId);
                return (
                  <tr key={paiement.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <img
                          src={enfant?.photo || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                          alt={`${enfant?.prenom} ${enfant?.nom}`}
                          className="h-8 w-8 rounded-full object-cover shadow-sm"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{enfant?.prenom} {enfant?.nom}</div>
                          <div className="text-xs text-gray-500">{enfant?.classe}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell font-medium text-gray-900">{paiement.numeroRecu}</td>
                    <td className="table-cell font-bold text-gray-900">{paiement.montant.toLocaleString()} FCFA</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                        paiement.typePaiement === 'Scolarité' ? 'bg-fleuve-100 text-fleuve-800 border-fleuve-200' :
                        paiement.typePaiement === 'Inscription' ? 'bg-soleil-100 text-soleil-800 border-soleil-200' :
                        'bg-acacia-100 text-acacia-800 border-acacia-200'
                      }`}>
                        {paiement.typePaiement}
                      </span>
                    </td>
                    <td className="table-cell flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-gray-500" />{paiement.methode}
                    </td>
                    <td className="table-cell">{new Date(paiement.datePayment).toLocaleDateString('fr-FR')}</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                        paiement.statut === 'payé' ? 'bg-acacia-100 text-acacia-800 border-acacia-200' :
                        paiement.statut === 'en_attente' ? 'bg-soleil-100 text-soleil-800 border-soleil-200' :
                        'bg-terre-100 text-terre-800 border-terre-200'
                      }`}>
                        {paiement.statut === 'payé' ? 'Payé' :
                         paiement.statut === 'en_attente' ? 'En attente' : 'Annulé'}
                      </span>
                    </td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => ouvrirModalDetails(paiement)}
                        className="p-2 rounded-full text-fleuve-600 hover:bg-fleuve-50 hover:text-fleuve-800 transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => console.log('Télécharger relevé pour:', paiement.id)}
                        className="p-2 rounded-full text-acacia-600 hover:bg-acacia-50 hover:text-acacia-800 transition-colors ml-2"
                        title="Télécharger le reçu"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="text-center">
                <td colSpan="8" className="py-12 text-gray-500">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  Aucun paiement trouvé pour cette sélection.
                  <p className="text-gray-400 text-sm mt-2">
                    Veuillez ajuster vos filtres ou vérifier les paiements de vos enfants.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Détails du Paiement */}
      {modalOuverte && paiementSelectionne && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-fleuve-600" />
                  Détails du paiement - {paiementSelectionne.numeroRecu}
                </h3>
                <button
                  onClick={fermerModal}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Fermer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Informations de l'enfant */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
                  <p className="text-sm font-medium text-gray-700">Enfant concerné</p>
                  <div className="flex items-center mt-1">
                    <img
                      src={mesEnfants.find(e => e.id === paiementSelectionne.eleveId)?.photo || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                      alt="Enfant"
                      className="h-10 w-10 rounded-full object-cover mr-3 shadow-sm"
                    />
                    <div>
                      <p className="text-base font-bold text-gray-900">
                        {mesEnfants.find(e => e.id === paiementSelectionne.eleveId)?.prenom} {mesEnfants.find(e => e.id === paiementSelectionne.eleveId)?.nom}
                      </p>
                      <p className="text-sm text-gray-600">
                        Classe: {mesEnfants.find(e => e.id === paiementSelectionne.eleveId)?.classe}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Montant et Statut */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-acacia-50 p-4 rounded-lg border border-acacia-200 shadow-sm text-center">
                        <DollarSign className="h-10 w-10 text-acacia-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-acacia-900">Montant payé</p>
                        <p className="text-3xl font-bold text-acacia-800">{paiementSelectionne.montant.toLocaleString()} FCFA</p>
                    </div>
                    <div className="bg-soleil-50 p-4 rounded-lg border border-soleil-200 shadow-sm text-center">
                        <Info className="h-10 w-10 text-soleil-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-soleil-900">Statut</p>
                        <span className={`inline-flex px-3 py-1 text-base font-semibold rounded-full mt-1 ${
                          paiementSelectionne.statut === 'payé' ? 'bg-acacia-100 text-acacia-800 border-acacia-200' :
                          paiementSelectionne.statut === 'en_attente' ? 'bg-soleil-100 text-soleil-800 border-soleil-200' :
                          'bg-terre-100 text-terre-800 border-terre-200'
                        }`}>
                          {paiementSelectionne.statut === 'payé' ? 'Payé' :
                           paiementSelectionne.statut === 'en_attente' ? 'En attente' : 'Annulé'}
                        </span>
                    </div>
                </div>

                {/* Détails supplémentaires */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700">Type de paiement</p>
                    <p className="text-base text-gray-900 font-semibold flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-fleuve-600" />
                        {paiementSelectionne.typePaiement}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700">Méthode de paiement</p>
                    <p className="text-base text-gray-900 font-semibold flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-soleil-600" />
                        {paiementSelectionne.methode}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700">Date du paiement</p>
                    <p className="text-base text-gray-900 font-semibold flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-acacia-600" />
                        {new Date(paiementSelectionne.datePayment).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700">N° de reçu</p>
                    <p className="text-base text-gray-900 font-semibold">{paiementSelectionne.numeroRecu}</p>
                  </div>
                </div>

                {paiementSelectionne.commentaire && (
                  <div className="bg-terre-50 p-4 rounded-lg border border-terre-200 shadow-sm">
                    <p className="text-sm font-medium text-terre-900 flex items-center mb-1">
                      <Info className="h-4 w-4 mr-2 text-terre-600" /> Commentaire
                    </p>
                    <p className="text-sm text-terre-800 mt-1">{paiementSelectionne.commentaire}</p>
                  </div>
                )}

                {/* Boutons d'action */}
                <div className="flex justify-center space-x-3 pt-4 border-t border-gray-200 mt-6">
                  <button
                    onClick={() => console.log('Télécharger reçu pour parent:', paiementSelectionne.id)}
                    className="btn-primary flex items-center justify-center shadow-md hover:shadow-lg"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le reçu
                  </button>
                  {/* Plus d'actions comme imprimer si nécessaire */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoriquePaiementsParents;