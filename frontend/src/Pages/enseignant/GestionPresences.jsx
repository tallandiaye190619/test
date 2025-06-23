import {
    Calendar,
    CheckCircle, // Renvoyé (peut-être une meilleure icône à trouver)
    Info, // Pour fermer le modal
    Save, // Présent
    UserMinus, // Retard
    UserPlus,
    UserX, // Pour la raison
    X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/MonContext';

const GestionPresences = () => {
    const { utilisateur, donnees } = useAuth();
    const [classeSelectionnee, setClasseSelectionnee] = useState('');
    const [dateSelectionnee, setDateSelectionnee] = useState(new Date().toISOString().split('T')[0]); // Date du jour par défaut
    const [modalOuvert, setModalOuvert] = useState(false);
    const [presenceDataToEdit, setPresenceDataToEdit] = useState(null); // Pour le modal d'édition/ajout

    const mesClasses = utilisateur?.classesIds?.map(id => donnees.classes.find(c => c.id === id)).filter(Boolean) || [];
    const elevesDeLaClasse = classeSelectionnee ? donnees.eleves.filter(e => String(e.classeId) === String(classeSelectionnee)) : [];
    const tousLesEmploisDuTemps = donnees.emploisDuTemps || [];
    const toutesLesPresences = donnees.presences || [];
    const toutesLesMatieres = donnees.matieres || [];

    // Emploi du temps de la classe sélectionnée pour le jour sélectionné
    const emploiDuTempsJour = useMemo(() => {
        const jourSemaine = new Date(dateSelectionnee).toLocaleDateString('fr-FR', { weekday: 'long' });
        return tousLesEmploisDuTemps.filter(cours =>
            String(cours.classeId) === String(classeSelectionnee) &&
            cours.jour.toLowerCase() === jourSemaine.toLowerCase() &&
            cours.enseignantId === utilisateur.id // Seulement les cours que l'enseignant donne
        ).sort((a, b) => a.heure.localeCompare(b.heure)); // Tri par heure
    }, [classeSelectionnee, dateSelectionnee, tousLesEmploisDuTemps, utilisateur.id]);

    // État local pour gérer les présences en temps réel avant la sauvegarde
    // Structure: { eleveId: { heureCours: { type: 'Absent', justifie: true, raison: '...', heureArrivee: '' } } }
    const [presencesTemp, setPresencesTemp] = useState({});

    // Initialiser presencesTemp avec les données existantes lors du chargement ou changement de classe/date
    useEffect(() => {
        const initialPresences = {};
        elevesDeLaClasse.forEach(eleve => {
            emploiDuTempsJour.forEach(cours => {
                const presenceExistante = toutesLesPresences.find(p =>
                    p.eleveId === eleve.id &&
                    p.classeId === cours.classeId &&
                    p.matiereId === cours.matiereId &&
                    p.date === dateSelectionnee &&
                    p.heureCours === cours.heure
                );
                if (presenceExistante) {
                    if (!initialPresences[eleve.id]) initialPresences[eleve.id] = {};
                    initialPresences[eleve.id][cours.heure] = {
                        type: presenceExistante.type,
                        justifie: presenceExistante.justifie,
                        raison: presenceExistante.raison,
                        heureArrivee: presenceExistante.heureArrivee
                    };
                }
            });
        });
        setPresencesTemp(initialPresences);
    }, [elevesDeLaClasse, emploiDuTempsJour, toutesLesPresences, dateSelectionnee]);

    const handlePresenceChange = (eleveId, heureCours, type, details = {}) => {
        setPresencesTemp(prev => ({
            ...prev,
            [eleveId]: {
                ...prev[eleveId],
                [heureCours]: {
                    type,
                    justifie: details.justifie !== undefined ? details.justifie : (prev[eleveId]?.[heureCours]?.justifie || false),
                    raison: details.raison !== undefined ? details.raison : (prev[eleveId]?.[heureCours]?.raison || ''),
                    heureArrivee: details.heureArrivee !== undefined ? details.heureArrivee : (prev[eleveId]?.[heureCours]?.heureArrivee || '')
                }
            }
        }));
    };

    const openDetailsModal = (eleve, cours, currentPresence) => {
        setPresenceDataToEdit({ eleve, cours, currentPresence });
        setModalOuvert(true);
    };

    const closeModal = () => {
        setModalOuvert(false);
        setPresenceDataToEdit(null);
    };

    const handleSavePresenceDetails = (eleveId, heureCours, type, justifie, raison, heureArrivee) => {
        handlePresenceChange(eleveId, heureCours, type, { justifie, raison, heureArrivee });
        closeModal();
    };

    const getPresenceStatus = (eleveId, heureCours) => {
        return presencesTemp[eleveId]?.[heureCours]?.type || 'Non marqué';
    };

    const getPresenceDetails = (eleveId, heureCours) => {
        return presencesTemp[eleveId]?.[heureCours];
    };

    const getStatusColorClass = (status) => {
        switch (status) {
            case 'Présent': return 'bg-acacia-100 text-acacia-800 border-acacia-200';
            case 'Absent': return 'bg-terre-100 text-terre-800 border-terre-200';
            case 'Retard': return 'bg-soleil-100 text-soleil-800 border-soleil-200';
            case 'Renvoyé': return 'bg-red-100 text-red-800 border-red-200'; // Utilisation d'une couleur rouge plus distincte
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

    const handleSaveAll = () => {
        console.log("Sauvegarde de toutes les présences pour le jour et la classe:", presencesTemp);
        // Ici, vous enverriez `presencesTemp` à votre backend pour la sauvegarde.
        // Chaque entrée dans presencesTemp[eleveId][heureCours] doit être transformée
        // en un objet de la structure `presences` définie dans donneesTemporaires.js
        // et envoyée. Pour l'exemple, nous nous contentons de loguer.
        alert('Présences sauvegardées (simulées) !');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des Présences</h1>
                    <p className="text-gray-600">Marquez les absences, retards ou renvois de vos élèves</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={handleSaveAll}
                        className="btn-primary flex items-center shadow-md hover:shadow-lg"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder tout
                    </button>
                </div>
            </div>

            {/* Filtres de classe et de date */}
            <div className="card p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label className="form-label">Classe</label>
                        <select
                            value={classeSelectionnee}
                            onChange={(e) => setClasseSelectionnee(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Sélectionner une classe</option>
                            {mesClasses.map(classe => (
                                <option key={classe.id} value={classe.id}>{classe.nom}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            value={dateSelectionnee}
                            onChange={(e) => setDateSelectionnee(e.target.value)}
                            className="input-field"
                        />
                    </div>
                </div>
            </div>

            {/* Tableau de présence */}
            {classeSelectionnee && emploiDuTempsJour.length > 0 ? (
                <div className="card table-container p-0 overflow-x-auto">
                    <table className="table">
                        <thead className="table-header">
                            <tr>
                                <th className="table-header-cell sticky left-0 bg-gray-50 z-20">Élève</th>
                                {emploiDuTempsJour.map(cours => (
                                    <th key={cours.id} className="table-header-cell text-center">
                                        <div className="font-semibold">{cours.matiere}</div>
                                        <div className="text-xs text-gray-500">{cours.heure}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {elevesDeLaClasse.map(eleve => (
                                <tr key={eleve.id} className="table-row">
                                    <td className="table-cell font-medium text-gray-900 sticky left-0 bg-white z-10">
                                        <div className="flex items-center">
                                            <img
                                                src={eleve.photo || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                                                alt={`${eleve.prenom} ${eleve.nom}`}
                                                className="h-8 w-8 rounded-full object-cover mr-3"
                                            />
                                            {eleve.prenom} {eleve.nom}
                                        </div>
                                    </td>
                                    {emploiDuTempsJour.map(cours => {
                                        const currentStatus = getPresenceStatus(eleve.id, cours.heure);
                                        const details = getPresenceDetails(eleve.id, cours.heure);

                                        return (
                                            <td key={`${eleve.id}-${cours.id}`} className="table-cell text-center">
                                                <div className="flex flex-col items-center space-y-1">
                                                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColorClass(currentStatus)}`}>
                                                        {getStatusIcon(currentStatus)}
                                                        <span className="ml-1">{currentStatus}</span>
                                                    </div>
                                                    <div className="flex space-x-1 mt-1"> {/* Ajout de marge pour les boutons */}
                                                        <button
                                                            onClick={() => handlePresenceChange(eleve.id, cours.heure, 'Présent')}
                                                            className="p-1 rounded-full text-acacia-600 hover:bg-acacia-50 transition-colors"
                                                            title="Marquer Présent"
                                                        >
                                                            <CheckCircle className="h-5 w-5" /> {/* Icône plus grande pour faciliter le clic */}
                                                        </button>
                                                        <button
                                                            onClick={() => openDetailsModal(eleve, cours, details)}
                                                            className="p-1 rounded-full text-fleuve-600 hover:bg-fleuve-50 transition-colors"
                                                            title="Détails (Absent/Retard/Renvoyé)"
                                                        >
                                                            <Info className="h-5 w-5" /> {/* Icône plus grande */}
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12 card shadow-sm">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-semibold">
                        Sélectionnez une classe et une date pour gérer les présences.
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        Seuls les cours que vous enseignez dans cette classe seront affichés.
                    </p>
                </div>
            )}

            {/* Modal pour les détails d'absence/retard/renvoi */}
            {modalOuvert && presenceDataToEdit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl animate-scale-in">
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                            <h3 className="text-lg font-medium text-gray-900">
                                Marquer {presenceDataToEdit.eleve.prenom} {presenceDataToEdit.eleve.nom}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <p className="text-sm font-medium text-gray-700">Cours :</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {presenceDataToEdit.cours.matiere} ({presenceDataToEdit.cours.heure})
                                </p>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Statut *</label>
                                <select
                                    value={presenceDataToEdit.currentPresence?.type || ''}
                                    onChange={(e) => setPresenceDataToEdit(prev => ({
                                        ...prev,
                                        currentPresence: { ...prev.currentPresence, type: e.target.value }
                                    }))}
                                    className="input-field"
                                >
                                    <option value="Présent">Présent</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Retard">Retard</option>
                                    <option value="Renvoyé">Renvoyé</option>
                                </select>
                            </div>

                            {(presenceDataToEdit.currentPresence?.type === 'Absent' || presenceDataToEdit.currentPresence?.type === 'Retard' || presenceDataToEdit.currentPresence?.type === 'Renvoyé') && (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">Raison</label>
                                        <textarea
                                            value={presenceDataToEdit.currentPresence?.raison || ''}
                                            onChange={(e) => setPresenceDataToEdit(prev => ({
                                                ...prev,
                                                currentPresence: { ...prev.currentPresence, raison: e.target.value }
                                            }))}
                                            className="input-field"
                                            rows="2"
                                        ></textarea>
                                    </div>
                                    <div className="form-group flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={presenceDataToEdit.currentPresence?.justifie || false}
                                            onChange={(e) => setPresenceDataToEdit(prev => ({
                                                ...prev,
                                                currentPresence: { ...prev.currentPresence, justifie: e.target.checked }
                                            }))}
                                            className="rounded border-gray-300 text-fleuve-600 focus:ring-fleuve-500"
                                        />
                                        <label className="form-label mb-0">Justifié</label>
                                    </div>
                                </>
                            )}
                            {presenceDataToEdit.currentPresence?.type === 'Retard' && (
                                <div className="form-group">
                                    <label className="form-label">Heure d'arrivée</label>
                                    <input
                                        type="time"
                                        value={presenceDataToEdit.currentPresence?.heureArrivee || ''}
                                        onChange={(e) => setPresenceDataToEdit(prev => ({
                                            ...prev,
                                            currentPresence: { ...prev.currentPresence, heureArrivee: e.target.value }
                                        }))}
                                        className="input-field"
                                    />
                                </div>
                            )}

                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    onClick={closeModal}
                                    className="btn-secondary"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => handleSavePresenceDetails(
                                        presenceDataToEdit.eleve.id,
                                        presenceDataToEdit.cours.heure,
                                        presenceDataToEdit.currentPresence.type,
                                        presenceDataToEdit.currentPresence.justifie,
                                        presenceDataToEdit.currentPresence.raison,
                                        presenceDataToEdit.currentPresence.heureArrivee
                                    )}
                                    className="btn-primary flex items-center"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionPresences;