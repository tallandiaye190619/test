import {
  Download,
  Edit,
  FileText,
  Plus, // <-- AJOUTÉ: Pour le bouton Supprimer
  Save,
  School, // <-- AJOUTÉ: Pour le bouton Modifier
  Trash2,
  X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuth } from '../../context/MonContext';

const NotesBulletinsPage = () => {
  const { donnees } = useAuth(); // Supposons que donnees contient aussi des fonctions setNotes, setEleves, etc.
  const [classeSelectionneeId, setClasseSelectionneeId] = useState(null);
  const [filtreMatiere, setFiltreMatiere] = useState('');
  const [filtreTrimestre, setFiltreTrimestre] = useState('1');

  const [noteSelectionnee, setNoteSelectionnee] = useState(null); // <-- NOUVEL ÉTAT pour la note à modifier
  const [modalNoteOuvert, setModalNoteOuvert] = useState(false); // <-- NOUVEL ÉTAT pour le modal de note

  const notes = donnees.notes || [];
  const eleves = donnees.eleves || [];
  const classes = donnees.classes || [];
  const matieres = donnees.matieres || [];

  // Filtrer les notes pour la classe sélectionnée et les autres filtres
  const notesFiltrees = useMemo(() => {
    if (!classeSelectionneeId) return [];

    const nomClasseSelectionnee = classes.find(c => c.id === classeSelectionneeId)?.nom;

    return notes.filter(note => {
      const eleve = eleves.find(e => e.id === note.eleveId);
      const matiere = matieres.find(m => m.id === note.matiereId);

      const correspondClasse = eleve?.classe === nomClasseSelectionnee;
      const correspondMatiere = !filtreMatiere || matiere?.nom === filtreMatiere;
      const correspondTrimestre = !filtreTrimestre || note.trimestre.toString() === filtreTrimestre;

      return correspondClasse && correspondMatiere && correspondTrimestre;
    });
  }, [notes, eleves, classes, matieres, classeSelectionneeId, filtreMatiere, filtreTrimestre]);

  // --- Fonctions de gestion de la note (Ajout, Modification, Suppression) ---

  const ouvrirModalNote = (note = null) => {
    setNoteSelectionnee(note); // Si null, c'est pour un ajout
    setModalNoteOuvert(true);
  };

  const fermerModalNote = () => {
    setNoteSelectionnee(null);
    setModalNoteOuvert(false);
  };

  const ajouterOuModifierNote = (nouvelleNote) => {
    
    fermerModalNote();
  };



  // --- Composant FormulaireNote (Modal) ---
  const FormulaireNote = () => {
    const initialFormData = noteSelectionnee ? {
      ...noteSelectionnee,
      eleveId: noteSelectionnee.eleveId,
      matiereId: noteSelectionnee.matiereId,
      valeur: noteSelectionnee.valeur,
      type: noteSelectionnee.type,
      date: noteSelectionnee.date,
      coefficient: noteSelectionnee.coefficient,
      trimestre: noteSelectionnee.trimestre
    } : {
      eleveId: '', // L'ID de l'élève
      matiereId: '', // L'ID de la matière
      valeur: '',
      type: '',
      date: '',
      coefficient: 1, // Valeur par défaut
      trimestre: parseInt(filtreTrimestre) || 1 // Pré-rempli avec le trimestre actuel
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleSubmit = (e) => {
      e.preventDefault();
      ajouterOuModifierNote(formData);
    };

    // Filtrer les élèves par la classe sélectionnée pour le sélecteur
    const elevesDeLaClasseSelectionnee = eleves.filter(e =>
      e.classe === classes.find(c => c.id === classeSelectionneeId)?.nom
    );

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Élève *</label>
            <select
              value={formData.eleveId}
              onChange={(e) => setFormData({ ...formData, eleveId: parseInt(e.target.value) })}
              className="input-field"
              required
              disabled={!!noteSelectionnee} // Désactivé si on modifie une note existante
            >
              <option value="">Sélectionner un élève</option>
              {elevesDeLaClasseSelectionnee.map(eleve => (
                <option key={eleve.id} value={eleve.id}>{eleve.prenom} {eleve.nom}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Matière *</label>
            <select
              value={formData.matiereId}
              onChange={(e) => setFormData({ ...formData, matiereId: parseInt(e.target.value) })}
              className="input-field"
              required
              disabled={!!noteSelectionnee} // Désactivé si on modifie une note existante
            >
              <option value="">Sélectionner une matière</option>
              {matieres.map(matiere => (
                <option key={matiere.id} value={matiere.id}>{matiere.nom}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Note (sur 20) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="20"
              value={formData.valeur}
              onChange={(e) => setFormData({ ...formData, valeur: parseFloat(e.target.value) })}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Type de note *</label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="input-field"
              placeholder="Ex: Devoir, Examen, Projet"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Coefficient *</label>
            <input
              type="number"
              min="1"
              value={formData.coefficient}
              onChange={(e) => setFormData({ ...formData, coefficient: parseInt(e.target.value) })}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Trimestre *</label>
            <select
              value={formData.trimestre}
              onChange={(e) => setFormData({ ...formData, trimestre: parseInt(e.target.value) })}
              className="input-field"
              required
            >
              <option value="1">1er Trimestre</option>
              <option value="2">2ème Trimestre</option>
              <option value="3">3ème Trimestre</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date de la note *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field"
              required
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
          <button type="button" onClick={fermerModalNote} className="btn-secondary shadow-sm hover:shadow-md">
            Annuler
          </button>
          <button type="submit" className="btn-primary flex items-center shadow-md hover:shadow-lg">
            <Save className="h-4 w-4 mr-2" />
            {noteSelectionnee ? 'Modifier la note' : 'Ajouter la note'}
          </button>
        </div>
      </form>
    );
  };

  // --- Composant de vue des Notes (mise à jour pour inclure les actions) ---
  const VueNotes = () => (
    <div className="card p-0 shadow-sm">
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Élève</th>
              <th className="table-header-cell">Matière</th>
              <th className="table-header-cell">Note</th>
              <th className="table-header-cell">Type</th>
              <th className="table-header-cell">Date</th>
              <th className="table-header-cell text-right">Actions</th> {/* Nouvelle colonne Actions */}
            </tr>
          </thead>
          <tbody className="table-body">
            {notesFiltrees.length > 0 ? (
              notesFiltrees.map((note) => {
                const eleve = eleves.find(e => e.id === note.eleveId);
                const matiere = matieres.find(m => m.id === note.matiereId);

                return (
                  <tr key={note.id} className="table-row">
                    <td className="table-cell">
                      <div className="text-sm font-medium text-gray-900">
                        {eleve?.prenom} {eleve?.nom}
                      </div>
                    </td>
                    <td className="table-cell">{matiere?.nom}</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                        note.valeur >= 16 ? 'bg-acacia-100 text-acacia-800 border-acacia-200' :
                        note.valeur >= 14 ? 'bg-fleuve-100 text-fleuve-800 border-fleuve-200' :
                        note.valeur >= 10 ? 'bg-soleil-100 text-soleil-800 border-soleil-200' :
                        'bg-terre-100 text-terre-800 border-terre-200'
                      }`}>
                        {note.valeur}/20
                      </span>
                    </td>
                    <td className="table-cell">{note.type}</td>
                    <td className="table-cell">{new Date(note.date).toLocaleDateString('fr-FR')}</td>
                    <td className="table-cell text-right font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => ouvrirModalNote(note)} // <-- Ouvre le modal pour modifier
                          className="p-2 rounded-full text-soleil-600 hover:bg-soleil-50 hover:text-soleil-800 transition-colors duration-200"
                          title="Modifier la note"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          
                          className="p-2 rounded-full text-terre-600 hover:bg-terre-50 hover:text-terre-800 transition-colors duration-200"
                          title="Supprimer la note"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
                <tr className="text-center">
                    <td colSpan="6" className="py-12 text-gray-500">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Aucune note trouvée pour cette sélection.</p>
                        <p className="text-gray-400 text-sm mt-2">Veuillez ajuster les filtres ou ajouter des notes.</p>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --- Rendu principal du composant ---
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Notes</h1>
          <p className="text-gray-600">Consultez les notes des élèves</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center shadow-sm hover:shadow-md">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <button
            onClick={() => ouvrirModalNote()} // <-- Bouton pour ajouter une nouvelle note
            className="btn-primary flex items-center shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une note
          </button>
        </div>
      </div>

      {!classeSelectionneeId ? (
        <div className="card p-6 shadow-lg text-center max-w-md mx-auto my-10">
          <School className="h-16 w-16 text-fleuve-500 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sélectionnez une classe pour commencer</h2>
          <p className="text-gray-600 mb-6">
            Veuillez choisir une classe pour afficher les notes.
          </p>
          <select
            value={classeSelectionneeId || ''}
            onChange={(e) => setClasseSelectionneeId(parseInt(e.target.value))}
            className="input-field w-full md:w-3/4 mx-auto block"
          >
            <option value="" disabled>-- Choisir une classe --</option>
            {classes.map(classe => (
              <option key={classe.id} value={classe.id}>{classe.nom}</option>
            ))}
          </select>
          {classes.length === 0 && (
            <p className="text-sm text-gray-500 mt-4">Aucune classe disponible. Veuillez en ajouter une.</p>
          )}
        </div>
      ) : (
        <>
          {/* Filtres */}
          <div className="card p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label sr-only">Matière</label>
                <select
                  value={filtreMatiere}
                  onChange={(e) => setFiltreMatiere(e.target.value)}
                  className="input-field"
                >
                  <option value="">Toutes les matières</option>
                  {matieres.map(matiere => (
                    <option key={matiere.id} value={matiere.nom}>{matiere.nom}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label sr-only">Trimestre</label>
                <select
                  value={filtreTrimestre}
                  onChange={(e) => setFiltreTrimestre(e.target.value)}
                  className="input-field"
                >
                  <option value="1">1er Trimestre</option>
                  <option value="2">2ème Trimestre</option>
                  <option value="3">3ème Trimestre</option>
                </select>
              </div>
              <div className="form-group flex items-center bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
                <School className="h-5 w-5 text-fleuve-600 mr-2" />
                <span className="text-gray-700 font-medium">
                  Classe: <span className="text-gray-900 font-semibold">{classes.find(c => c.id === classeSelectionneeId)?.nom}</span>
                </span>
                <button
                  onClick={() => setClasseSelectionneeId(null)}
                  className="ml-auto p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                  title="Changer de classe"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <VueNotes />
        </>
      )}

      {/* Modal d'ajout/modification de note */}
      {modalNoteOuvert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {noteSelectionnee ? 'Modifier la note' : 'Ajouter une nouvelle note'}
                </h3>
                <button
                  onClick={fermerModalNote}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
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

export default NotesBulletinsPage;