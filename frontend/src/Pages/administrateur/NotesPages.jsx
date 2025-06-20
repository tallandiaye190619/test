
import {
  BarChart3,
  BookOpen,
  Download,
  Eye,
  FileText
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext';

const NotesBulletinsPage = () => {
  const { donnees } = useAuth();
  const [filtreClasse, setFiltreClasse] = useState('');
  const [filtreMatiere, setFiltreMatiere] = useState('');
  const [filtreTrimestre, setFiltreTrimestre] = useState('1');
  const [vueActive, setVueActive] = useState('notes'); // 'notes', 'bulletins', 'statistiques'

  const notes = donnees.notes || [];
  const eleves = donnees.eleves || [];
  const classes = donnees.classes || [];
  const matieres = donnees.matieres || [];

  const notesFiltrees = notes.filter(note => {
    const eleve = eleves.find(e => e.id === note.eleveId);
    const matiere = matieres.find(m => m.id === note.matiereId);
    
    return (!filtreClasse || eleve?.classe === filtreClasse) &&
           (!filtreMatiere || matiere?.nom === filtreMatiere) &&
           (!filtreTrimestre || note.trimestre.toString() === filtreTrimestre);
  });

  const calculerMoyenne = (eleveId, trimestre) => {
    const notesEleve = notes.filter(n => n.eleveId === eleveId && n.trimestre === trimestre);
    if (notesEleve.length === 0) return 0;
    
    const total = notesEleve.reduce((sum, note) => sum + (note.valeur * note.coefficient), 0);
    const totalCoeff = notesEleve.reduce((sum, note) => sum + note.coefficient, 0);
    
    return totalCoeff > 0 ? (total / totalCoeff).toFixed(2) : 0;
  };

  const obtenirStatistiquesClasse = (classe) => {
    const elevesClasse = eleves.filter(e => e.classe === classe);
    const moyennes = elevesClasse.map(eleve => parseFloat(calculerMoyenne(eleve.id, parseInt(filtreTrimestre))));
    
    return {
      effectif: elevesClasse.length,
      moyenneClasse: moyennes.length > 0 ? (moyennes.reduce((a, b) => a + b, 0) / moyennes.length).toFixed(2) : 0,
      meilleureMoyenne: moyennes.length > 0 ? Math.max(...moyennes).toFixed(2) : 0,
      moyenneLaPlusFaible: moyennes.length > 0 ? Math.min(...moyennes).toFixed(2) : 0
    };
  };

  const VueNotes = () => (
    <div className="card p-0 shadow-sm"> {/* Ajout de p-0 et shadow-sm */}
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">
                Élève
              </th>
              <th className="table-header-cell">
                Classe
              </th>
              <th className="table-header-cell">
                Matière
              </th>
              <th className="table-header-cell">
                Note
              </th>
              <th className="table-header-cell">
                Type
              </th>
              <th className="table-header-cell">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="table-body">
            {notesFiltrees.map((note) => {
              const eleve = eleves.find(e => e.id === note.eleveId);
              const matiere = matieres.find(m => m.id === note.matiereId);
              
              return (
                <tr key={note.id} className="table-row">
                  <td className="table-cell">
                    <div className="text-sm font-medium text-gray-900">
                      {eleve?.prenom} {eleve?.nom}
                    </div>
                  </td>
                  <td className="table-cell">
                    {eleve?.classe}
                  </td>
                  <td className="table-cell">
                    {matiere?.nom}
                  </td>
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
                  <td className="table-cell">
                    {note.type}
                  </td>
                  <td className="table-cell">
                    {new Date(note.date).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {notesFiltrees.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune note trouvée pour ces filtres.</p>
          <p className="text-gray-400 text-sm mt-2">Veuillez ajuster les filtres ou ajouter des notes.</p>
        </div>
      )}
    </div>
  );

  const VueBulletins = () => (
    <div className="space-y-6">
      {classes.filter(classe => !filtreClasse || classe.nom === filtreClasse).map(classe => {
        const elevesClasse = eleves.filter(e => e.classe === classe.nom);
        
        return (
          <div key={classe.id} className="card p-6 shadow-md border border-gray-100"> {/* Amélioration de la card */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{classe.nom}</h3>
              <button className="btn-secondary flex items-center shadow-sm hover:shadow-md">
                <Download className="h-4 w-4 mr-2" />
                Exporter bulletins
              </button>
            </div>
            
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">
                      Élève
                    </th>
                    <th className="table-header-cell">
                      Moyenne générale
                    </th>
                    <th className="table-header-cell">
                      Rang
                    </th>
                    <th className="table-header-cell">
                      Mention
                    </th>
                    <th className="table-header-cell text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {elevesClasse.map((eleve, index) => {
                    const moyenne = parseFloat(calculerMoyenne(eleve.id, parseInt(filtreTrimestre)));
                    const mention = moyenne >= 16 ? 'Très Bien' :
                                   moyenne >= 14 ? 'Bien' :
                                   moyenne >= 12 ? 'Assez Bien' :
                                   moyenne >= 10 ? 'Passable' : 'Insuffisant';
                    
                    return (
                      <tr key={eleve.id} className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center">
                            <img
                              src={eleve.photo || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                              alt={`${eleve.prenom} ${eleve.nom}`}
                              className="h-8 w-8 rounded-full object-cover shadow-sm"
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {eleve.prenom} {eleve.nom}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className={`text-sm font-medium ${
                            moyenne >= 10 ? 'text-acacia-600' : 'text-terre-600'
                          }`}>
                            {moyenne}/20
                          </span>
                        </td>
                        <td className="table-cell">
                          {index + 1}
                        </td>
                        <td className="table-cell">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                            moyenne >= 16 ? 'bg-acacia-100 text-acacia-800 border-acacia-200' :
                            moyenne >= 14 ? 'bg-fleuve-100 text-fleuve-800 border-fleuve-200' :
                            moyenne >= 12 ? 'bg-soleil-100 text-soleil-800 border-soleil-200' :
                            moyenne >= 10 ? 'bg-gray-100 text-gray-800 border-gray-200' : // Pas de couleur spécifique, utilisation de gris
                            'bg-terre-100 text-terre-800 border-terre-200'
                          }`}>
                            {mention}
                          </span>
                        </td>
                        <td className="table-cell text-right font-medium">
                          <button className="p-2 rounded-full text-fleuve-600 hover:bg-fleuve-50 hover:text-fleuve-800 transition-colors duration-200 flex items-center justify-end">
                            <Eye className="h-4 w-4 mr-1" />
                            Voir bulletin
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
             {elevesClasse.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Aucun élève dans cette classe ou pour ce trimestre.</p>
                </div>
            )}
          </div>
        );
      })}
       {classes.filter(classe => !filtreClasse || classe.nom === filtreClasse).length === 0 && (
        <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun bulletin à afficher pour la classe ou les filtres sélectionnés.</p>
        </div>
      )}
    </div>
  );

  const VueStatistiques = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classes.filter(classe => !filtreClasse || classe.nom === filtreClasse).map(classe => {
          const stats = obtenirStatistiquesClasse(classe.nom);
          
          return (
            <div key={classe.id} className="card p-6 shadow-md border border-gray-100"> {/* Amélioration de la card */}
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{classe.nom}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Effectif:</span>
                  <span className="text-base font-medium text-gray-900">{stats.effectif}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Moyenne classe:</span>
                  <span className="text-base font-medium text-fleuve-600">{stats.moyenneClasse}/20</span> {/* Couleur fleuve */}
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Meilleure moyenne:</span>
                  <span className="text-base font-medium text-acacia-600">{stats.meilleureMoyenne}/20</span> {/* Couleur acacia */}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Plus faible moyenne:</span>
                  <span className="text-base font-medium text-terre-600">{stats.moyenneLaPlusFaible}/20</span> {/* Couleur terre */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
       {classes.filter(classe => !filtreClasse || classe.nom === filtreClasse).length === 0 && (
        <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune statistique à afficher pour la classe ou les filtres sélectionnés.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notes & Bulletins</h1>
          <p className="text-gray-600">Consultez les notes et générez les bulletins</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center shadow-sm hover:shadow-md">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="card p-1 shadow-sm"> {/* Ajout de p-1 et shadow-sm */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setVueActive('notes')}
            className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              vueActive === 'notes'
                ? 'bg-white text-fleuve-600 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Notes
          </button>
          <button
            onClick={() => setVueActive('bulletins')}
            className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              vueActive === 'bulletins'
                ? 'bg-white text-fleuve-600 shadow-sm'
                : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Bulletins
          </button>
          <button
            onClick={() => setVueActive('statistiques')}
            className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              vueActive === 'statistiques'
                ? 'bg-white text-fleuve-600 shadow-sm'
                : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Statistiques
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="card p-6 shadow-sm"> {/* Amélioration de la card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="form-group">
            <select
              value={filtreClasse}
              onChange={(e) => setFiltreClasse(e.target.value)}
              className="input-field"
            >
              <option value="">Toutes les classes</option>
              {classes.map(classe => (
                <option key={classe.id} value={classe.nom}>{classe.nom}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
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
          <div></div> 
        </div>
      </div>

      {/* Contenu selon la vue active */}
      {vueActive === 'notes' && <VueNotes />}
      {vueActive === 'bulletins' && <VueBulletins />}
      {vueActive === 'statistiques' && <VueStatistiques />}
    </div>
  );
};

export default NotesBulletinsPage;
