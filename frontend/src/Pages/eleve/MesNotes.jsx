import {
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  Download,
  FileText,
  GraduationCap,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext';

const MesNotes = () => {
  const { utilisateur, donnees } = useAuth();
  const [trimestreSelectionne, setTrimestreSelectionne] = useState('1');
  const [matiereFiltre, setMatiereFiltre] = useState('');

  const notes = donnees.notes || [];
  const matieres = donnees.matieres || [];
  const eleveActuel = utilisateur;

  const notesPourAffichage = notes.filter(note =>
    note.eleveId === eleveActuel.id &&
    note.trimestre === parseInt(trimestreSelectionne)
  );

  const calculerMoyenneMatiere = (matiereId) => {
    const notesMatiere = notesPourAffichage.filter(n => n.matiereId === matiereId);
    if (notesMatiere.length === 0) return null;
    
    const totalPondere = notesMatiere.reduce((sum, note) => sum + (note.valeur * (note.coefficient || 1)), 0);
    const totalCoefficients = notesMatiere.reduce((sum, note) => sum + (note.coefficient || 1), 0);
    
    return totalCoefficients > 0 ? (totalPondere / totalCoefficients) : 0;
  };

  const calculerMoyenneGenerale = () => {
    const moyennesMatiere = matieres.map(matiere => {
      const moyenne = calculerMoyenneMatiere(matiere.id);
      return moyenne !== null ? { moyenne, coefficient: matiere.coefficient } : null;
    }).filter(Boolean);

    if (moyennesMatiere.length === 0) return 0;

    const totalMoyennePonderee = moyennesMatiere.reduce((sum, m) => sum + (m.moyenne * m.coefficient), 0);
    const totalCoefficients = moyennesMatiere.reduce((sum, m) => sum + m.coefficient, 0);

    return totalCoefficients > 0 ? (totalMoyennePonderee / totalCoefficients) : 0;
  };

  const moyenneGenerale = calculerMoyenneGenerale();

  const obtenirMention = (moyenne) => {
    if (moyenne >= 16) return { mention: 'Très Bien', couleur: 'text-acacia-600', bg: 'bg-acacia-100', border: 'border-acacia-200' };
    if (moyenne >= 14) return { mention: 'Bien', couleur: 'text-fleuve-600', bg: 'bg-fleuve-100', border: 'border-fleuve-200' };
    if (moyenne >= 12) return { mention: 'Assez Bien', couleur: 'text-soleil-600', bg: 'bg-soleil-100', border: 'border-soleil-200' };
    if (moyenne >= 10) return { mention: 'Passable', couleur: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-200' };
    return { mention: 'Insuffisant', couleur: 'text-terre-600', bg: 'bg-terre-100', border: 'border-terre-200' };
  };

  const mentionGenerale = obtenirMention(moyenneGenerale);

  const obtenirEvolutionNote = (matiereId) => {
    if (parseInt(trimestreSelectionne) === 1) return null;
    
    const trimestrePrecedent = parseInt(trimestreSelectionne) - 1;
    const moyenneActuelle = calculerMoyenneMatiere(matiereId);
    
    const notesPrecedentes = notes.filter(n => 
      n.eleveId === eleveActuel.id &&
      n.matiereId === matiereId &&
      n.trimestre === trimestrePrecedent
    );
    
    if (notesPrecedentes.length === 0 || moyenneActuelle === null) return null;
    
    const totalPrecPondere = notesPrecedentes.reduce((sum, note) => sum + (note.valeur * (note.coefficient || 1)), 0);
    const totalCoeffPrec = notesPrecedentes.reduce((sum, note) => sum + (note.coefficient || 1), 0);
    const moyennePrecedente = totalCoeffPrec > 0 ? (totalPrecPondere / totalCoeffPrec) : 0;
    
    const evolution = moyenneActuelle - moyennePrecedente;
    return evolution;
  };
    
  const classeEleve = donnees.classes?.find(c => c.nom === utilisateur?.classe); // Assurez-vous que utilisateur.classe existe
  const effectifClasseReel = donnees.eleves?.filter(e => e.classe === utilisateur?.classe).length;
  // Le rang est complexe à calculer sans les notes de tous les élèves de la classe
  const rangSimule = 'N/A'; // Conserver N/A ou une valeur fixe pour l'exemple
  const effectifClasseAffiche = classeEleve ? effectifClasseReel : 'N/A';

  const matieresAffichees = matiereFiltre === ''
    ? matieres
    : matieres.filter(m => m.id.toString() === matiereFiltre);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Notes</h1>
          <p className="text-gray-600">Consultez vos résultats scolaires</p>
        </div>
        <button className="btn-secondary flex items-center justify-center shadow-sm hover:shadow-md py-2.5 px-4">
          <Download className="h-4 w-4 mr-2" />
          Télécharger bulletin
        </button>
      </div>

      {/* Filtres de période et de matière */}
      <div className="card p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label text-base font-semibold">Trimestre :</label>
            <select
              value={trimestreSelectionne}
              onChange={(e) => setTrimestreSelectionne(e.target.value)}
              className="input-field" // Garder max-w-xs si nécessaire
            >
              <option value="1">1er Trimestre</option>
              <option value="2">2ème Trimestre</option>
              <option value="3">3ème Trimestre</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label text-base font-semibold">Matière :</label>
            <select
              value={matiereFiltre}
              onChange={(e) => setMatiereFiltre(e.target.value)}
              className="input-field"
            >
              <option value="">Toutes les matières</option>
              {matieres.map(matiere => (
                <option key={matiere.id} value={matiere.id}>{matiere.nom}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Résumé général (taille réduite) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Moyenne Générale */}
        <div className="card bg-fleuve-50 border border-fleuve-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"> {/* Réduction du padding à p-4 */}
          <div className="text-center">
            <BarChart3 className="h-10 w-10 text-fleuve-600 mx-auto mb-2" /> {/* Réduction de la taille de l'icône à h-10 w-10, mb-2 */}
            <h3 className="text-base font-semibold text-fleuve-900">Moyenne Générale</h3> {/* Réduction de la taille du titre à text-base */}
            <p className="text-3xl font-bold text-fleuve-800 mt-1"> {/* Réduction de la taille du chiffre à text-3xl */}
              {moyenneGenerale !== 0 ? `${moyenneGenerale.toFixed(2)}/20` : 'N/A'}
            </p>
            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${mentionGenerale.bg} ${mentionGenerale.couleur} ${mentionGenerale.border}`}> {/* Réduction de la taille du badge à text-xs, py-0.5 */}
              {moyenneGenerale !== 0 ? mentionGenerale.mention : 'Aucune note'}
            </span>
          </div>
        </div>

        {/* Matières évaluées */}
        <div className="card bg-acacia-50 border border-acacia-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"> {/* Réduction du padding à p-4 */}
          <div className="text-center">
            <GraduationCap className="h-10 w-10 text-acacia-600 mx-auto mb-2" /> {/* Réduction de la taille de l'icône à h-10 w-10, mb-2 */}
            <h3 className="text-base font-semibold text-acacia-900">Matières évaluées</h3> {/* Réduction de la taille du titre à text-base */}
            <p className="text-3xl font-bold text-acacia-800 mt-1"> {/* Réduction de la taille du chiffre à text-3xl */}
              {matieres.filter(m => notesPourAffichage.some(n => n.matiereId === m.id)).length} / {matieres.length}
            </p>
            <p className="text-sm text-acacia-600 mt-1">
              ({notesPourAffichage.length} notes saisies)
            </p>
          </div>
        </div>

        {/* Rang estimé */}
        <div className="card bg-soleil-50 border border-soleil-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"> {/* Réduction du padding à p-4 */}
          <div className="text-center">
            <Award className="h-10 w-10 text-soleil-600 mx-auto mb-2" /> {/* Réduction de la taille de l'icône à h-10 w-10, mb-2 */}
            <h3 className="text-base font-semibold text-soleil-900">Rang estimé</h3> {/* Réduction de la taille du titre à text-base */}
            <p className="text-3xl font-bold text-soleil-800 mt-1"> {/* Réduction de la taille du chiffre à text-3xl */}
              {rangSimule}
            </p>
            <p className="text-sm text-soleil-600 mt-1">
              sur {effectifClasseAffiche} élèves
            </p>
          </div>
        </div>
      </div>

      {/* Détail par matière */}
      <div className="card p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Détail par matière</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* GRILLE POUR LES MATIÈRES : 1 sur mobile, 2 sur écrans moyens et plus */}
          {matieresAffichees.length > 0 ? (
            matieresAffichees.map((matiere) => {
              const moyenne = calculerMoyenneMatiere(matiere.id);
              const notesMatiere = notesPourAffichage.filter(n => n.matiereId === matiere.id);
              const evolution = obtenirEvolutionNote(matiere.id);
              const mention = moyenne !== null ? obtenirMention(moyenne) : null;

              return (
                <div key={matiere.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-fleuve-100 p-2 rounded-lg shadow-inner flex-shrink-0">
                        <GraduationCap className="h-6 w-6 text-fleuve-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{matiere.nom}</h4>
                        <p className="text-sm text-gray-500">Coefficient {matiere.coefficient}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      {moyenne !== null ? (
                        <>
                          <div className="flex items-center justify-end space-x-2">
                            <span className="text-2xl font-bold text-gray-900"> {/* Taille ajustée */}
                              {moyenne.toFixed(2)}/20
                            </span>
                            {evolution !== null && (
                              <div className={`flex items-center ${
                                evolution >= 0 ? 'text-acacia-600' : 'text-terre-600'
                              }`}>
                                {evolution >= 0 ? (
                                  <TrendingUp className="h-5 w-5 mr-1" />
                                ) : (
                                  <TrendingDown className="h-5 w-5 mr-1" />
                                )}
                                <span className="text-base font-medium">
                                  {Math.abs(evolution).toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className={`text-sm font-medium mt-1 ${mention.couleur}`}>
                            {mention.mention}
                          </p>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xl font-bold">N/A</span>
                      )}
                    </div>
                  </div>

                  {/* Détail des notes individuelles */}
                  {notesMatiere.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <FileText className="h-4 w-4 mr-2" /> Détail des évaluations :
                      </h5>
                      <div className="grid grid-cols-2 gap-3"> {/* GRILLE POUR LES NOTES INDIVIDUELLES : 2 par ligne sur tous les écrans */}
                        {notesMatiere.map((note) => (
                          <div key={note.id} className="bg-white p-2 rounded border border-gray-100 shadow-sm"> {/* Padding réduit */}
                            <div className="flex flex-col justify-between items-start"> {/* Utiliser flex-col pour empiler */}
                              <span className="text-xs font-medium text-gray-900">
                                {note.type}
                              </span>
                              <span className={`text-lg font-bold ${ // Taille plus grande pour la note
                                note.valeur >= 16 ? 'text-acacia-600' :
                                note.valeur >= 14 ? 'text-fleuve-600' :
                                note.valeur >= 10 ? 'text-soleil-600' :
                                'text-terre-600'
                              }`}>
                                {note.valeur}/20
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <Calendar className="h-3 w-3 mr-1" /> {new Date(note.date).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {notesMatiere.length === 0 && moyenne === null && (
                    <div className="text-center text-gray-500 text-sm py-2">
                      Aucune note saisie pour cette matière ce trimestre.
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune matière ne correspond à la sélection.</p>
              <p className="text-gray-400 text-sm mt-2">Veuillez ajuster le filtre de matière.</p>
            </div>
          )}
        </div>

        {notesPourAffichage.length === 0 && matiereFiltre === '' && matieres.length > 0 && (
             <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune note disponible pour le trimestre sélectionné.</p>
                <p className="text-gray-400 text-sm mt-2">Veuillez changer de trimestre ou attendre la saisie des notes.</p>
            </div>
        )}
        {matieres.length === 0 && (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune matière configurée dans le système.</p>
            <p className="text-gray-400 text-sm mt-2">Veuillez contacter l'administrateur.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MesNotes;