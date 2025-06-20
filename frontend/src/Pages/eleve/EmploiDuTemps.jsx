import {
    BookOpen,
    Calendar,
    Clock,
    GraduationCap,
    MapPin
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext';

const EmploiDuTemps = () => {
  const { utilisateur, donnees } = useAuth();
  const [semaineSelectionnee, setSemaineSelectionnee] = useState(0); // 0 = semaine actuelle

  const emploisDuTemps = donnees.emploiDuTemps || [];
  const profil = donnees.profil || {};

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const heures = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
  ];

  // Filtrer l'emploi du temps pour la classe de l'élève
  const emploiClasse = emploisDuTemps.filter(cours => 
    cours.classe === profil.classe
  );

  const obtenirCours = (jour, heure) => {
    return emploiClasse.find(cours => cours.jour === jour && cours.heure === heure);
  };

  const obtenirDateSemaine = (jourIndex) => {
    const aujourd = new Date();
    const lundiCetteSemaine = new Date(aujourd);
    lundiCetteSemaine.setDate(aujourd.getDate() - aujourd.getDay() + 1 + (semaineSelectionnee * 7));
    
    const dateJour = new Date(lundiCetteSemaine);
    dateJour.setDate(lundiCetteSemaine.getDate() + jourIndex);
    
    return dateJour;
  };

  const estAujourdhui = (jourIndex) => {
    const dateJour = obtenirDateSemaine(jourIndex);
    const aujourd = new Date();
    return dateJour.toDateString() === aujourd.toDateString();
  };

  const obtenirCoursAujourdhui = () => {
    const aujourd = new Date();
    const jourAujourdhui = jours[aujourd.getDay() - 1]; // -1 car getDay() commence à 0 (dimanche)
    
    if (!jourAujourdhui) return []; // Weekend
    
    return emploiClasse.filter(cours => cours.jour === jourAujourdhui);
  };

  const coursAujourdhui = obtenirCoursAujourdhui();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Emploi du Temps</h1>
          <p className="text-gray-600">Classe {profil.classe}</p>
        </div>
      </div>

      {/* Navigation semaine */}
      <div className="card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSemaineSelectionnee(semaineSelectionnee - 1)}
            className="btn-secondary"
          >
            ← Semaine précédente
          </button>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {semaineSelectionnee === 0 ? 'Cette semaine' : 
               semaineSelectionnee === 1 ? 'Semaine prochaine' :
               semaineSelectionnee === -1 ? 'Semaine dernière' :
               `Semaine ${semaineSelectionnee > 0 ? '+' : ''}${semaineSelectionnee}`}
            </h3>
            <p className="text-sm text-gray-600">
              Du {obtenirDateSemaine(0).toLocaleDateString('fr-FR')} au {obtenirDateSemaine(4).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <button
            onClick={() => setSemaineSelectionnee(semaineSelectionnee + 1)}
            className="btn-secondary"
          >
            Semaine suivante →
          </button>
        </div>
      </div>

      {/* Cours d'aujourd'hui */}
      {semaineSelectionnee === 0 && coursAujourdhui.length > 0 && (
        <div className="card p-6 shadow-sm bg-fleuve-50 border border-fleuve-200">
          <h3 className="text-lg font-semibold text-fleuve-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Mes cours d'aujourd'hui
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coursAujourdhui.map((cours, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-fleuve-200 shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <BookOpen className="h-5 w-5 text-fleuve-600" />
                  <h4 className="font-medium text-gray-900">{cours.matiere}</h4>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {cours.heure}
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    {cours.enseignant}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {cours.salle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grille de l'emploi du temps */}
      <div className="card table-container p-0">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">
                Heures
              </th>
              {jours.map((jour, index) => (
                <th key={jour} className={`table-header-cell text-center ${
                  estAujourdhui(index) ? 'bg-fleuve-100 text-fleuve-800' : ''
                }`}>
                  <div>{jour}</div>
                  <div className="text-xs font-normal text-gray-500">
                    {obtenirDateSemaine(index).toLocaleDateString('fr-FR', { 
                      day: '2-digit', 
                      month: '2-digit' 
                    })}
                  </div>
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
                {jours.map((jour, jourIndex) => {
                  const cours = obtenirCours(jour, heure);
                  const estCelluleAujourdhui = estAujourdhui(jourIndex);
                  
                  return (
                    <td key={`${jour}-${heure}`} className={`px-2 py-3 text-center ${
                      estCelluleAujourdhui ? 'bg-fleuve-50' : ''
                    }`}>
                      {cours ? (
                        <div className="bg-white border border-fleuve-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
                          <div className="text-sm font-medium text-fleuve-900 mb-1">
                            {cours.matiere}
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div className="flex items-center justify-center">
                              <GraduationCap className="h-3 w-3 mr-1" />
                              {cours.enseignant}
                            </div>
                            <div className="flex items-center justify-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {cours.salle}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-16 flex items-center justify-center text-gray-400">
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

      {emploiClasse.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucun emploi du temps disponible</p>
          <p className="text-gray-400 text-sm mt-2">L'emploi du temps n'a pas encore été défini pour votre classe.</p>
        </div>
      )}
    </div>
  );
};

export default EmploiDuTemps;