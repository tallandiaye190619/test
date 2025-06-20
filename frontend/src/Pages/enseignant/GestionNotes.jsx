import {
  BookOpen,
  Plus,
  Save, // Ajout d'icône pour les notes
  UserCircle,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext';

const GestionNotes = () => {
  const { utilisateur, donnees } = useAuth();
  const [classeSelectionnee, setClasseSelectionnee] = useState('');
  const [matiereSelectionnee, setMatiereSelectionnee] = useState(''); // Cette variable est déjà définie
  const [trimestreSelectionne, setTrimestreSelectionne] = useState('1');
  const [modalOuverte, setModalOuverte] = useState(false);
  const [noteSelectionnee, setNoteSelectionnee] = useState(null);

  // Assurez-vous que donnees.classes et donnees.eleves sont des tableaux
  const mesClasses = donnees.classes || []; // Ces classes devraient déjà être filtrées pour l'enseignant
  const eleves = donnees.eleves || [];
  const notes = donnees.notes || [];
  const matieres = donnees.matieres || [];

  const elevesClasse = classeSelectionnee ? 
    eleves.filter(e => e.classe === classeSelectionnee) : [];

  const obtenirNoteEleve = (eleveId, matiereId, trimestre) => {
    return notes.find(n => 
      n.eleveId === eleveId && 
      n.matiereId === matiereId && 
      n.trimestre === parseInt(trimestre)
    );
  };

  const ouvrirModalNote = (eleve, matierePourNote = null) => { // Renommé pour éviter conflit avec matiereSelectionnee
    const matiereObj = matierePourNote || (matiereSelectionnee ? matieres.find(m => m.id.toString() === matiereSelectionnee) : null);

    const noteExistante = matiereObj ?
      obtenirNoteEleve(eleve.id, matiereObj.id, trimestreSelectionne) : null;
    
    setNoteSelectionnee({
      eleve,
      matiere: matiereObj, // Passe l'objet matière complet
      note: noteExistante || {
        eleveId: eleve.id,
        matiereId: matiereObj?.id || '',
        trimestre: parseInt(trimestreSelectionne),
        valeur: '',
        type: 'Devoir',
        date: new Date().toISOString().split('T')[0]
      }
    });
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setNoteSelectionnee(null);
  };

  const FormulaireNote = () => {
    const [formData, setFormData] = useState(noteSelectionnee?.note || {});

    const gererSoumission = (e) => {
      e.preventDefault();
      console.log('Sauvegarde note:', formData);
      // Ici, vous implémenteriez la logique de sauvegarde (ajout ou mise à jour de la note)
      fermerModal();
    };

    return (
      <form onSubmit={gererSoumission} className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 mb-6 shadow-inner"> {/* Fond et bordure stylisés */}
          <h4 className="font-semibold text-gray-900 text-lg flex items-center">
            <UserCircle className="h-6 w-6 mr-2 text-fleuve-600" /> {/* Icône pour l'élève */}
            {noteSelectionnee?.eleve.prenom} {noteSelectionnee?.eleve.nom}
          </h4>
          <p className="text-sm text-gray-600 ml-8">{noteSelectionnee?.eleve.classe} - Trimestre {trimestreSelectionne}</p>
          {noteSelectionnee?.matiere && (
            <p className="text-base text-gray-800 ml-8 mt-2">
                **Matière:** <span className="font-medium text-fleuve-700">{noteSelectionnee.matiere.nom}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Matière *</label>
            <select
              value={formData.matiereId}
              onChange={(e) => setFormData({...formData, matiereId: parseInt(e.target.value)})}
              className="input-field"
              required
              disabled={noteSelectionnee?.matiere !== null} // Désactive si la matière est déjà définie
            >
              <option value="">Sélectionner une matière</option>
              {matieres.map(matiere => (
                <option key={matiere.id} value={matiere.id}>{matiere.nom}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Note /20 *</label>
            <input
              type="number"
              value={formData.valeur}
              onChange={(e) => setFormData({...formData, valeur: parseFloat(e.target.value)})}
              className="input-field"
              min="0"
              max="20"
              step="0.5"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Type d'évaluation *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="input-field"
              required
            >
              <option value="Devoir">Devoir</option>
              <option value="Composition">Composition</option>
              <option value="Interrogation">Interrogation</option>
              <option value="Participation">Participation</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
          <button type="button" onClick={fermerModal} className="btn-secondary shadow-sm hover:shadow-md">
            Annuler
          </button>
          <button type="submit" className="btn-primary flex items-center shadow-md hover:shadow-lg">
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Notes</h1>
          <p className="text-gray-600">Saisissez et gérez les notes de vos élèves</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="card p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label className="form-label">Classe</label>
            <select
              value={classeSelectionnee}
              onChange={(e) => setClasseSelectionnee(e.target.value)}
              className="input-field"
            >
              <option value="">Sélectionner une classe</option>
              {mesClasses.map(classe => (
                <option key={classe.id} value={classe.nom}>{classe.nom}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Matière</label>
            <select
              value={matiereSelectionnee}
              onChange={(e) => setMatiereSelectionnee(e.target.value)}
              className="input-field"
            >
              <option value="">Toutes les matières</option>
              {matieres.map(matiere => (
                <option key={matiere.id} value={matiere.id}>{matiere.nom}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Trimestre</label>
            <select
              value={trimestreSelectionne}
              onChange={(e) => setTrimestreSelectionne(e.target.value)}
              className="input-field"
            >
              <option value="1">1er Trimestre</option>
              <option value="2">2ème Trimestre</option>
              <option value="3">3ème Trimestre</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des élèves et notes */}
      {classeSelectionnee ? (
        <div className="card p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Élèves de {classeSelectionnee} ({elevesClasse.length})
            </h3>
          </div>

          <div className="space-y-4">
            {elevesClasse.length > 0 ? (
              elevesClasse.map((eleve) => (
                <div key={eleve.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                    {eleve.photo ? (
                      <img
                        src={eleve.photo}
                        alt={`${eleve.prenom} ${eleve.nom}`}
                        className="h-12 w-12 rounded-full object-cover shadow-sm"
                      />
                    ) : (
                      <UserCircle className="h-12 w-12 text-gray-400" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">
                        {eleve.prenom} {eleve.nom}
                      </div>
                      <div className="text-sm text-gray-500">
                        {eleve.numeroMatricule}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
                    {/* Affichage des notes par matière */}
                    {matieres.filter(m => matiereSelectionnee === '' || m.id.toString() === matiereSelectionnee).map((matiere) => {
                      const note = obtenirNoteEleve(eleve.id, matiere.id, trimestreSelectionne);
                      const couleurNote = note?.valeur >= 16 ? 'text-acacia-600' :
                                          note?.valeur >= 14 ? 'text-fleuve-600' :
                                          note?.valeur >= 10 ? 'text-soleil-600' :
                                          'text-terre-600';
                      return (
                        <div key={matiere.id} className="text-center p-2 rounded-md border border-gray-200 bg-white shadow-sm flex-shrink-0 min-w-[70px]">
                          <div className="text-xs text-gray-500 font-semibold">{matiere.code}</div>
                          <div className={`text-lg font-bold ${couleurNote}`}>
                            {note ? `${note.valeur}/20` : '-'}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {note?.type || 'N/A'}
                          </div>
                        </div>
                      );
                    })}

                    <button
                      onClick={() => ouvrirModalNote(eleve, matiereSelectionnee ? matieres.find(m => m.id.toString() === matiereSelectionnee) : null)}
                      className="btn-primary flex items-center shadow-md hover:shadow-lg flex-shrink-0"
                      title="Ajouter/Modifier la note"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Note
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun élève trouvé dans cette classe ou pour la matière sélectionnée.</p>
                <p className="text-gray-400 text-sm mt-2">Veuillez ajuster vos filtres.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Sélectionnez une classe et une matière pour gérer les notes.</p>
          <p className="text-gray-400 text-sm mt-2">Utilisez les filtres ci-dessus.</p>
        </div>
      )}

      {/* Modal */}
      {modalOuverte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in"> {/* Taille du modal ajustée à max-w-xl */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Ajouter/Modifier une note
                </h3>
                <button
                  onClick={fermerModal}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title="Fermer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <FormulaireNote />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionNotes;