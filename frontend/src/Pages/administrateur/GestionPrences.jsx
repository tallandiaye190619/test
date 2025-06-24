import {
    AlertCircle,
    ArrowLeft, // Importation de l'icône de flèche gauche
    ArrowRight // Importation de l'icône de flèche droite
    ,


    Edit,
    Eye,
    Filter,
    Info,
    Save,
    Search,
    Trash2,
    UserCheck,
    UserMinus,
    Users,
    UserX,
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

    const [modalOuvert, setModalOuvert] = useState(false); // For view/edit presence modal
    const [presenceSelectionnee, setPresenceSelectionnee] = useState(null);
    const [typeModal, setTypeModal] = useState('voir'); // 'voir', 'modifier'

    const [filterModalOpen, setFilterModalOpen] = useState(false);

    // --- NEW: State for current slide ---
    const [currentSlide, setCurrentSlide] = useState(0);

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

            const eleveName = eleve ? `${eleve.prenom} ${eleve.nom}`.toLowerCase() : '';
            const matricule = eleve?.numeroMatricule?.toLowerCase() || '';
            const matiereName = matiere?.nom?.toLowerCase() || '';

            const correspondRecherche = rechercheTexte.toLowerCase() === '' ||
                                        eleveName.includes(rechercheTexte.toLowerCase()) ||
                                        matricule.includes(rechercheTexte.toLowerCase()) ||
                                        matiereName.includes(rechercheTexte.toLowerCase());

            const correspondClasse = !filtreClasse || String(presence.classeId) === filtreClasse;
            const correspondEnseignant = !filtreEnseignant || String(presence.enseignantId) === filtreEnseignant;
            const correspondType = !filtreType || presence.type === filtreType;
            const correspondJustifie = filtreJustifie === '' || (filtreJustifie === 'oui' && presence.justifie) || (filtreJustifie === 'non' && !presence.justifie);

            const datePresence = new Date(presence.date);
            const debut = dateDebut ? new Date(dateDebut) : null;
            const fin = dateFin ? new Date(dateFin) : null;

            const correspondDate = (!debut || datePresence >= debut) && (!fin || datePresence <= fin);

            return correspondRecherche && correspondClasse && correspondEnseignant && correspondType && correspondJustifie && correspondDate;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [toutesLesPresences, eleves, enseignants, matieres, rechercheTexte, filtreClasse, filtreEnseignant, filtreType, filtreJustifie, dateDebut, dateFin]);

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

    // Define the statistics cards data
    const statsCards = [
        {
            icon: Users,
            color: 'fleuve',
            value: calculerStatistiques.total,
            label: 'Enregistrements total'
        },
        {
            icon: UserCheck,
            color: 'acacia',
            value: calculerStatistiques.presents,
            label: 'Présences marquées'
        },
        {
            icon: UserX,
            color: 'terre',
            value: calculerStatistiques.absents,
            label: `Absences (${calculerStatistiques.absentsNonJustifies} non justifiées)`
        },
        {
            icon: UserMinus,
            color: 'soleil',
            value: calculerStatistiques.retards,
            label: 'Retards'
        },
        {
            icon: AlertCircle,
            color: 'red',
            value: calculerStatistiques.renvoyes,
            label: 'Renvoyés'
        }
    ];

    // --- NEW: Navigation functions for slides ---
    const goToNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % statsCards.length);
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + statsCards.length) % statsCards.length);
    };


    const ouvrirModal = (type, presence = null) => {
        setPresenceSelectionnee(presence);
        setTypeModal(type);
        setModalOuvert(true);
    };

    const fermerModal = () => {
        setModalOuvert(false);
        setPresenceSelectionnee(null);
        setTypeModal('voir');
    };

    const handleModifierPresence = (id, updatedData) => {
        console.log(`Modification de la présence ID ${id}:`, updatedData);
        // Implement logic to update presence in your data source (API or state)
        // donnees.setPresences(prev => prev.map(p => p.id === id ? updatedData : p));
        fermerModal();
    };

    const handleSupprimerPresence = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet enregistrement de présence ?")) {
            console.log(`Suppression de la présence ID ${id}`);
            // Implement logic to delete presence from your data source (API or state)
            // donnees.setPresences(prev => prev.filter(p => p.id !== id));
            fermerModal(); // Close modal if open
        }
    };

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
            case 'Renvoyé': return <AlertCircle className="h-4 w-4" />;
            default: return <Info className="h-4 w-4" />;
        }
    };

    const PresenceDetailsModal = ({ presence, onSave, onClose, type }) => {
        const [formData, setFormData] = useState({
            ...presence,
            date: presence.date ? new Date(presence.date).toISOString().split('T')[0] : ''
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave(formData.id, formData);
        };

        const eleve = eleves.find(e => e.id === formData.eleveId);
        const classe = classes.find(c => c.id === formData.classeId);
        const matiere = matieres.find(m => m.id === formData.matiereId);
        const enseignant = enseignants.find(e => e.id === formData.enseignantId);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
                <div className="bg-white rounded-lg max-w-xl w-full p-6 shadow-xl animate-scale-in max-h-[90vh] overflow-y-auto">
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
                                    {eleve?.prenom} {eleve?.nom}
                                </p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Classe</label>
                                <p className="font-semibold text-gray-900">
                                    {classe?.nom}
                                </p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Matière</label>
                                <p className="font-semibold text-gray-900">
                                    {matiere?.nom}
                                </p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Enseignant</label>
                                <p className="font-semibold text-gray-900">
                                    {enseignant?.prenom} {enseignant?.nom}
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
                            <div className="form-group flex items-center space-x-3 mt-8">
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
                                        value={formData.raison || ''}
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
                                        value={formData.heureArrivee || ''}
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

    const FilterModal = ({ onClose, filters, setFilters, applyFilters }) => {
        const [tempFilters, setTempFilters] = useState(filters);

        const handleApply = () => {
            setFilters(tempFilters);
            applyFilters();
            onClose();
        };

        const handleClear = () => {
            setTempFilters({
                rechercheTexte: '',
                filtreClasse: '',
                filtreEnseignant: '',
                filtreType: '',
                rechercheTexte: '',
                filtreJustifie: '',
                dateDebut: '',
                dateFin: ''
            });
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
                <div className="bg-white rounded-lg w-full max-w-xs sm:max-w-md p-6 shadow-xl animate-scale-in max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4 border-b pb-3">
                        <h3 className="text-xl font-semibold text-gray-900">Filtrer les présences</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div className="relative form-group">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Rechercher élève, matricule..."
                                value={tempFilters.rechercheTexte}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, rechercheTexte: e.target.value }))}
                                className="pl-10 input-field"
                            />
                        </div>
                        <div className="form-group">
                            <select
                                value={tempFilters.filtreClasse}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, filtreClasse: e.target.value }))}
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
                                value={tempFilters.filtreEnseignant}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, filtreEnseignant: e.target.value }))}
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
                                value={tempFilters.filtreType}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, filtreType: e.target.value }))}
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
                            <select
                                value={tempFilters.filtreJustifie}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, filtreJustifie: e.target.value }))}
                                className="input-field"
                            >
                                <option value="">Justifié / Non justifié</option>
                                <option value="oui">Justifié</option>
                                <option value="non">Non justifié</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label sr-only">Date début</label>
                            <input
                                type="date"
                                value={tempFilters.dateDebut}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, dateDebut: e.target.value }))}
                                className="input-field"
                                placeholder="Date début"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label sr-only">Date fin</label>
                            <input
                                type="date"
                                value={tempFilters.dateFin}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, dateFin: e.target.value }))}
                                className="input-field"
                                placeholder="Date fin"
                            />
                        </div>
                        <div className="flex justify-end space-x-2 mt-6 border-t pt-4 border-gray-200">
                            <button type="button" onClick={handleClear} className="btn-secondary">
                                Effacer
                            </button>
                            <button type="button" onClick={handleApply} className="btn-primary flex items-center">
                                <Filter className="h-4 w-4 mr-2" /> Appliquer
                            </button>
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
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des Présences (Admin)</h1>
                    <p className="text-gray-600">Consultez et gérez tous les enregistrements de présence</p>
                </div>
            </div>

            {/* Statistiques en carrousel */}
            <div className="relative overflow-hidden w-full">
                {/* Mobile: Affiche une seule carte, défilement/navigation. Desktop: Affiche toutes les cartes. */}
                <div className="hidden lg:grid lg:grid-cols-5 gap-6"> {/* Affiché sur grand écran */}
                    {statsCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <div key={index} className={`card bg-${card.color}-50 border border-${card.color}-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg`}>
                                <div className="flex items-center">
                                    <Icon className={`h-8 w-8 text-${card.color}-600 mr-3`} />
                                    <div>
                                        <p className={`text-2xl font-bold text-${card.color}-900`}>{card.value}</p>
                                        <p className={`text-sm text-${card.color}-700`}>{card.label}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="block lg:hidden"> {/* Affiché sur petit écran */}
                    <div className="relative flex items-center justify-center">
                        {/* Bouton Précédent */}
                        <button
                            onClick={goToPrevSlide}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 z-10 shadow-md"
                            aria-label="Previous slide"
                        >
                            <ArrowLeft className="h-3 w-3" />
                        </button>

                        {/* La carte visible */}
                        {statsCards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={index}
                                    className={`card bg-${card.color}-50 border border-${card.color}-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg w-11/12 mx-auto`}
                                    style={{ display: index === currentSlide ? 'block' : 'none' }} // Only show current slide
                                >
                                    <div className="flex items-center justify-center"> {/* Centered content */}
                                        <Icon className={`h-8 w-8 text-${card.color}-600 mr-3`} />
                                        <div>
                                            <p className={`text-2xl font-bold text-${card.color}-900`}>{card.value}</p>
                                            <p className={`text-sm text-${card.color}-700`}>{card.label}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Bouton Suivant */}
                        <button
                            onClick={goToNextSlide}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 z-10 shadow-md"
                            aria-label="Next slide"
                        >
                            <ArrowRight className="h-3 w-3" />
                        </button>
                    </div>

                    {/* Indicateurs de pagination (points) */}
                    <div className="flex justify-center space-x-2 mt-4">
                        {statsCards.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2 w-2 rounded-full ${
                                    index === currentSlide ? 'bg-fleuve-600' : 'bg-gray-300 hover:bg-gray-400'
                                } transition-colors duration-200`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Filtres détaillés (Desktop) */}
            <div className="card p-6 shadow-sm hidden md:block">
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
                        <label className="form-label sr-only">Date début</label>
                        <input
                            type="date"
                            value={dateDebut}
                            onChange={(e) => setDateDebut(e.target.value)}
                            className="input-field"
                            placeholder="Date début"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label sr-only">Date fin</label>
                        <input
                            type="date"
                            value={dateFin}
                            onChange={(e) => setDateFin(e.target.value)}
                            className="input-field"
                            placeholder="Date fin"
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

            {/* Filter button for small screens */}
            <div className="block md:hidden text-center mt-4">
                <button
                    onClick={() => setFilterModalOpen(true)}
                    className="btn-secondary flex items-center justify-center mx-auto shadow-sm hover:shadow-md"
                >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrer les enregistrements
                </button>
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

            {/* Modal de détails/modification de présence */}
            {modalOuvert && presenceSelectionnee && (
                <PresenceDetailsModal
                    presence={presenceSelectionnee}
                    onSave={handleModifierPresence}
                    onClose={fermerModal}
                    type={typeModal}
                />
            )}

            {/* Filter Modal for small screens */}
            {filterModalOpen && (
                <FilterModal
                    onClose={() => setFilterModalOpen(false)}
                    filters={{ rechercheTexte, filtreClasse, filtreEnseignant, filtreType, filtreJustifie, dateDebut, dateFin }}
                    setFilters={({ rechercheTexte, filtreClasse, filtreEnseignant, filtreType, filtreJustifie, dateDebut, dateFin }) => {
                        setRechercheTexte(rechercheTexte);
                        setFiltreClasse(filtreClasse);
                        setFiltreEnseignant(filtreEnseignant);
                        setFiltreType(filtreType);
                        setFiltreJustifie(filtreJustifie);
                        setDateDebut(dateDebut);
                        setDateFin(dateFin);
                    }}
                    applyFilters={() => { /* Filters are applied by state changes */ }}
                />
            )}
        </div>
    );
};

export default GestionPresencesAdmin;