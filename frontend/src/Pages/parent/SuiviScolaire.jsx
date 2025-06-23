import {
    AlertTriangle,
    BookOpen,
    CheckCircle,
    ClipboardCheck,
    CreditCard,
    DollarSign,
    Download,
    Eye,
    FileText,
    GraduationCap,
    Search,
    Users,
    X
} from 'lucide-react';
import { useState } from 'react'; // Ajout de useMemo
import { useAuth } from '../../context/MonContext';

const SuiviScolaireEnfant = () => {
  const { donnees, utilisateur } = useAuth();
  const [rechercheTexte, setRechercheTexte] = useState('');

  // États pour les modals
  const [modalNotesOuvert, setModalNotesOuvert] = useState(false);
  const [modalPaiementsOuvert, setModalPaiementsOuvert] = useState(false);
  const [modalDocumentsOuvert, setModalDocumentsOuvert] = useState(false);
  const [enfantSelectionneModal, setEnfantSelectionneModal] = useState(null); // Enfant pour lequel un modal est ouvert

  // Données brutes du contexte
  const tousLesEleves = donnees.eleves || [];
  const toutesLesNotes = donnees.notes || [];
  const tousLesPaiements = donnees.paiements || [];
  const tousLesDocuments = donnees.documents || [];
  const toutesLesMatieres = donnees.matieres || [];
  // const toutesLesClasses = donnees.classes || []; // Pas directement utilisé ici, mais bien dans le contexte

  const estParentConnecte = utilisateur && utilisateur.role === 'parent';

  // Filtrer les enfants associés à ce parent (plus robuste)
  
   const mesEnfants = estParentConnecte
    ? tousLesEleves.filter(eleve => {
        // Le filtrage se fait maintenant par enseignantPrincipalId dans l'objet classe
        return eleve.parentId === utilisateur.id;
      })
    : [];

  const enfantsFiltres = mesEnfants.filter(eleve =>
    eleve.prenom?.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
    eleve.nom?.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
    eleve.classe?.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
    eleve.numeroMatricule?.toLowerCase().includes(rechercheTexte.toLowerCase())
  );

  // Fonctions d'aide pour obtenir les données spécifiques à chaque enfant
  const obtenirDernieresNotes = (enfantId) => {
    const notesEnfant = toutesLesNotes.filter(n => n.eleveId === enfantId);
    return notesEnfant.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3); // 3 dernières notes
  };

  const obtenirStatutPaiements = (enfantId) => {
    const paiementsEnfant = tousLesPaiements.filter(p => p.eleveId === enfantId);
    const totalPaye = paiementsEnfant.filter(p => p.statut === 'payé').reduce((sum, p) => sum + p.montant, 0);
    const totalEnAttente = paiementsEnfant.filter(p => p.statut === 'en_attente').reduce((sum, p) => sum + p.montant, 0);
    
    return {
      paye: totalPaye,
      enAttente: totalEnAttente,
      derniersPaiements: paiementsEnfant.sort((a, b) => new Date(b.datePayment) - new Date(a.datePayment)).slice(0, 2) // 2 derniers paiements
    };
  };

  const obtenirDocumentsRecents = (classeNom) => {
    const documentsClasse = tousLesDocuments.filter(d => d.classe === classeNom);
    return documentsClasse.sort((a, b) => new Date(b.dateAjout) - new Date(a.dateAjout)).slice(0, 2); // 2 derniers docs
  };

  const calculerMoyenneMatiere = (notesList, matiereId) => {
    const notesMatiere = notesList.filter(n => n.matiereId === matiereId);
    if (notesMatiere.length === 0) return null;
    const totalPondere = notesMatiere.reduce((sum, note) => sum + (note.valeur * (note.coefficient || 1)), 0);
    const totalCoefficients = notesMatiere.reduce((sum, note) => sum + (note.coefficient || 1), 0);
    return totalCoefficients > 0 ? (totalPondere / totalCoefficients) : 0;
  };

  const calculerMoyenneGeneraleEnfant = (enfantId) => {
    const notesEnfant = toutesLesNotes.filter(n => n.eleveId === enfantId);
    const moyennesMatiere = toutesLesMatieres.map(matiere => {
        const moyenne = calculerMoyenneMatiere(notesEnfant, matiere.id);
        return moyenne !== null ? { moyenne, coefficient: matiere.coefficient } : null;
    }).filter(Boolean);

    if (moyennesMatiere.length === 0) return 0;
    const totalMoyennePonderee = moyennesMatiere.reduce((sum, m) => sum + (m.moyenne * m.coefficient), 0);
    const totalCoefficients = moyennesMatiere.reduce((sum, m) => sum + m.coefficient, 0);
    return totalCoefficients > 0 ? (totalMoyennePonderee / totalCoefficients) : 0;
  };

  const obtenirMention = (moyenne) => {
    if (moyenne >= 16) return { mention: 'Très Bien', couleur: 'text-acacia-600', bg: 'bg-acacia-100', border: 'border-acacia-200' };
    if (moyenne >= 14) return { mention: 'Bien', couleur: 'text-fleuve-600', bg: 'bg-fleuve-100', border: 'border-fleuve-200' };
    if (moyenne >= 12) return { mention: 'Assez Bien', couleur: 'text-soleil-600', bg: 'bg-soleil-100', border: 'border-soleil-200' };
    if (moyenne >= 10) return { mention: 'Passable', couleur: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-200' };
    return { mention: 'Insuffisant', couleur: 'text-terre-600', bg: 'bg-terre-100', border: 'border-terre-200' };
  };

  // Fonctions pour ouvrir/fermer les modals spécifiques
  const openNotesModal = (enfant) => {
      setEnfantSelectionneModal(enfant);
      setModalNotesOuvert(true);
  };
  const closeNotesModal = () => {
      setModalNotesOuvert(false);
      setEnfantSelectionneModal(null);
  };

  const openPaiementsModal = (enfant) => {
      setEnfantSelectionneModal(enfant);
      setModalPaiementsOuvert(true);
  };
  const closePaiementsModal = () => {
      setModalPaiementsOuvert(false);
      setEnfantSelectionneModal(null);
  };

  const openDocumentsModal = (enfant) => {
      setEnfantSelectionneModal(enfant);
      setModalDocumentsOuvert(true);
  };
  const closeDocumentsModal = () => {
      setModalDocumentsOuvert(false);
      setEnfantSelectionneModal(null);
  };


  // --- Composants Modals Internes ---

  const ModalNotes = () => {
    if (!enfantSelectionneModal) return null;
    const notesEnfant = toutesLesNotes.filter(n => n.eleveId === enfantSelectionneModal.id);
    const matieresAvecNotes = toutesLesMatieres.map(matiere => ({
        ...matiere,
        moyenne: calculerMoyenneMatiere(notesEnfant, matiere.id),
        notesDetail: notesEnfant.filter(n => n.matiereId === matiere.id)
    })).filter(m => m.moyenne !== null);

    const moyenneGeneraleModal = calculerMoyenneGeneraleEnfant(enfantSelectionneModal.id);
    const mentionGeneraleModal = obtenirMention(moyenneGeneraleModal);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4 border-b pb-4">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <FileText className="h-6 w-6 mr-2 text-fleuve-600" />
                            Notes de {enfantSelectionneModal.prenom} {enfantSelectionneModal.nom}
                        </h3>
                        <button onClick={closeNotesModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Résumé rapide */}
                        <div className="flex justify-around items-center bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Moyenne Générale</p>
                                <p className="text-2xl font-bold text-fleuve-800">{moyenneGeneraleModal.toFixed(2)}/20</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Mention</p>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${mentionGeneraleModal.bg} ${mentionGeneraleModal.couleur} ${mentionGeneraleModal.border}`}>
                                    {mentionGeneraleModal.mention}
                                </span>
                            </div>
                        </div>

                        {/* Notes par matière */}
                        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                            {matieresAvecNotes.length > 0 ? (
                                matieresAvecNotes.map(matiere => (
                                    <div key={matiere.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-gray-900 flex items-center">
                                                <GraduationCap className="h-4 w-4 mr-2 text-fleuve-500" /> {matiere.nom}
                                            </h4>
                                            <span className={`text-xl font-bold ${obtenirMention(matiere.moyenne).couleur}`}>
                                                {matiere.moyenne.toFixed(2)}/20
                                            </span>
                                        </div>
                                        <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
                                            {matiere.notesDetail.map(note => (
                                                <li key={note.id} className="flex justify-between items-center py-1">
                                                    <span>{note.type} (Coef. {note.coefficient}):</span>
                                                    <span className={`font-semibold ${obtenirMention(note.valeur).couleur}`}>{note.valeur}/20</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-gray-500">Aucune note détaillée disponible pour cet enfant.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const ModalPaiements = () => {
    if (!enfantSelectionneModal) return null;
    const paiementsEnfant = tousLesPaiements.filter(p => p.eleveId === enfantSelectionneModal.id).sort((a, b) => new Date(b.datePayment) - new Date(a.datePayment));

    const totalPayeModal = paiementsEnfant.filter(p => p.statut === 'payé').reduce((sum, p) => sum + p.montant, 0);
    const totalEnAttenteModal = paiementsEnfant.filter(p => p.statut === 'en_attente').reduce((sum, p) => sum + p.montant, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4 border-b pb-4">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <DollarSign className="h-6 w-6 mr-2 text-fleuve-600" />
                            Historique des Paiements de {enfantSelectionneModal.prenom} {enfantSelectionneModal.nom}
                        </h3>
                        <button onClick={closePaiementsModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Statistiques rapides des paiements */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-acacia-50 p-4 rounded-lg border border-acacia-200 shadow-sm text-center">
                                <p className="text-sm text-acacia-900">Total Payé</p>
                                <p className="text-2xl font-bold text-acacia-800">{totalPayeModal.toLocaleString()} FCFA</p>
                            </div>
                            <div className="bg-soleil-50 p-4 rounded-lg border border-soleil-200 shadow-sm text-center">
                                <p className="text-sm text-soleil-900">En Attente</p>
                                <p className="text-2xl font-bold text-soleil-800">{totalEnAttenteModal.toLocaleString()} FCFA</p>
                            </div>
                        </div>

                        {/* Liste détaillée des paiements */}
                        <div className="table-container max-h-96 overflow-y-auto custom-scrollbar border border-gray-200 rounded-lg shadow-sm">
                            <table className="table min-w-full">
                                <thead className="table-header sticky top-0">
                                    <tr>
                                        <th className="table-header-cell">N° Reçu</th>
                                        <th className="table-header-cell">Montant</th>
                                        <th className="table-header-cell">Date</th>
                                        <th className="table-header-cell">Statut</th>
                                        <th className="table-header-cell">Type</th>
                                        <th className="table-header-cell">Méthode</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {paiementsEnfant.length > 0 ? (
                                        paiementsEnfant.map(paiement => (
                                            <tr key={paiement.id} className="table-row">
                                                <td className="table-cell">{paiement.numeroRecu}</td>
                                                <td className="table-cell font-bold">{paiement.montant.toLocaleString()}</td>
                                                <td className="table-cell">{new Date(paiement.datePayment).toLocaleDateString('fr-FR')}</td>
                                                <td className="table-cell">
                                                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full border ${
                                                        paiement.statut === 'payé' ? 'bg-acacia-100 text-acacia-800 border-acacia-200' :
                                                        paiement.statut === 'en_attente' ? 'bg-soleil-100 text-soleil-800 border-soleil-200' :
                                                        'bg-terre-100 text-terre-800 border-terre-200'
                                                    }`}>
                                                        {paiement.statut}
                                                    </span>
                                                </td>
                                                <td className="table-cell">{paiement.typePaiement}</td>
                                                <td className="table-cell flex items-center">
                                                    <CreditCard className="h-4 w-4 mr-1 text-gray-500" />{paiement.methode}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="table-cell text-center py-4 text-gray-500">
                                                Aucun paiement enregistré pour cet enfant.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const ModalDocuments = () => {
    if (!enfantSelectionneModal) return null;
    const documentsEnfant = tousLesDocuments.filter(d => d.classe === enfantSelectionneModal.classe).sort((a, b) => new Date(b.dateAjout) - new Date(a.dateAjout));

    const obtenirIconeTypeDocument = (type) => {
        switch (type) {
          case 'cours': return <BookOpen className="h-5 w-5 text-fleuve-600" />;
          case 'exercices': return <FileText className="h-5 w-5 text-acacia-600" />;
          case 'devoirs': return <FileText className="h-5 w-5 text-soleil-600" />;
          case 'corrections': return <FileText className="h-5 w-5 text-terre-600" />;
          case 'evaluations': return <FileText className="h-5 w-5 text-terre-600" />;
          default: return <FileText className="h-5 w-5 text-gray-600" />;
        }
    };

    const obtenirCouleurTypeDocument = (type) => {
        switch (type) {
          case 'cours': return 'bg-fleuve-100 text-fleuve-800 border-fleuve-200';
          case 'exercices': return 'bg-acacia-100 text-acacia-800 border-acacia-200';
          case 'devoirs': return 'bg-soleil-100 text-soleil-800 border-soleil-200';
          case 'corrections': return 'bg-terre-100 text-terre-800 border-terre-200';
          case 'evaluations': return 'bg-terre-100 text-terre-800 border-terre-200';
          default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4 border-b pb-4">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <BookOpen className="h-6 w-6 mr-2 text-fleuve-600" />
                            Documents de {enfantSelectionneModal.prenom} {enfantSelectionneModal.nom}
                        </h3>
                        <button onClick={closeDocumentsModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                        {documentsEnfant.length > 0 ? (
                            documentsEnfant.map(doc => (
                                <div key={doc.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${obtenirCouleurTypeDocument(doc.type).split(' ')[0]}`}>
                                            {obtenirIconeTypeDocument(doc.type)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{doc.titre}</p>
                                            <p className="text-xs text-gray-600">{doc.matiere} • {new Date(doc.dateAjout).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => console.log('Aperçu doc:', doc.id)} className="p-2 rounded-full text-fleuve-600 hover:bg-fleuve-50 transition-colors" title="Aperçu">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => console.log('Télécharger doc:', doc.id)} className="p-2 rounded-full text-acacia-600 hover:bg-acacia-50 transition-colors" title="Télécharger">
                                            <Download className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500">Aucun document disponible pour cet enfant dans cette classe.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suivi Scolaire de Mes Enfants</h1>
          <p className="text-gray-600">Un aperçu rapide des progrès et du statut de vos enfants</p>
        </div>
      </div>

      {/* Recherche */}
      <div className="card p-6 shadow-sm">
        <div className="relative form-group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher un enfant par nom..."
            value={rechercheTexte}
            onChange={(e) => setRechercheTexte(e.target.value)}
            className="pl-10 input-field"
          />
        </div>
      </div>

      {/* Cartes de suivi par enfant */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enfantsFiltres.length > 0 ? (
          enfantsFiltres.map((enfant) => {
            const dernieresNotes = obtenirDernieresNotes(enfant.id);
            const statutPaiements = obtenirStatutPaiements(enfant.id);
            const documentsRecents = obtenirDocumentsRecents(enfant.classe);
            const moyenneGeneraleEnfant = calculerMoyenneGeneraleEnfant(enfant.id);
            const mentionEnfant = obtenirMention(moyenneGeneraleEnfant);

            return (
              <div key={enfant.id} className="card p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
                {/* En-tête Enfant */}
                <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-200">
                  <img
                    src={enfant.photo || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                    alt={`${enfant.prenom} ${enfant.nom}`}
                    className="h-20 w-20 rounded-full object-cover border-2 border-fleuve-300 shadow-sm"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{enfant.prenom} {enfant.nom}</h3>
                    <p className="text-gray-600 text-lg">Classe: <span className="font-semibold text-fleuve-700">{enfant.classe}</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Notes et Moyenne */}
                    <div className="bg-fleuve-50 p-4 rounded-lg border border-fleuve-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-fleuve-900 flex items-center"><ClipboardCheck className="h-5 w-5 mr-2" /> Notes</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${mentionEnfant.bg} ${mentionEnfant.couleur} ${mentionEnfant.border}`}>
                                {moyenneGeneraleEnfant.toFixed(2)}/20
                            </span>
                        </div>
                        <p className="text-sm text-fleuve-800 font-medium">Moyenne Générale: {moyenneGeneraleEnfant.toFixed(2)}</p>
                        <ul className="text-xs text-gray-700 space-y-1 mt-2 max-h-20 overflow-y-auto custom-scrollbar">
                            {dernieresNotes.length > 0 ? (
                                dernieresNotes.map(note => (
                                    <li key={note.id} className="flex justify-between">
                                        <span>{toutesLesMatieres.find(m => m.id === note.matiereId)?.nom}:</span>
                                        <span className="font-medium">{note.valeur}/20</span>
                                    </li>
                                ))
                            ) : (
                                <li>Aucune note récente.</li>
                            )}
                        </ul>
                    </div>

                    {/* Paiements */}
                    <div className="bg-acacia-50 p-4 rounded-lg border border-acacia-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-acacia-900 flex items-center"><DollarSign className="h-5 w-5 mr-2" /> Paiements</h4>
                            {statutPaiements.enAttente > 0 ? (
                                <AlertTriangle className="h-5 w-5 text-terre-600" title="Paiements en attente" />
                            ) : (
                                <CheckCircle className="h-5 w-5 text-acacia-600" title="Tous les paiements à jour" />
                            )}
                        </div>
                        <p className="text-sm text-acacia-800 font-medium">Payé: {statutPaiements.paye.toLocaleString()} FCFA</p>
                        <p className="text-sm text-terre-800 font-medium">En attente: {statutPaiements.enAttente.toLocaleString()} FCFA</p>
                        <ul className="text-xs text-gray-700 space-y-1 mt-2 max-h-20 overflow-y-auto custom-scrollbar">
                            {statutPaiements.derniersPaiements.length > 0 ? (
                                statutPaiements.derniersPaiements.map(paiement => (
                                    <li key={paiement.id} className="flex justify-between">
                                        <span>{paiement.typePaiement}:</span>
                                        <span className="font-medium">{paiement.montant.toLocaleString()} FCFA</span>
                                    </li>
                                ))
                            ) : (
                                <li>Aucun paiement enregistré.</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Documents récents */}
                <div className="bg-soleil-50 p-4 rounded-lg border border-soleil-200 shadow-sm mb-6">
                    <h4 className="font-semibold text-soleil-900 flex items-center mb-2"><BookOpen className="h-5 w-5 mr-2" /> Documents récents</h4>
                    <ul className="text-sm text-gray-700 space-y-2 max-h-20 overflow-y-auto custom-scrollbar">
                        {documentsRecents.length > 0 ? (
                            documentsRecents.map(doc => (
                                <li key={doc.id} className="flex justify-between items-center bg-white p-2 rounded border border-gray-100">
                                    <span className="line-clamp-1">{doc.titre}</span>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100">{doc.type}</span>
                                </li>
                            ))
                        ) : (
                            <li>Aucun document récent disponible.</li>
                        )}
                    </ul>
                </div>

                {/* Boutons d'action rapides (ouvrir les modals ici) */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 border-t pt-4 border-gray-200">
                  <button
                    onClick={() => console.log('Aller aux notes de:', enfant.id)} // Garde les logs ou mettez des navigations réelles
                    className="btn-primary flex items-center justify-center shadow-md hover:shadow-lg flex-1 py-2.5"
                  >
                    <FileText className="h-4 w-4 mr-2" /> Notes détaillées
                  </button>
                  <button
                    onClick={() => console.log('Aller aux paiements de:', enfant.id)}
                    className="btn-secondary flex items-center justify-center shadow-sm hover:shadow-md flex-1 py-2.5"
                  >
                    <DollarSign className="h-4 w-4 mr-2" /> Paiements
                  </button>
                  <button
                    onClick={() => console.log('Aller aux documents de:', enfant.id)}
                    className="btn-secondary flex items-center justify-center shadow-sm hover:shadow-md flex-1 py-2.5"
                  >
                    <BookOpen className="h-4 w-4 mr-2" /> Documents
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="lg:col-span-2 text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun enfant trouvé pour cette sélection.</p>
            <p className="text-gray-400 text-sm mt-2">
              {mesEnfants.length === 0
                ? "Vos enfants n'ont pas encore été associés à votre compte."
                : "Veuillez ajuster votre recherche."
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal Notes Détaillées */}
      {modalNotesOuvert && <ModalNotes />}

      {/* Modal Historique des Paiements */}
      {modalPaiementsOuvert && <ModalPaiements />}

      {/* Modal Documents Détaillés */}
      {modalDocumentsOuvert && <ModalDocuments />}

    </div>
  );
};

export default SuiviScolaireEnfant;