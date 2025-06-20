import {
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Plus,
  Search,
  TrendingUp,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext';

const GestionPaiements = () => {
  const { donnees } = useAuth();
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('');
  const [filtreType, setFiltreType] = useState('');
  const [filtreClasse, setFiltreClasse] = useState('');
  const [paiementSelectionne, setPaiementSelectionne] = useState(null);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [typeModal, setTypeModal] = useState('');
  const [vueActive, setVueActive] = useState('liste'); // 'liste', 'statistiques', 'retards'

  const paiements = donnees.paiements || [];
  const eleves = donnees.eleves || [];
  const classes = donnees.classes || [];

  const paiementsFiltres = paiements.filter(paiement => {
    const eleve = eleves.find(e => e.id === paiement.eleveId);
    const correspondRecherche = eleve ? 
      `${eleve.prenom} ${eleve.nom}`.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
      paiement.numeroRecu.toLowerCase().includes(rechercheTexte.toLowerCase()) : false;
    const correspondStatut = !filtreStatut || paiement.statut === filtreStatut;
    const correspondType = !filtreType || paiement.typePaiement === filtreType;
    const correspondClasse = !filtreClasse || eleve?.classe === filtreClasse;
    
    return correspondRecherche && correspondStatut && correspondType && correspondClasse;
  });

  const calculerStatistiques = () => {
    const total = paiements.reduce((sum, p) => sum + p.montant, 0);
    const paye = paiements.filter(p => p.statut === 'payé').reduce((sum, p) => sum + p.montant, 0);
    const enAttente = paiements.filter(p => p.statut === 'en_attente').reduce((sum, p) => sum + p.montant, 0);
    const annule = paiements.filter(p => p.statut === 'annulé').reduce((sum, p) => sum + p.montant, 0);
    
    // Statistiques par type
    const parType = {};
    paiements.forEach(p => {
      if (!parType[p.typePaiement]) parType[p.typePaiement] = 0;
      if (p.statut === 'payé') parType[p.typePaiement] += p.montant;
    });

    // Statistiques par méthode
    const parMethode = {};
    paiements.filter(p => p.statut === 'payé').forEach(p => {
      if (!parMethode[p.methode]) parMethode[p.methode] = 0;
      parMethode[p.methode] += p.montant;
    });
    
    return { total, paye, enAttente, annule, parType, parMethode };
  };

  const stats = calculerStatistiques();

  const obtenirRetardsPaiement = () => {
    const maintenant = new Date();
    const retards = eleves.filter(eleve => {
      const dernierPaiement = paiements
        .filter(p => p.eleveId === eleve.id && p.statut === 'payé')
        .sort((a, b) => new Date(b.datePayment) - new Date(a.datePayment))[0];
      
      if (!dernierPaiement) return true; // Si aucun paiement, il est en retard
      
      const dateDernierPaiement = new Date(dernierPaiement.datePayment);
      const diffMois = (maintenant.getFullYear() - dateDernierPaiement.getFullYear()) * 12 + 
                      (maintenant.getMonth() - dateDernierPaiement.getMonth());
      
      return diffMois > 1; // Considérer en retard si plus d'un mois depuis le dernier paiement
    });
    
    return retards;
  };

  const retardsPaiement = obtenirRetardsPaiement();

  const ouvrirModal = (type, paiement = null) => {
    setTypeModal(type);
    setPaiementSelectionne(paiement);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setPaiementSelectionne(null);
    setTypeModal('');
  };

  const FormulairePaiement = () => {
    const [formData, setFormData] = useState(paiementSelectionne || {
      eleveId: '',
      montant: '',
      typePaiement: 'Scolarité',
      methode: 'Espèces',
      datePayment: new Date().toISOString().split('T')[0],
      statut: 'payé',
      numeroRecu: `RC${Date.now()}`, // Génération simple pour l'exemple
      commentaire: ''
    });

    const gererSoumission = (e) => {
      e.preventDefault();
      console.log('Données paiement:', formData);
      fermerModal();
    };

    return (
      <form onSubmit={gererSoumission} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">
              Élève *
            </label>
            <select
              value={formData.eleveId}
              onChange={(e) => setFormData({...formData, eleveId: e.target.value})}
              className="input-field"
              required
            >
              <option value="">Sélectionner un élève</option>
              {eleves.map(eleve => (
                <option key={eleve.id} value={eleve.id}>
                  {eleve.prenom} {eleve.nom} - {eleve.classe}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Montant (FCFA) *
            </label>
            <input
              type="number"
              value={formData.montant}
              onChange={(e) => setFormData({...formData, montant: parseInt(e.target.value)})}
              className="input-field"
              min="0"
              placeholder="50000"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Type de paiement *
            </label>
            <select
              value={formData.typePaiement}
              onChange={(e) => setFormData({...formData, typePaiement: e.target.value})}
              className="input-field"
              required
            >
              <option value="Scolarité">Scolarité</option>
              <option value="Inscription">Inscription</option>
              <option value="Cantine">Cantine</option>
              <option value="Transport">Transport</option>
              <option value="Activités">Activités extrascolaires</option>
              <option value="Uniforme">Uniforme</option>
              <option value="Fournitures">Fournitures scolaires</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Méthode de paiement *
            </label>
            <select
              value={formData.methode}
              onChange={(e) => setFormData({...formData, methode: e.target.value})}
              className="input-field"
              required
            >
              <option value="Espèces">Espèces</option>
              <option value="Orange Money">Orange Money</option>
              <option value="Wave">Wave</option>
              <option value="Free Money">Free Money</option>
              <option value="Virement bancaire">Virement bancaire</option>
              <option value="Chèque">Chèque</option>
              <option value="Carte bancaire">Carte bancaire</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Date de paiement *
            </label>
            <input
              type="date"
              value={formData.datePayment}
              onChange={(e) => setFormData({...formData, datePayment: e.target.value})}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Statut *
            </label>
            <select
              value={formData.statut}
              onChange={(e) => setFormData({...formData, statut: e.target.value})}
              className="input-field"
              required
            >
              <option value="payé">Payé</option>
              <option value="en_attente">En attente</option>
              <option value="annulé">Annulé</option>
            </select>
          </div>
          <div className="md:col-span-2 form-group">
            <label className="form-label">
              N° Reçu
            </label>
            <input
              type="text"
              value={formData.numeroRecu}
              onChange={(e) => setFormData({...formData, numeroRecu: e.target.value})}
              className="input-field"
              placeholder="Auto-généré"
            />
          </div>
          <div className="md:col-span-2 form-group">
            <label className="form-label">
              Commentaire
            </label>
            <textarea
              value={formData.commentaire}
              onChange={(e) => setFormData({...formData, commentaire: e.target.value})}
              className="input-field"
              rows="3"
              placeholder="Commentaire optionnel..."
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
          <button type="button" onClick={fermerModal} className="btn-secondary w-full sm:w-auto shadow-sm hover:shadow-md">
            Annuler
          </button>
          <button type="submit" className="btn-primary w-full sm:w-auto shadow-md hover:shadow-lg">
            {typeModal === 'ajouter' ? 'Enregistrer le paiement' : 'Modifier le paiement'}
          </button>
        </div>
      </form>
    );
  };

  const VueListe = () => (
    <div className="space-y-6">
      {/* Tableau responsive */}
      <div className="card overflow-hidden p-0">
        {/* Version desktop */}
        <div className="hidden lg:block table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">
                  Élève
                </th>
                <th className="table-header-cell">
                  Montant
                </th>
                <th className="table-header-cell">
                  Type
                </th>
                <th className="table-header-cell">
                  Méthode
                </th>
                <th className="table-header-cell">
                  Date
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
              {paiementsFiltres.map((paiement) => {
                const eleve = eleves.find(e => e.id === paiement.eleveId);
                
                return (
                  <tr key={paiement.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <img
                          src={eleve?.photo || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                          alt={`${eleve?.prenom} ${eleve?.nom}`}
                          className="h-10 w-10 rounded-full object-cover shadow-sm"
                        />
                        <div className="ml-4">
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
                      <div className="text-sm font-bold text-gray-900">
                        {paiement.montant.toLocaleString()} FCFA
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-fleuve-100 text-fleuve-800 border border-fleuve-200">
                        {paiement.typePaiement}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                        {paiement.methode}
                      </div>
                    </td>
                    <td className="table-cell">
                      {new Date(paiement.datePayment).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                        paiement.statut === 'payé' ? 'bg-acacia-100 text-acacia-800 border-acacia-200' :
                        paiement.statut === 'en_attente' ? 'bg-soleil-100 text-soleil-800 border-soleil-200' :
                        'bg-terre-100 text-terre-800 border-terre-200'
                      }`}>
                        {paiement.statut === 'payé' ? 'Payé' :
                         paiement.statut === 'en_attente' ? 'En attente' : 'Annulé'}
                      </span>
                    </td>
                    <td className="table-cell text-right font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => ouvrirModal('voir', paiement)}
                          className="p-2 rounded-full text-fleuve-600 hover:bg-fleuve-50 hover:text-fleuve-800 transition-colors"
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => ouvrirModal('modifier', paiement)}
                          className="p-2 rounded-full text-soleil-600 hover:bg-soleil-50 hover:text-soleil-800 transition-colors"
                          title="Modifier le paiement"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-full text-acacia-600 hover:bg-acacia-50 hover:text-acacia-800 transition-colors" title="Télécharger le reçu">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Version mobile/tablette */}
        <div className="lg:hidden p-4">
          <div className="space-y-4">
            {paiementsFiltres.map((paiement) => {
              const eleve = eleves.find(e => e.id === paiement.eleveId);
              
              return (
                <div key={paiement.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={eleve?.photo || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                        alt={`${eleve?.prenom} ${eleve?.nom}`}
                        className="h-12 w-12 rounded-full object-cover shadow-sm"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {eleve?.prenom} {eleve?.nom}
                        </div>
                        <div className="text-sm text-gray-500">{eleve?.classe}</div>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                      paiement.statut === 'payé' ? 'bg-acacia-100 text-acacia-800 border-acacia-200' :
                      paiement.statut === 'en_attente' ? 'bg-soleil-100 text-soleil-800 border-soleil-200' :
                      'bg-terre-100 text-terre-800 border-terre-200'
                    }`}>
                      {paiement.statut === 'payé' ? 'Payé' :
                       paiement.statut === 'en_attente' ? 'En attente' : 'Annulé'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Montant</div>
                      <div className="font-bold text-gray-900">{paiement.montant.toLocaleString()} FCFA</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Type</div>
                      <div className="text-sm text-gray-900">{paiement.typePaiement}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Méthode</div>
                      <div className="text-sm text-gray-900">{paiement.methode}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Date</div>
                      <div className="text-sm text-gray-900">{new Date(paiement.datePayment).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => ouvrirModal('voir', paiement)}
                      className="p-2 rounded-full text-fleuve-600 hover:bg-fleuve-50 hover:text-fleuve-800 transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => ouvrirModal('modifier', paiement)}
                      className="p-2 rounded-full text-soleil-600 hover:bg-soleil-50 hover:text-soleil-800 transition-colors"
                      title="Modifier le paiement"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-full text-acacia-600 hover:bg-acacia-50 hover:text-acacia-800 transition-colors" title="Télécharger le reçu">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {paiementsFiltres.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun paiement trouvé</p>
            <p className="text-gray-400 text-sm mt-2">Essayez d'ajuster vos filtres.</p>
          </div>
        )}
      </div>
    </div>
  );

  const VueStatistiques = () => (
    <div className="space-y-6">
      {/* Statistiques par type */}
      <div className="card p-6 shadow-md border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Revenus par type de paiement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stats.parType).length > 0 ? (
            Object.entries(stats.parType).map(([type, montant]) => (
              <div key={type} className="bg-fleuve-50 p-4 rounded-lg border border-fleuve-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-fleuve-900">{type}</p>
                    <p className="text-2xl font-bold text-fleuve-800">{montant.toLocaleString()} FCFA</p>
                  </div>
                  <div className="bg-fleuve-500 p-2 rounded-full shadow-md">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 col-span-full"> {/* col-span-full pour centrer en l'absence de données */}
              <p className="text-gray-500">Aucune donnée de revenu par type de paiement.</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistiques par méthode */}
      <div className="card p-6 shadow-md border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Répartition par méthode de paiement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(stats.parMethode).length > 0 ? (
            Object.entries(stats.parMethode).map(([methode, montant]) => (
              <div key={methode} className="bg-acacia-50 p-4 rounded-lg border border-acacia-200 shadow-sm">
                <div className="text-center">
                  <CreditCard className="h-8 w-8 text-acacia-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-acacia-900">{methode}</p>
                  <p className="text-xl font-bold text-acacia-800">{montant.toLocaleString()} FCFA</p>
                  <p className="text-xs text-acacia-600">
                    {((montant / stats.paye) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 col-span-full">
              <p className="text-gray-500">Aucune donnée de répartition par méthode de paiement.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const VueRetards = () => (
    <div className="space-y-6">
      <div className="card p-6 shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Élèves en retard de paiement</h3>
          <span className="bg-terre-100 text-terre-800 px-3 py-1 rounded-full text-sm font-medium border border-terre-200">
            {retardsPaiement.length} élèves
          </span>
        </div>
        
        {retardsPaiement.length > 0 ? (
          <>
            {/* Version desktop */}
            <div className="hidden md:block table-container">
              <table className="table">
                <thead className="table-header bg-terre-50">
                  <tr>
                    <th className="table-header-cell text-terre-700">
                      Élève
                    </th>
                    <th className="table-header-cell text-terre-700">
                      Classe
                    </th>
                    <th className="table-header-cell text-terre-700">
                      Dernier paiement
                    </th>
                    <th className="table-header-cell text-terre-700">
                      Contact parent
                    </th>
                    <th className="table-header-cell text-right text-terre-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {retardsPaiement.map((eleve) => {
                    const dernierPaiement = paiements
                      .filter(p => p.eleveId === eleve.id && p.statut === 'payé')
                      .sort((a, b) => new Date(b.datePayment) - new Date(a.datePayment))[0];
                    
                    return (
                      <tr key={eleve.id} className="table-row hover:bg-terre-50 transition-colors">
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
                                {eleve.numeroMatricule}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          {eleve.classe}
                        </td>
                        <td className="table-cell">
                          {dernierPaiement ? 
                            new Date(dernierPaiement.datePayment).toLocaleDateString('fr-FR') : 
                            <span className="text-terre-600 font-semibold">Aucun paiement</span>
                          }
                        </td>
                        <td className="table-cell">
                          <div className="text-sm text-gray-900">{eleve.telephoneParent}</div>
                          <div className="text-sm text-gray-500">{eleve.emailParent}</div>
                        </td>
                        <td className="table-cell text-right font-medium">
                          <button
                            onClick={() => ouvrirModal('ajouter', { eleveId: eleve.id })}
                            className="btn-primary flex items-center justify-center px-4 py-2 rounded-md text-xs shadow-md hover:shadow-lg"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Ajouter paiement
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Version mobile */}
            <div className="md:hidden space-y-4 p-4">
              {retardsPaiement.map((eleve) => {
                const dernierPaiement = paiements
                  .filter(p => p.eleveId === eleve.id && p.statut === 'payé')
                  .sort((a, b) => new Date(b.datePayment) - new Date(a.datePayment))[0];
                
                return (
                  <div key={eleve.id} className="bg-terre-50 border border-terre-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={eleve.photo || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                        alt={`${eleve.prenom} ${eleve.nom}`}
                        className="h-12 w-12 rounded-full object-cover shadow-sm"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {eleve.prenom} {eleve.nom}
                        </div>
                        <div className="text-sm text-gray-600">{eleve.classe}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 mb-4">
                      <div>
                        <span className="text-xs text-gray-600 uppercase">Dernier paiement:</span>
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {dernierPaiement ? 
                            new Date(dernierPaiement.datePayment).toLocaleDateString('fr-FR') : 
                            <span className="text-terre-600 font-semibold">Aucun paiement</span>
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600 uppercase">Contact parent:</span>
                        <span className="ml-2 text-sm font-medium text-gray-900">{eleve.telephoneParent}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => ouvrirModal('ajouter', { eleveId: eleve.id })}
                      className="btn-primary w-full flex items-center justify-center shadow-md hover:shadow-lg"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un paiement
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-acacia-400 mx-auto mb-4" />
            <p className="text-gray-500">Tous les élèves sont à jour dans leurs paiements</p>
            <p className="text-gray-400 text-sm mt-2">Félicitations pour la bonne gestion !</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Paiements</h1>
          <p className="text-gray-600">Suivez et gérez tous les paiements des élèves</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
          <button className="btn-secondary flex items-center justify-center shadow-sm hover:shadow-md">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <button
            onClick={() => ouvrirModal('ajouter')}
            className="btn-primary flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Paiement
          </button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-acacia-50 border border-acacia-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center">
            <CheckCircle className="h-10 w-10 text-acacia-600 mr-4" />
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
            <Clock className="h-10 w-10 text-soleil-600 mr-4" />
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
            <DollarSign className="h-10 w-10 text-fleuve-600 mr-4" />
            <div>
              <p className="text-2xl font-bold text-fleuve-900">
                {stats.total.toLocaleString()} FCFA
              </p>
              <p className="text-sm text-fleuve-700">Total</p>
            </div>
          </div>
        </div>
        <div className="card bg-terre-50 border border-terre-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-10 w-10 text-terre-600 mr-4" />
            <div>
              <p className="text-2xl font-bold text-terre-900">{retardsPaiement.length}</p>
              <p className="text-sm text-terre-700">Retards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="card p-1 shadow-sm">
        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setVueActive('liste')}
            className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
              vueActive === 'liste'
                ? 'bg-white text-fleuve-600 shadow-sm'
                : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Liste des paiements
          </button>
          <button
            onClick={() => setVueActive('statistiques')}
            className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
              vueActive === 'statistiques'
                ? 'bg-white text-fleuve-600 shadow-sm'
                : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Statistiques
          </button>
          <button
            onClick={() => setVueActive('retards')}
            className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
              vueActive === 'retards'
                ? 'bg-white text-fleuve-600 shadow-sm'
                : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Retards ({retardsPaiement.length})
          </button>
        </div>
      </div>

      {/* Filtres */}
      {vueActive === 'liste' && (
        <div className="card p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative form-group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher..."
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
                <option value="Activités">Activités</option>
              </select>
            </div>
            <div className="form-group">
              <select
                value={filtreClasse}
                onChange={(e) => setFiltreClasse(e.target.value)}
                className="input-field"
              >
                <option value="">Toutes les classes</option>
                {classes.map(classe => (
                  <option key={classe.id} value={classe.nom}>{classe.nom}</option>
                ))}
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
      )}

      {/* Contenu selon la vue active */}
      {vueActive === 'liste' && <VueListe />}
      {vueActive === 'statistiques' && <VueStatistiques />}
      {vueActive === 'retards' && <VueRetards />}

      {/* Modal */}
      {modalOuverte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in"> {/* Taille du modal ajustée à max-w-2xl */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-gray-900">
                  {typeModal === 'ajouter' && 'Nouveau paiement'}
                  {typeModal === 'modifier' && 'Modifier le paiement'}
                  {typeModal === 'voir' && 'Détails du paiement'}
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
                <div className="space-y-6 fade-in">
                  <div className="text-center bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
                    <div className="bg-acacia-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 shadow-md">
                      <DollarSign className="h-12 w-12 text-acacia-600 mx-auto" />
                    </div>
                    <h4 className="text-3xl font-bold text-gray-900">
                      {paiementSelectionne?.montant.toLocaleString()} FCFA
                    </h4>
                    <p className="text-gray-600 text-lg">{paiementSelectionne?.typePaiement}</p>
                    <span className={`inline-flex mt-2 px-3 py-1 text-sm font-semibold rounded-full border ${
                        paiementSelectionne?.statut === 'payé' ? 'bg-acacia-100 text-acacia-800 border-acacia-200' :
                        paiementSelectionne?.statut === 'en_attente' ? 'bg-soleil-100 text-soleil-800 border-soleil-200' :
                        'bg-terre-100 text-terre-800 border-terre-200'
                      }`}>
                      {paiementSelectionne?.statut === 'payé' ? 'Payé' :
                       paiementSelectionne?.statut === 'en_attente' ? 'En attente' : 'Annulé'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Élève</p>
                      <p className="text-lg text-gray-900 font-semibold">
                        {eleves.find(e => e.id === paiementSelectionne?.eleveId)?.prenom} {eleves.find(e => e.id === paiementSelectionne?.eleveId)?.nom}
                      </p>
                      <p className="text-sm text-gray-600">Classe: {eleves.find(e => e.id === paiementSelectionne?.eleveId)?.classe}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Méthode de paiement</p>
                      <p className="text-lg text-gray-900 font-semibold flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-fleuve-600" />
                        {paiementSelectionne?.methode}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Date de paiement</p>
                      <p className="text-lg text-gray-900 font-semibold">
                        {new Date(paiementSelectionne?.datePayment).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">N° de reçu</p>
                      <p className="text-lg text-gray-900 font-semibold">{paiementSelectionne?.numeroRecu}</p>
                    </div>
                  </div>
                  {paiementSelectionne?.commentaire && (
                    <div className="bg-soleil-50 p-4 rounded-lg border border-soleil-200 shadow-sm">
                      <p className="text-sm font-medium text-soleil-900">Commentaire</p>
                      <p className="text-soleil-800 mt-1">{paiementSelectionne.commentaire}</p>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200">
                    <button className="btn-primary flex items-center justify-center shadow-md hover:shadow-lg">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le reçu
                    </button>
                    <button
                      onClick={() => setTypeModal('modifier')}
                      className="btn-secondary flex items-center justify-center shadow-sm hover:shadow-md"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </button>
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

export default GestionPaiements;
