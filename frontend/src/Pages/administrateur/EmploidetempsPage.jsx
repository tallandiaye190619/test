import {
  BookOpen,
  Calendar,
  Clock,
  Edit,
  GraduationCap,
  MapPin,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext'; // Correction: Chemin du contexte

const EmploisDuTempsPage = () => { // Renommé EmploisDuTempsPage pour la cohérence
  const { donnees } = useAuth();
  const [classeSelectionnee, setClasseSelectionnee] = useState(''); // Stockera l'ID de la classe
  const [modalOuverte, setModalOuverte] = useState(false);
  const [coursSelectionne, setCours] = useState(null);
  const [typeModal, setTypeModal] = useState('');

  const emploisDuTemps = donnees.emploisDuTemps || [];
  const classes = donnees.classes || []; // Liste complète des classes (avec id et nom)
  const enseignants = donnees.enseignants || [];
  const matieres = donnees.matieres || [];

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']; // Étendu
  const heures = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
  ];

  // LOGIQUE MODIFIÉE: L'emploi du temps filtré est vide si "Toutes les classes" est sélectionné
  const emploiFiltré = classeSelectionnee
    ? emploisDuTemps.filter(cours => String(cours.classId) === String(classeSelectionnee))
    : []; // Si aucune classe sélectionnée, le tableau est vide

  const obtenirCours = (jour, heure) => {
    return emploiFiltré.find(cours => cours.jour === jour && cours.heure === heure);
  };

  const ouvrirModal = (type, cours = null) => {
    // Si ajout, pré-remplir la classId et le nom de la classe
    if (type === 'ajouter' && classeSelectionnee) {
        const classeObj = classes.find(c => c.id === parseInt(classeSelectionnee));
        setCours({ ...cours, classId: parseInt(classeSelectionnee), classe: classeObj?.nom });
    } else {
        setCours(cours);
    }
    setTypeModal(type);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setCours(null);
    setTypeModal('');
  };

  const FormulaireCours = () => {
    const [formData, setFormData] = useState(coursSelectionne || {
      classId: '', // Stocke l'ID
      jour: '',
      heure: '',
      matiere: '', // Nom de la matière
      enseignant: '', // Nom de l'enseignant
      salle: ''
    });

    const gererSoumission = (e) => {
      e.preventDefault();
      console.log('Données cours:', formData);
      // Ici, la logique d'ajout/modification utiliserait formData.classId
      fermerModal();
    };

    return (
      <form onSubmit={gererSoumission} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group"> 
            <label className="form-label"> 
              Classe *
            </label>
            <select
              value={formData.classId} // Utilise classId ici
              onChange={(e) => setFormData({...formData, classId: parseInt(e.target.value)})}
              className="input-field"
              required
            >
              <option value="">Sélectionner une classe</option>
              {classes.map(classe => (
                <option key={classe.id} value={classe.id}>{classe.nom}</option> 
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Jour *
            </label>
            <select
              value={formData.jour}
              onChange={(e) => setFormData({...formData, jour: e.target.value})}
              className="input-field"
              required
            >
              <option value="">Sélectionner un jour</option>
              {jours.map(jour => (
                <option key={jour} value={jour}>{jour}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Heure *
            </label>
            <select
              value={formData.heure}
              onChange={(e) => setFormData({...formData, heure: e.target.value})}
              className="input-field"
              required
            >
              <option value="">Sélectionner une heure</option>
              {heures.map(heure => (
                <option key={heure} value={heure}>{heure}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Matière *
            </label>
            <select
              value={formData.matiere}
              onChange={(e) => setFormData({...formData, matiere: e.target.value})}
              className="input-field"
              required
            >
              <option value="">Sélectionner une matière</option>
              {matieres.map(matiere => (
                <option key={matiere.id} value={matiere.nom}>{matiere.nom}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Enseignant *
            </label>
            <select
              value={formData.enseignant}
              onChange={(e) => setFormData({...formData, enseignant: e.target.value})}
              className="input-field"
              required
            >
              <option value="">Sélectionner un enseignant</option>
              {enseignants.map(enseignant => (
                <option key={enseignant.id} value={`${enseignant.prenom} ${enseignant.nom}`}>
                  {enseignant.prenom} {enseignant.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Salle
            </label>
            <input
              type="text"
              value={formData.salle}
              onChange={(e) => setFormData({...formData, salle: e.target.value})}
              className="input-field"
              placeholder="Salle 101"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={fermerModal} className="btn-secondary">
            Annuler
          </button>
          <button type="submit" className="btn-primary">
            {typeModal === 'ajouter' ? 'Ajouter' : 'Modifier'}
          </button>
        </div>
      </form>
    );
  };

  // Fonction utilitaire pour obtenir le nom de la classe à partir de son ID
  const getClassNameById = (classId) => {
      return classes.find(c => c.id === classId)?.nom || 'Classe inconnue';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emplois du Temps</h1>
          <p className="text-gray-600">Gérez les emplois du temps des classes</p>
        </div>
        <button
          onClick={() => ouvrirModal('ajouter')}
          className="btn-primary flex items-center shadow-md hover:shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un cours
        </button>
      </div>

      {/* Sélection de classe */}
      <div className="card p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <Calendar className="h-6 w-6 text-fleuve-600" />
          <select
            value={classeSelectionnee}
            onChange={(e) => setClasseSelectionnee(e.target.value)}
            className="input-field max-w-xs" 
          >
            <option value="">Sélectionner une classe</option>
            {classes.map(classe => (
              <option key={classe.id} value={classe.id}>{classe.nom}</option> 
            ))}
          </select>
        </div>
      </div>

      {/* Grille de l'emploi du temps - Affichage conditionnel */}
      {classeSelectionnee ? ( // Affiche la grille seulement si une classe est sélectionnée
        <div className="card table-container p-0 overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">
                  Heures
                </th>
                {jours.map(jour => (
                  <th key={jour} className="table-header-cell text-center">
                    {jour}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="table-body">
              {heures.map(heure => (
                <tr key={heure} className="table-row">
                  <td className="table-cell font-medium text-gray-900 bg-gray-50 border-r border-gray-200">
                    {heure}
                  </td>
                  {jours.map(jour => {
                    const cours = obtenirCours(jour, heure);
                    return (
                      <td key={`${jour}-${heure}`} className="px-2 py-3 text-center">
                        {cours ? (
                          <div 
                            className="bg-fleuve-100 border border-fleuve-200 rounded-lg p-2 cursor-pointer hover:bg-fleuve-200 transition-colors duration-200 shadow-sm hover:shadow-md"
                            onClick={() => ouvrirModal('voir', cours)}
                          >
                            <div className="text-xs font-medium text-fleuve-900">
                              {cours.matiere}
                            </div>
                            <div className="text-xs text-fleuve-700">
                              {cours.enseignant}
                            </div>
                            <div className="text-xs text-fleuve-600">
                              {cours.salle}
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => ouvrirModal('ajouter', { jour, heure, classId: parseInt(classeSelectionnee) })} // Passe classId au lieu de classe nom
                            className="w-full h-16 border-2 border-dashed border-gray-300 rounded-lg hover:border-fleuve-400 hover:bg-fleuve-50 transition-colors duration-200 flex items-center justify-center"
                          >
                            <Plus className="h-4 w-4 text-gray-400" />
                          </button>
                        )}
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
            <p className="text-gray-500 text-lg font-semibold">Sélectionnez une classe pour afficher l'emploi du temps.</p>
            <p className="text-gray-400 text-sm mt-2">Utilisez le menu déroulant ci-dessus pour choisir une classe spécifique.</p>
        </div>
      )}


      {/* Modal */}
      {modalOuverte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {typeModal === 'ajouter' && 'Ajouter un cours'}
                  {typeModal === 'modifier' && 'Modifier le cours'}
                  {typeModal === 'voir' && 'Détails du cours'}
                </h3>
                <button
                  onClick={fermerModal}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title="Fermer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {typeModal === 'voir' ? (
                <div className="space-y-4 fade-in">
                  <div className="text-center bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
                    <BookOpen className="h-12 w-12 text-fleuve-600 mx-auto mb-4" />
                    <h4 className="text-2xl font-bold text-gray-900">{coursSelectionne?.matiere}</h4>
                    <p className="text-gray-600">{getClassNameById(coursSelectionne?.classId)}</p> {/* Affiche le nom de la classe */}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <Calendar className="h-6 w-6 text-fleuve-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">{coursSelectionne?.jour}</p>
                      <p className="text-sm text-gray-600">Jour</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <Clock className="h-6 w-6 text-acacia-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">{coursSelectionne?.heure}</p>
                      <p className="text-sm text-gray-600">Heure</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <GraduationCap className="h-6 w-6 text-soleil-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">{coursSelectionne?.enseignant}</p>
                      <p className="text-sm text-gray-600">Enseignant</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <MapPin className="h-6 w-6 text-terre-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">{coursSelectionne?.salle}</p>
                      <p className="text-sm text-gray-600">Salle</p>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-3 mt-6">
                    <button
                      onClick={() => {
                        ouvrirModal('modifier', coursSelectionne); // Ouvre en mode modifier avec les données actuelles
                      }}
                      className="btn-primary flex items-center shadow-sm hover:shadow-md"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </button>
                    <button className="btn-secondary text-terre-600 hover:bg-terre-50 flex items-center shadow-sm hover:shadow-md">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </button>
                  </div>
                </div>
              ) : (
                <FormulaireCours />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmploisDuTempsPage;