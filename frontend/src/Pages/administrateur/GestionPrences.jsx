import {
    AlertCircle,
    CheckCircle, // Pour fermer le modal
    Edit, // Pour les filtres
    Eye, // Pour la recherche
    Filter, // Renvoyé
    Info, // Pour le total des présences
    Save, // Pour supprimer
    Search, // Pour modifier
    Trash2, // Absent
    UserCheck, // Présent
    UserMinus, // Retard
    UserPlus, // Pour les statistiques de renvoi
    Users,
    UserX, // Pour les détails du modal
    X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuth } from '../../context/MonContext';

const GestionPresencesAdmin = () => {
    const { donnees } = useAuth();
    const [rechercheTexte, setRechercheTexte] = useState('');
    const [filtreClasse, setFiltreClasse] = useState('');
    const [filtreEnseignant, setFiltreEnseignant] = useState('');
    const [filtreType, setFiltreType] = useState(''); // 'Présent', 'Absent', 'Retard', 'Renvoyé'
    const [filtreJustifie, setFiltreJustifie] = useState(''); // 'oui', 'non', '' (tous)
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');

    const [modalOuvert, setModalOuvert] = useState(false);
    const [presenceSelectionnee, setPresenceSelectionnee] = useState(null);
    const [typeModal, setTypeModal] = useState('voir'); // 'voir', 'modifier'

    const toutesLesPresences = donnees.presences || [];
    const eleves = donnees.eleves || [];
    const classes = donnees.classes || [];
    const enseignants = donnees.enseignants || [];
    const matieres = donnees.matieres || [];

    const presencesFiltrees = useMemo(() => {
        return toutesLesPresences.filter(presence => {
            const eleve = eleves.find(e => e.id === presence.eleveId);
            const enseignant = enseignants.find(e => e.id === presence.enseignantId);
            const matiere = matieres.find(m => m.id === presence.matiereId);

            const correspondRecherche = eleve ?
                `${eleve.prenom} ${eleve.nom} ${eleve.numeroMatricule} ${matiere?.nom || ''}`.toLowerCase().includes(rechercheTexte.toLowerCase())
                : false;

            const correspondClasse = !filtreClasse || String(presence.classeId) === filtreClasse;
            const correspondEnseignant = !filtreEnseignant || String(presence.enseignantId) === filtreEnseignant;
            const correspondType = !filtreType || presence.type === filtreType;
            const correspondJustifie = filtreJustifie === '' || (filtreJustifie === 'oui' && presence.justifie) || (filtreJustifie === 'non' && !presence.justifie);

            const datePresence = new Date(presence.date);
            const debut = dateDebut ? new Date(dateDebut) : null;
            const fin = dateFin ? new Date(dateFin) : null;

            const correspondDate = (!debut || datePresence >= debut) && (!fin || datePresence <= fin);

            return correspondRecherche && correspondClasse && correspondEnseignant && correspondType && correspondJustifie && correspondDate;
        }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Tri par date décroissante
    }, [toutesLesPresences, eleves, enseignants, matieres, classes, rechercheTexte, filtreClasse, filtreEnseignant, filtreType, filtreJustifie, dateDebut, dateFin]);

    const calculerStatistiques = useMemo(() => {
        const total = presencesFiltrees.length;
        const presents = presencesFiltrees.filter(p => p.type === 'Présent').length;
        const absents = presencesFiltrees.filter(p => p.type === 'Absent').length;
        const retards = presencesFiltrees.filter(p => p.type === 'Retard').length;
        const renvoyes = presencesFiltrees.filter(p => p.type === 'Renvoyé').length;

        const absentsJustifies = presencesFiltrees.filter(p => p.type === 'Absent' && p.justifie).length;
        const absentsNonJustifies = absents - absentsJustifies;

        return {
            total,
            presents,
            absents,
            retards,
            renvoyes,
            absentsJustifies,
            absentsNonJustifies,
            pourcentagePresence: total > 0 ? ((presents / total) * 100).toFixed(1) : 0,
            pourcentageAbsence: total > 0 ? ((absents / total) * 100).toFixed(1) : 0,
        };
    }, [presencesFiltrees]);

    const ouvrirModal = (type, presence = null) => {
        setTypeModal(type);
        setPresenceSelectionnee(presence);
        setModalOuvert(true);
    };

    const fermerModal = () => {
        setModalOuvert(false);
        setPresenceSelectionnee(null);
        setTypeModal('voir');
    };

    const handleModifierPresence = (id, updatedData) => {
        console.log(`Modification de la présence ID ${id}:`, updatedData);
        // Ici, implémenter la logique de mise à jour dans votre source de données (API ou `donneesTemporaires`)
        // Pour l'exemple, nous allons juste fermer le modal
        fermerModal();
        // Optionnel: rafraichir les données si `donneesTemporaires` est mutable ou après un appel API
    };

    const handleSupprimerPresence = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet enregistrement de présence ?")) {
            console.log(`Suppression de la présence ID ${id}`);
            // Ici, implémenter la logique de suppression
            fermerModal();
            // Optionnel: rafraichir les données
        }
    };

    const getStatusColorClass = (status) => {
        switch (status) {
            case 'Présent': return 'bg-acacia-100 text-acacia-800 border border-acacia-200';
            case 'Absent': return 'bg-terre-100 text-terre-800 border border-terre-200';
            case 'Retard': return 'bg-soleil-100 text-soleil-800 border border-soleil-200';
            case 'Renvoyé': return 'bg-red-100 text-red-800 border border-red-200'; // Utilisation d'une couleur rouge plus distincte
            default: return 'bg-gray-100 text-gray-700 border border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Présent': return <CheckCircle className="h-4 w-4" />;
            case 'Absent': return <UserX className="h-4 w-4" />;
            case 'Retard': return <UserMinus className="h-4 w-4" />;
            case 'Renvoyé': return <UserPlus className="h-4 w-4" />;
            default: return <Info className="h-4 w-4" />;
        }
    };

    const PresenceDetailsModal = ({ presence, onSave, onClose, type }) => {
        const [formData, setFormData] = useState(presence || {});

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave(formData.id, formData);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
                <div className="bg-white rounded-lg max-w-xl w-full p-6 shadow-xl animate-scale-in">
                    <div className="flex justify-between items-center mb-4 border-b pb-3">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {type === 'voir' ? 'Détails de la présence' : 'Modifier la présence'}
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">Élève</label>
                                <p className="font-semibold text-gray-900">
                                    {eleves.find(e => e.id === formData.eleveId)?.prenom} {eleves.find(e => e.id === formData.eleveId)?.nom}
                                </p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Classe</label>
                                <p className="font-semibold text-gray-900">
                                    {classes.find(c => c.id === formData.classeId)?.nom}
                                </p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Matière</label>
                                <p className="font-semibold text-gray-900">
                                    {matieres.find(m => m.id === formData.matiereId)?.nom}
                                </p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Enseignant</label>
                                <p className="font-semibold text-gray-900">
                                    {enseignants.find(e => e.id === formData.enseignantId)?.prenom} {enseignants.find(e => e.id === formData.enseignantId)?.nom}
                                </p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="input-field"
                                    readOnly={type === 'voir'}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Heure du cours</label>
                                <input
                                    type="text"
                                    value={formData.heureCours}
                                    onChange={(e) => setFormData({ ...formData, heureCours: e.target.value })}
                                    className="input-field"
                                    readOnly={type === 'voir'}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Statut</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="input-field"
                                    disabled={type === 'voir'}
                                >
                                    <option value="Présent">Présent</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Retard">Retard</option>
                                    <option value="Renvoyé">Renvoyé</option>
                                </select>
                            </div>
                            <div className="form-group flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={formData.justifie}
                                    onChange={(e) => setFormData({ ...formData, justifie: e.target.checked })}
                                    className="rounded border-gray-300 text-fleuve-600 focus:ring-fleuve-500"
                                    disabled={type === 'voir'}
                                />
                                <label className="form-label mb-0">Justifié</label>
                            </div>
                            {(formData.type === 'Absent' || formData.type === 'Retard' || formData.type === 'Renvoyé') && (
                                <div className="form-group md:col-span-2">
                                    <label className="form-label">Raison</label>
                                    <textarea
                                        value={formData.raison}
                                        onChange={(e) => setFormData({ ...formData, raison: e.target.value })}
                                        className="input-field"
                                        rows="2"
                                        readOnly={type === 'voir'}
                                    ></textarea>
                                </div>
                            )}
                            {formData.type === 'Retard' && (
                                <div className="form-group md:col-span-2">
                                    <label className="form-label">Heure d'arrivée</label>
                                    <input
                                        type="time"
                                        value={formData.heureArrivee}
                                        onChange={(e) => setFormData({ ...formData, heureArrivee: e.target.value })}
                                        className="input-field"
                                        readOnly={type === 'voir'}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end space-x-2 mt-6 border-t pt-4 border-gray-200">
                            <button type="button" onClick={onClose} className="btn-secondary">
                                {type === 'voir' ? 'Fermer' : 'Annuler'}
                            </button>
                            {type === 'modifier' && (
                                <button type="submit" className="btn-primary flex items-center">
                                    <Save className="h-4 w-4 mr-2" /> Enregistrer les modifications
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        );
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des Présences (Admin)</h1>
                    <p className="text-gray-600">Consultez et gérez tous les enregistrements de présence</p>
                </div>
                {/* Pas de bouton d'ajout direct ici, car la création se fait par l'enseignant */}
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                 <div className="card bg-fleuve-50 border border-fleuve-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
                    <div className="flex items-center">
                        <Users className="h-8 w-8 text-fleuve-600 mr-3" />
                        <div>
                            <p className="text-2xl font-bold text-fleuve-900">{calculerStatistiques.total}</p>
                            <p className="text-sm text-fleuve-700">Enregistrements total</p>
                        </div>
                    </div>
                </div>
                <div className="card bg-acacia-50 border border-acacia-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
                    <div className="flex items-center">
                        <UserCheck className="h-8 w-8 text-acacia-600 mr-3" />
                        <div>
                            <p className="text-2xl font-bold text-acacia-900">{calculerStatistiques.presents}</p>
                            <p className="text-sm text-acacia-700">Présences marquées</p>
                        </div>
                    </div>
                </div>
                <div className="card bg-terre-50 border border-terre-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
                    <div className="flex items-center">
                        <UserX className="h-8 w-8 text-terre-600 mr-3" />
                        <div>
                            <p className="text-2xl font-bold text-terre-900">{calculerStatistiques.absents}</p>
                            <p className="text-sm text-terre-700">Absences ({calculerStatistiques.absentsNonJustifies} non justifiées)</p>
                        </div>
                    </div>
                </div>
                <div className="card bg-soleil-50 border border-soleil-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
                    <div className="flex items-center">
                        <UserMinus className="h-8 w-8 text-soleil-600 mr-3" />
                        <div>
                            <p className="text-2xl font-bold text-soleil-900">{calculerStatistiques.retards}</p>
                            <p className="text-sm text-soleil-700">Retards</p>
                        </div>
                    </div>
                </div>
                <div className="card bg-red-50 border border-red-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
                    <div className="flex items-center">
                        <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
                        <div>
                            <p className="text-2xl font-bold text-red-900">{calculerStatistiques.renvoyes}</p>
                            <p className="text-sm text-red-700">Renvoyés</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtres détaillés */}
            <div className="card p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Filtrer les enregistrements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative form-group">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Rechercher élève, matricule, matière..."
                            value={rechercheTexte}
                            onChange={(e) => setRechercheTexte(e.target.value)}
                            className="pl-10 input-field"
                        />
                    </div>
                    <div className="form-group">
                        <select
                            value={filtreClasse}
                            onChange={(e) => setFiltreClasse(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Toutes les classes</option>
                            {classes.map(classe => (
                                <option key={classe.id} value={classe.id}>{classe.nom}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <select
                            value={filtreEnseignant}
                            onChange={(e) => setFiltreEnseignant(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Tous les enseignants</option>
                            {enseignants.map(ens => (
                                <option key={ens.id} value={ens.id}>{ens.prenom} {ens.nom}</option>
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
                            <option value="Présent">Présent</option>
                            <option value="Absent">Absent</option>
                            <option value="Retard">Retard</option>
                            <option value="Renvoyé">Renvoyé</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Date début</label>
                        <select
                            value={filtreJustifie}
                            onChange={(e) => setFiltreJustifie(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Justifié / Non justifié</option>
                            <option value="oui">Justifié</option>
                            <option value="non">Non justifié</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Date début</label>
                        <input
                            type="date"
                            value={dateDebut}
                            onChange={(e) => setDateDebut(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Date fin</label>
                        <input
                            type="date"
                            value={dateFin}
                            onChange={(e) => setDateFin(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <button className="w-full btn-secondary flex items-center justify-center shadow-sm hover:shadow-md h-[42px]">
                            <Filter className="h-4 w-4 mr-2" />
                            Appliquer filtres
                        </button>
                    </div>
                </div>
            </div>

            {/* Tableau des enregistrements de présence */}
            <div className="card table-container p-0">
                <table className="table">
                    <thead className="table-header">
                        <tr>
                            <th className="table-header-cell">Élève</th>
                            <th className="table-header-cell">Classe</th>
                            <th className="table-header-cell">Date</th>
                            <th className="table-header-cell">Cours (Heure)</th>
                            <th className="table-header-cell">Matière</th>
                            <th className="table-header-cell">Enseignant</th>
                            <th className="table-header-cell">Statut</th>
                            <th className="table-header-cell">Détails</th>
                            <th className="table-header-cell text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {presencesFiltrees.length > 0 ? (
                            presencesFiltrees.map(presence => {
                                const eleve = eleves.find(e => e.id === presence.eleveId);
                                const classe = classes.find(c => c.id === presence.classeId);
                                const matiere = matieres.find(m => m.id === presence.matiereId);
                                const enseignant = enseignants.find(e => e.id === presence.enseignantId);

                                return (
                                    <tr key={presence.id} className="table-row">
                                        <td className="table-cell font-medium text-gray-900">
                                            <div className="flex items-center">
                                                <img
                                                    src={eleve?.photo || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                                                    alt={`${eleve?.prenom} ${eleve?.nom}`}
                                                    className="h-8 w-8 rounded-full object-cover mr-3 shadow-sm"
                                                />
                                                {eleve?.prenom} {eleve?.nom}
                                            </div>
                                        </td>
                                        <td className="table-cell">{classe?.nom}</td>
                                        <td className="table-cell">{new Date(presence.date).toLocaleDateString('fr-FR')}</td>
                                        <td className="table-cell">{presence.heureCours}</td>
                                        <td className="table-cell">{matiere?.nom}</td>
                                        <td className="table-cell">{enseignant?.prenom} {enseignant?.nom}</td>
                                        <td className="table-cell">
                                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColorClass(presence.type)}`}>
                                                {getStatusIcon(presence.type)}
                                                <span className="ml-1">{presence.type}</span>
                                            </span>
                                        </td>
                                        <td className="table-cell text-sm text-gray-600">
                                            {presence.type !== 'Présent' ? (
                                                <>
                                                    <span className={`font-medium ${presence.justifie ? 'text-acacia-600' : 'text-terre-600'}`}>
                                                        {presence.justifie ? 'Justifié' : 'Non justifié'}
                                                    </span>
                                                    {presence.raison && <span className="block text-xs italic line-clamp-1">"{presence.raison}"</span>}
                                                    {presence.type === 'Retard' && presence.heureArrivee && <span className="block text-xs">Arrivée: {presence.heureArrivee}</span>}
                                                </>
                                            ) : '-'}
                                        </td>
                                        <td className="table-cell text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => ouvrirModal('voir', presence)}
                                                    className="p-2 rounded-full text-fleuve-600 hover:bg-fleuve-50 hover:text-fleuve-800 transition-colors"
                                                    title="Voir détails"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => ouvrirModal('modifier', presence)}
                                                    className="p-2 rounded-full text-soleil-600 hover:bg-soleil-50 hover:text-soleil-800 transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleSupprimerPresence(presence.id)}
                                                    className="p-2 rounded-full text-terre-600 hover:bg-terre-50 hover:text-terre-800 transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="9" className="py-12 text-center text-gray-500">
                                    <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    Aucun enregistrement de présence trouvé pour cette sélection.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de détails/modification */}
            {modalOuvert && presenceSelectionnee && (
                <PresenceDetailsModal
                    presence={presenceSelectionnee}
                    onSave={handleModifierPresence}
                    onClose={fermerModal}
                    type={typeModal}
                />
            )}
        </div>
    );
};

export default GestionPresencesAdmin;