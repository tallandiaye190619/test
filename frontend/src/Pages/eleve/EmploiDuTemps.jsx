import {
  Calendar,
  GraduationCap,
  MapPin
} from 'lucide-react';
import { useMemo } from 'react';
import { useAuth } from '../../context/MonContext';

const EmploiDuTemps = () => {
  const { utilisateur, donnees } = useAuth();
  
  const emploisDuTempsGlobaux = donnees.emploisDuTemps || [];
  const profilEleve = utilisateur;
  
  const monEmploiDuTemps = useMemo(() => {
    if (!profilEleve || !profilEleve.classeId) {
        return [];
    }
    return emploisDuTempsGlobaux.filter(cours => 
        cours.classeId === profilEleve.classeId
    );
  }, [emploisDuTempsGlobaux, profilEleve]);

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const heures = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
  ];

  const obtenirCours = (jour, heure) => {
    return monEmploiDuTemps.find(cours => cours.jour === jour && cours.heure === heure);
  };

  const obtenirDateSemaine = (jourIndex) => {
    const aujourd = new Date();
    const lundiCetteSemaine = new Date(aujourd);
    lundiCetteSemaine.setDate(aujourd.getDate() - (aujourd.getDay() === 0 ? 6 : aujourd.getDay() - 1));
    
    const dateJour = new Date(lundiCetteSemaine);
    dateJour.setDate(lundiCetteSemaine.getDate() + jourIndex);
    
    return dateJour;
  };

  const estAujourdhui = (jourIndex) => {
    const dateJour = obtenirDateSemaine(jourIndex);
    const aujourd = new Date();
    return dateJour.toDateString() === aujourd.toDateString();
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Emploi du Temps</h1>
          <p className="text-gray-600">Classe : <span className="font-semibold text-fleuve-700">{profilEleve?.classe || 'N/A'}</span></p>
        </div>
      </div>

      {/* Message si l'élève n'a pas de classeId ou si l'emploi du temps n'est pas disponible */}
      {!profilEleve?.classeId || monEmploiDuTemps.length === 0 ? (
        <div className="text-center py-12 card shadow-sm">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold">
              {!profilEleve?.classeId 
                ? "Votre classe n'est pas définie ou ne possède pas d'emploi du temps."
                : "Aucun emploi du temps défini pour votre classe cette semaine."
              }
            </p>
            <p className="text-gray-400 text-sm mt-2">Veuillez vérifier auprès de l'administration de l'école.</p>
        </div>
      ) : (
        // Section d'affichage de l'emploi du temps si la classeId est présente et qu'il y a des cours
        <>
            {/* Grille de l'emploi du temps de la semaine complète */}
            <div className="card table-container p-0 overflow-x-auto">
                <table className="table min-w-full">
                <thead className="table-header">
                    <tr>
                    <th className="table-header-cell w-28">Heures</th>
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
                        <td className="table-cell font-semibold text-gray-900 bg-gray-50 border-r border-gray-200 sticky left-0 z-10 w-28">
                            {heure}
                        </td>
                        {jours.map((jour, jourIndex) => {
                            const cours = obtenirCours(jour, heure);
                            const estCelluleAujourdHui = estAujourdhui(jourIndex);
                            
                            return (
                                <td key={`${jour}-${heure}`} className={`px-2 py-3 text-center align-top ${
                                estCelluleAujourdHui ? 'bg-fleuve-50' : ''
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

            {/* Message si aucune donnée d'emploi du temps complète pour la classe, mais la classe est définie */}
            {monEmploiDuTemps.length === 0 && (
                <div className="text-center py-12 card shadow-sm">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-semibold">Aucun emploi du temps défini pour votre classe cette semaine.</p>
                    <p className="text-gray-400 text-sm mt-2">Veuillez vérifier auprès de l'administration.</p>
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default EmploiDuTemps;