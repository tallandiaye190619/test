import {
    AlertCircle, // Pour les renvois
    Download // Pour exporter
    , // Pour les détails
    FileText, // Pour les récapitulatifs
    Filter, // Renvoyé
    Info, // Absent
    UserCheck, // Présent
    UserMinus, // Retard
    UserPlus,
    UserX
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuth } from '../../context/MonContext';

const MesAbsences = () => {
    const { utilisateur, donnees } = useAuth();
    const [filtreType, setFiltreType] = useState(''); // 'Absent', 'Retard', 'Renvoyé'
    const [filtreJustifie, setFiltreJustifie] = useState(''); // 'oui', 'non', '' (tous)
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');

    // Données brutes du contexte
    const toutesLesPresences = donnees.presences || [];
    const matieres = donnees.matieres || [];
    const enseignants = donnees.enseignants || [];

    // Filtrer les présences pour l'élève connecté
    const mesPresences = useMemo(() => {
        if (!utilisateur?.id) return [];
        return toutesLesPresences.filter(p => p.eleveId === utilisateur.id);
    }, [toutesLesPresences, utilisateur]);

    const presencesFiltrees = useMemo(() => {
        return mesPresences.filter(presence => {
            const correspondType = !filtreType || presence.type === filtreType;
            const correspondJustifie = filtreJustifie === '' || (filtreJustifie === 'oui' && presence.justifie) || (filtreJustifie === 'non' && !presence.justifie);

            const datePresence = new Date(presence.date);
            const debut = dateDebut ? new Date(dateDebut) : null;
            const fin = dateFin ? new Date(dateFin) : null;

            const correspondDate = (!debut || datePresence >= debut) && (!fin || datePresence <= fin);

            return correspondType && correspondJustifie && correspondDate;
        }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Tri par date décroissante
    }, [mesPresences, filtreType, filtreJustifie, dateDebut, dateFin]);

    const calculerStatistiques = useMemo(() => {
        const totalEvenementsNonPresents = mesPresences.filter(p => p.type !== 'Présent').length;
        const absents = mesPresences.filter(p => p.type === 'Absent').length;
        const retards = mesPresences.filter(p => p.type === 'Retard').length;
        const renvoyes = mesPresences.filter(p => p.type === 'Renvoyé').length;

        const absentsJustifies = mesPresences.filter(p => p.type === 'Absent' && p.justifie).length;
        const absentsNonJustifies = absents - absentsJustifies;

        return {
            totalEvenementsNonPresents,
            absents,
            retards,
            renvoyes,
            absentsJustifies,
            absentsNonJustifies,
        };
    }, [mesPresences]);

    const getStatusColorClass = (status) => {
        switch (status) {
            case 'Présent': return 'bg-acacia-100 text-acacia-800 border border-acacia-200';
            case 'Absent': return 'bg-terre-100 text-terre-800 border border-terre-200';
            case 'Retard': return 'bg-soleil-100 text-soleil-800 border border-soleil-200';
            case 'Renvoyé': return 'bg-red-100 text-red-800 border border-red-200';
            default: return 'bg-gray-100 text-gray-700 border border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Présent': return <UserCheck className="h-4 w-4" />;
            case 'Absent': return <UserX className="h-4 w-4" />;
            case 'Retard': return <UserMinus className="h-4 w-4" />;
            case 'Renvoyé': return <UserPlus className="h-4 w-4" />;
            default: return <Info className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mes Absences et Retards</h1>
                    <p className="text-gray-600">Consultez l'historique de vos présences en classe</p>
                </div>
                <button className="btn-secondary flex items-center shadow-sm hover:shadow-md">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter mon relevé
                </button>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card bg-terre-50 border border-terre-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
                    <div className="flex items-center">
                        <UserX className="h-8 w-8 text-terre-600 mr-3" />
                        <div>
                            <p className="text-2xl font-bold text-terre-900">{calculerStatistiques.absents}</p>
                            <p className="text-sm text-terre-700">Absences (dont {calculerStatistiques.absentsNonJustifies} NJ)</p>
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
                <div className="card bg-fleuve-50 border border-fleuve-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
                    <div className="flex items-center">
                        <FileText className="h-8 w-8 text-fleuve-600 mr-3" />
                        <div>
                            <p className="text-2xl font-bold text-fleuve-900">{calculerStatistiques.totalEvenementsNonPresents}</p>
                            <p className="text-sm text-fleuve-700">Total événements</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtres détaillés */}
            <div className="card p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Filtrer l'historique</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="form-group">
                        <select
                            value={filtreType}
                            onChange={(e) => setFiltreType(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Tous les types</option>
                            <option value="Absent">Absent</option>
                            <option value="Retard">Retard</option>
                            <option value="Renvoyé">Renvoyé</option>
                            <option value="Présent">Présent</option> {/* L'élève peut aussi voir ses présences */}
                        </select>
                    </div>
                    <div className="form-group">
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
                    <div className="form-group md:col-span-2 lg:col-span-1"> {/* Occupe toute la largeur sur mobile, une colonne sur lg */}
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
                            <th className="table-header-cell">Date</th>
                            <th className="table-header-cell">Cours (Heure)</th>
                            <th className="table-header-cell">Matière</th>
                            <th className="table-header-cell">Enseignant</th>
                            <th className="table-header-cell">Statut</th>
                            <th className="table-header-cell">Détails</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {presencesFiltrees.length > 0 ? (
                            presencesFiltrees.map(presence => {
                                const matiere = matieres.find(m => m.id === presence.matiereId);
                                const enseignant = enseignants.find(e => e.id === presence.enseignantId);

                                return (
                                    <tr key={presence.id} className="table-row">
                                        <td className="table-cell">{new Date(presence.date).toLocaleDateString('fr-FR')}</td>
                                        <td className="table-cell">{presence.heureCours}</td>
                                        <td className="table-cell">{matiere?.nom || 'N/A'}</td>
                                        <td className="table-cell">{enseignant?.prenom} {enseignant?.nom || 'N/A'}</td>
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
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-12 text-center text-gray-500">
                                    <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    Aucun enregistrement de présence trouvé pour cette sélection.
                                    <p className="text-gray-400 text-sm mt-2">
                                        Votre historique est vide ou ne correspond pas aux filtres.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MesAbsences;