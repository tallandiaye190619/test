import {
    Calendar,
    MapPin,
    School // Pour l'icône de la classe dans la recherche
    ,
    Search
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext';

const MonEmploiDuTemps = () => {
  const { utilisateur, donnees } = useAuth(); // Récupérer l'utilisateur connecté
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [filtreClasse, setFiltreClasse] = useState(''); // Pour filtrer par classe spécifique si l'enseignant en a plusieurs

  // S'assurer que les données sont des tableaux, même si vides
  const emploisDuTemps = donnees.emploisDuTemps || [];
  const matieres = donnees.matieres || [];
  const classes = donnees.classes || []; // Pour obtenir le nom de la classe par ID si nécessaire

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const heures = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
  ];

  // Filtrer les cours qui appartiennent à l'enseignant connecté
  const monEmploiDuTempsFiltreParEnseignant = emploisDuTemps.filter(cours => {
    // Supposons que 'enseignant' dans emploisDuTemps est le nom complet de l'enseignant.
    // Si votre 'emploisDuTemps' avait un 'enseignantId', ce serait plus robuste.
    // Pour cet exemple, je compare le nom complet.
    const enseignantNomCompletCours = cours.enseignant;
    const enseignantConnecteNomComplet = `${utilisateur?.prenom} ${utilisateur?.nom}`;
    return enseignantNomCompletCours === enseignantConnecteNomComplet;
  });

  // Appliquer les filtres de recherche et de classe
  const emploiAffiche = monEmploiDuTempsFiltreParEnseignant.filter(cours => {
    const correspondRecherche = cours.matiere.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
                                cours.classe.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
                                cours.salle.toLowerCase().includes(rechercheTexte.toLowerCase());
    const correspondClasse = !filtreClasse || cours.classe === filtreClasse;
    return correspondRecherche && correspondClasse;
  });

  const obtenirCours = (jour, heure) => {
    return emploiAffiche.find(cours => cours.jour === jour && cours.heure === heure);
  };

  const classesDeMonEnseignant = classes.filter(
    classe => monEmploiDuTempsFiltreParEnseignant.some(cours => cours.classe === classe.nom)
  );


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Emploi du Temps</h1>
          <p className="text-gray-600">Visualisez votre emploi du temps hebdomadaire</p>
        </div>
      </div>

      {/* Filtres de recherche et classe */}
      <div className="card p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative form-group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher par matière, salle, classe..."
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
              <option value="">Toutes mes classes</option>
              {classesDeMonEnseignant.map(classe => (
                <option key={classe.id} value={classe.nom}>{classe.nom}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grille de l'emploi du temps */}
      <div className="card table-container p-0 overflow-x-auto">
        <table className="table min-w-full">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell w-28">Heures</th> {/* Largeur fixe pour la colonne des heures */}
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
                <td className="table-cell font-semibold text-gray-900 bg-gray-50 border-r border-gray-200 sticky left-0 z-10 w-28">
                  {heure}
                </td>
                {jours.map(jour => {
                  const cours = obtenirCours(jour, heure);
                  return (
                    <td key={`${jour}-${heure}`} className="px-2 py-3 text-center align-top">
                      {cours ? (
                        <div
                          className="bg-fleuve-100 border border-fleuve-200 rounded-lg p-2 cursor-pointer transition-colors duration-200 hover:bg-fleuve-200 hover:shadow-md h-full flex flex-col justify-between"
                          title={`Matière: ${cours.matiere}\nClasse: ${cours.classe}\nSalle: ${cours.salle}`}
                        >
                          <div className="text-xs font-bold text-fleuve-900 mb-1">{cours.matiere}</div>
                          <div className="text-xs text-fleuve-700 flex items-center justify-center">
                            <School className="h-3 w-3 mr-1" />{cours.classe}
                          </div>
                          <div className="text-xs text-fleuve-600 flex items-center justify-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />{cours.salle}
                          </div>
                          {/* Optionnel: petite icône de l'enseignant si l'admin peut voir tout l'emploi du temps
                          <div className="text-xs text-fleuve-500 mt-1 flex items-center justify-center">
                              <GraduationCap className="h-3 w-3 mr-1" />{cours.enseignant}
                          </div>
                          */}
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

      {emploiAffiche.length === 0 && monEmploiDuTempsFiltreParEnseignant.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucun emploi du temps trouvé pour vous.</p>
          <p className="text-gray-400 text-sm mt-2">Veuillez contacter l'administration pour obtenir votre emploi du temps.</p>
        </div>
      )}

      {emploiAffiche.length === 0 && monEmploiDuTempsFiltreParEnseignant.length > 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucun cours ne correspond à votre recherche ou filtre.</p>
          <p className="text-gray-400 text-sm mt-2">Veuillez ajuster les critères de recherche ou de classe.</p>
        </div>
      )}

    </div>
  );
};

export default MonEmploiDuTemps;