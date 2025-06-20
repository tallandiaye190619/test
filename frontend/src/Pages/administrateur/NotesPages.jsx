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
    <div className="card"> {/* Utilisation du composant card */}
      <div className="table-container"> {/* Utilisation du composant table-container */}
        <table className="table"> {/* Utilisation du composant table */}
          <thead className="table-header"> {/* Utilisation du composant table-header */}
            <tr>
              <th className="table-header-cell"> {/* Utilisation du composant table-header-cell */}
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
          <tbody className="table-body"> {/* Utilisation du composant table-body */}
            {notesFiltrees.map((note) => {
              const eleve = eleves.find(e => e.id === note.eleveId);
              const matiere = matieres.find(m => m.id === note.matiereId);
              
              return (
                <tr key={note.id} className="table-row"> {/* Utilisation du composant table-row */}
                  <td className="table-cell"> {/* Utilisation du composant table-cell */}
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
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      // Adaptez ces couleurs aux couleurs de votre config (soleil, fleuve, terre, acacia)
                      note.valeur >= 16 ? 'bg-acacia-100 text-acacia-800' : // Ex: Vert acacia pour Très Bien
                      note.valeur >= 14 ? 'bg-fleuve-100 text-fleuve-800' : // Ex: Bleu fleuve pour Bien
                      note.valeur >= 10 ? 'bg-soleil-100 text-soleil-800' : // Ex: Ocre soleil pour Passable
                      'bg-terre-100 text-terre-800' // Ex: Terracotta pour Insuffisant
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
    </div>
  );

  const VueBulletins = () => (
    <div className="space-y-6">
      {classes.filter(classe => !filtreClasse || classe.nom === filtreClasse).map(classe => {
        const elevesClasse = eleves.filter(e => e.classe === classe.nom);
        
        return (
          <div key={classe.id} className="card"> {/* Utilisation du composant card */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">{classe.nom}</h3>
              <button className="btn-secondary flex items-center"> {/* Utilisation du composant btn-secondary */}
                <Download className="h-4 w-4 mr-2" />
                Exporter bulletins
              </button>
            </div>
            
            <div className="table-container"> {/* Utilisation du composant table-container */}
              <table className="table"> {/* Utilisation du composant table */}
                <thead className="table-header"> {/* Utilisation du composant table-header */}
                  <tr>
                    <th className="table-header-cell"> {/* Utilisation du composant table-header-cell */}
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
                <tbody className="table-body"> {/* Utilisation du composant table-body */}
                  {elevesClasse.map((eleve, index) => {
                    const moyenne = parseFloat(calculerMoyenne(eleve.id, parseInt(filtreTrimestre)));
                    const mention = moyenne >= 16 ? 'Très Bien' :
                                   moyenne >= 14 ? 'Bien' :
                                   moyenne >= 12 ? 'Assez Bien' :
                                   moyenne >= 10 ? 'Passable' : 'Insuffisant';
                    
                    return (
                      <tr key={eleve.id} className="table-row"> {/* Utilisation du composant table-row */}
                        <td className="table-cell"> {/* Utilisation du composant table-cell */}
                          <div className="flex items-center">
                            <img
                              src={eleve.photo || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                              alt={`${eleve.prenom} ${eleve.nom}`}
                              className="h-8 w-8 rounded-full object-cover"
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
                            // Adaptez ces couleurs aux couleurs de votre config
                            moyenne >= 10 ? 'text-acacia-600' : 'text-terre-600' // Vert acacia pour passable+, Terracotta pour insuffisant
                          }`}>
                            {moyenne}/20
                          </span>
                        </td>
                        <td className="table-cell">
                          {index + 1}
                        </td>
                        <td className="table-cell">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            // Adaptez ces couleurs aux couleurs de votre config
                            moyenne >= 16 ? 'bg-acacia-100 text-acacia-800' : // Très Bien
                            moyenne >= 14 ? 'bg-fleuve-100 text-fleuve-800' : // Bien
                            moyenne >= 12 ? 'bg-soleil-100 text-soleil-800' : // Assez Bien
                            moyenne >= 10 ? 'bg-gray-100 text-gray-800' : // Passable (pas de couleur spécifique pour "orange-100" dans votre config)
                            'bg-terre-100 text-terre-800' // Insuffisant
                          }`}>
                            {mention}
                          </span>
                        </td>
                        <td className="table-cell text-right font-medium">
                          <button className="text-fleuve-600 hover:text-fleuve-900 flex items-center justify-end"> {/* Utilisation de fleuve pour les actions */}
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
          </div>
        );
      })}
    </div>
  );

  const VueStatistiques = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classes.filter(classe => !filtreClasse || classe.nom === filtreClasse).map(classe => {
          const stats = obtenirStatistiquesClasse(classe.nom);
          
          return (
            <div key={classe.id} className="card"> {/* Utilisation du composant card */}
              <h3 className="text-lg font-medium text-gray-900 mb-4">{classe.nom}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Effectif:</span>
                  <span className="text-sm font-medium">{stats.effectif}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Moyenne classe:</span>
                  <span className="text-sm font-medium">{stats.moyenneClasse}/20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Meilleure moyenne:</span>
                  <span className="text-sm font-medium text-acacia-600">{stats.meilleureMoyenne}/20</span> {/* Utilisation de acacia */}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Plus faible moyenne:</span>
                  <span className="text-sm font-medium text-terre-600">{stats.moyenneLaPlusFaible}/20</span> {/* Utilisation de terre */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notes & Bulletins</h1> {/* Utilisation de la classe de base h1 */}
          <p className="text-gray-600">Consultez les notes et générez les bulletins</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center"> {/* Utilisation du composant btn-secondary */}
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="card"> {/* Utilisation du composant card */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setVueActive('notes')}
            className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              // Utilisez 'fleuve' qui est votre couleur 'primaire' selon vos btn-primary/secondary
              vueActive === 'notes'
                ? 'bg-white text-fleuve-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Notes
          </button>
          <button
            onClick={() => setVueActive('bulletins')}
            className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              vueActive === 'bulletins'
                ? 'bg-white text-fleuve-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Bulletins
          </button>
          <button
            onClick={() => setVueActive('statistiques')}
            className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              vueActive === 'statistiques'
                ? 'bg-white text-fleuve-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Statistiques
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="card"> {/* Utilisation du composant card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="form-group"> {/* Utilisation du composant form-group (bien que pas de label ici, la structure est réutilisable) */}
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
          {/* Un quatrième élément pour alignement si nécessaire, ou ajuster les colonnes */}
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