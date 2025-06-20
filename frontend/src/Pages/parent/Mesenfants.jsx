import {
  BookOpen,
  Calendar,
  Eye, // Pour les salles de classe
  GraduationCap, // Pour le téléphone
  Mail // Pour l'email
  , // Pour l'emploi du temps
  MapPin, // Pour les infos de l'élève
  Phone,
  School,
  Search,
  Users,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext';

const MesEnfants = () => {
  const { donnees } = useAuth();
  const [rechercheTexte, setRechercheTexte] = useState('');

  // États pour les modals
  const [modalEmploiDuTempsOuvert, setModalEmploiDuTempsOuvert] = useState(false);
  const [modalProfilOuvert, setModalProfilOuvert] = useState(false);
  const [enfantSelectionneModal, setEnfantSelectionneModal] = useState(null);

  const mesEnfants = donnees.enfants || [];
  const tousLesEmploisDuTemps = donnees.emploisDuTemps || [];
  const toutesLesMatieres = donnees.matieres || []; // Pour les noms des matières dans l'emploi du temps

  const enfantsFiltres = mesEnfants.filter(enfant =>
    enfant.prenom?.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
    enfant.nom?.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
    enfant.classe?.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
    enfant.numeroMatricule?.toLowerCase().includes(rechercheTexte.toLowerCase())
  );

  // Fonctions pour ouvrir/fermer les modals spécifiques
  const openEmploiDuTempsModal = (enfant) => {
      setEnfantSelectionneModal(enfant);
      setModalEmploiDuTempsOuvert(true);
  };
  const closeEmploiDuTempsModal = () => {
      setModalEmploiDuTempsOuvert(false);
      setEnfantSelectionneModal(null);
  };

  const openProfilModal = (enfant) => {
      setEnfantSelectionneModal(enfant);
      setModalProfilOuvert(true);
  };
  const closeProfilModal = () => {
      setModalProfilOuvert(false);
      setEnfantSelectionneModal(null);
  };

  // --- Composant Modal Emploi du Temps ---
  const ModalEmploiDuTemps = () => {
    if (!enfantSelectionneModal) return null;

    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const heures = [
      '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
      '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
    ];

    const emploiDuTempsEnfant = tousLesEmploisDuTemps.filter(cours => cours.classe === enfantSelectionneModal.classe);

    const obtenirCours = (jour, heure) => {
      return emploiDuTempsEnfant.find(cours => cours.jour === jour && cours.heure === heure);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4 border-b pb-4">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <BookOpen className="h-6 w-6 mr-2 text-fleuve-600" />
                            Emploi du Temps de {enfantSelectionneModal.prenom} {enfantSelectionneModal.nom}
                        </h3>
                        <button onClick={closeEmploiDuTempsModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="table-container max-h-96 overflow-y-auto custom-scrollbar border border-gray-200 rounded-lg shadow-sm">
                        <table className="table min-w-full">
                            <thead className="table-header sticky top-0">
                                <tr>
                                    <th className="table-header-cell w-28">Heures</th>
                                    {jours.map(jour => (
                                        <th key={jour} className="table-header-cell text-center">{jour}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {heures.map(heure => (
                                    <tr key={heure} className="table-row">
                                        <td className="table-cell font-semibold text-gray-900 bg-gray-50 border-r border-gray-200 sticky left-0 z-10 w-28">
                                            {heure}
                                        </td>
                                        {jours.map(jour => {
                                            const cours = obtenirCours(jour, heure);
                                            return (
                                                <td key={`${jour}-${heure}`} className="px-2 py-3 text-center align-top">
                                                    {cours ? (
                                                        <div className="bg-fleuve-100 border border-fleuve-200 rounded-lg p-2 h-full flex flex-col justify-between items-center text-center">
                                                            <div className="text-xs font-bold text-fleuve-900 mb-1">{cours.matiere}</div>
                                                            <div className="text-xs text-fleuve-700 flex items-center justify-center">
                                                                <GraduationCap className="h-3 w-3 mr-1" />{cours.enseignant}
                                                            </div>
                                                            <div className="text-xs text-fleuve-600 flex items-center justify-center mt-1">
                                                                <MapPin className="h-3 w-3 mr-1" />{cours.salle}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50 text-gray-400">
                                                            <span className="text-xs">Libre</span>
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {emploiDuTempsEnfant.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Aucun emploi du temps disponible pour la classe de {enfantSelectionneModal.prenom}.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
  };

  // --- Composant Modal Profil ---
  const ModalProfil = () => {
    if (!enfantSelectionneModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4 border-b pb-4">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <Users className="h-6 w-6 mr-2 text-fleuve-600" />
                            Profil de {enfantSelectionneModal.prenom} {enfantSelectionneModal.nom}
                        </h3>
                        <button onClick={closeProfilModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
                            <img
                                src={enfantSelectionneModal.photo || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                                alt={`${enfantSelectionneModal.prenom} ${enfantSelectionneModal.nom}`}
                                className="h-24 w-24 rounded-full object-cover border-2 border-fleuve-300 shadow-md"
                            />
                            <div className="text-center sm:text-left">
                                <h4 className="text-2xl font-bold text-gray-900">{enfantSelectionneModal.prenom} {enfantSelectionneModal.nom}</h4>
                                <p className="text-gray-600 text-lg">{enfantSelectionneModal.numeroMatricule}</p>
                                <span className={`inline-flex mt-2 px-3 py-1 text-sm font-semibold rounded-full border ${
                                    enfantSelectionneModal.statut === 'actif' ? 'bg-acacia-100 text-acacia-800 border-acacia-200' : 'bg-terre-100 text-terre-800 border-terre-200'
                                }`}>
                                    {enfantSelectionneModal.statut === 'actif' ? 'Actif' : 'Inactif'}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <p className="text-sm font-medium text-gray-700">Classe</p>
                                <p className="text-base text-gray-900 font-semibold flex items-center">
                                    <School className="h-4 w-4 mr-2 text-fleuve-600" />
                                    {enfantSelectionneModal.classe}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <p className="text-sm font-medium text-gray-700">Date de naissance</p>
                                <p className="text-base text-gray-900 flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-soleil-600" />
                                    {new Date(enfantSelectionneModal.dateNaissance).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <p className="text-sm font-medium text-gray-700">Téléphone Parent</p>
                                <p className="text-base text-gray-900 flex items-center">
                                    <Phone className="h-4 w-4 mr-2 text-acacia-600" />
                                    {enfantSelectionneModal.telephoneParent}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <p className="text-sm font-medium text-gray-700">Email Parent</p>
                                <p className="text-base text-gray-900 flex items-center">
                                    <Mail className="h-4 w-4 mr-2 text-terre-600" />
                                    {enfantSelectionneModal.emailParent}
                                </p>
                            </div>
                        </div>
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
          <h1 className="text-2xl font-bold text-gray-900">Mes Enfants</h1>
          <p className="text-gray-600">Visualisez et suivez les informations de vos enfants</p>
        </div>
      </div>

      {/* Recherche */}
      <div className="card p-6 shadow-sm">
        <div className="relative form-group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher un enfant par nom, classe, matricule..."
            value={rechercheTexte}
            onChange={(e) => setRechercheTexte(e.target.value)}
            className="pl-10 input-field"
          />
        </div>
      </div>

      {/* Liste des enfants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enfantsFiltres.length > 0 ? (
          enfantsFiltres.map((enfant) => (
            <div key={enfant.id} className="card p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={enfant.photo || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                  alt={`${enfant.prenom} ${enfant.nom}`}
                  className="h-16 w-16 rounded-full object-cover border-2 border-fleuve-200 shadow-sm"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{enfant.prenom} {enfant.nom}</h3>
                  <p className="text-gray-600">
                    <span className="font-medium text-fleuve-700">{enfant.classe}</span> - {enfant.numeroMatricule}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-soleil-600" />
                  <span>Né(e) le: {new Date(enfant.dateNaissance).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center">
                  <School className="h-4 w-4 mr-2 text-acacia-600" />
                  <span>Statut: <span className={`font-semibold ${enfant.statut === 'actif' ? 'text-acacia-600' : 'text-terre-600'}`}>{enfant.statut}</span></span>
                </div>
              </div>

              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => openEmploiDuTempsModal(enfant)} // Nouveau bouton pour Emploi du temps
                  className="btn-secondary flex items-center justify-center shadow-sm hover:shadow-md py-2.5 px-4"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Emploi du temps
                </button>
                <button
                  onClick={() => openProfilModal(enfant)} // Nouveau bouton pour le Profil
                  className="btn-primary flex items-center justify-center shadow-md hover:shadow-lg py-2.5 px-4"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Voir le profil complet
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="lg:col-span-3 text-center py-12">
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

      {/* Rendu conditionnel des Modals */}
      {modalEmploiDuTempsOuvert && <ModalEmploiDuTemps />}
      {modalProfilOuvert && <ModalProfil />}

    </div>
  );
};

export default MesEnfants;