import {
    BarChart3,
    Calendar,
    DollarSign,
    Download,
    RefreshCw,
    TrendingDown,
    TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext';

const StatistiquesFinancieres = () => {
  const { donnees } = useAuth();
  const [periodeSelectionnee, setPeriodeSelectionnee] = useState('mois');
  const [anneeSelectionnee, setAnneeSelectionnee] = useState(new Date().getFullYear());
  const [moisSelectionne, setMoisSelectionne] = useState(new Date().getMonth() + 1);

  const paiements = donnees.paiements || [];
  const eleves = donnees.eleves || [];
  const classes = donnees.classes || [];

  const mois = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const filtrerPaiementsParPeriode = () => {
    return paiements.filter(paiement => {
      const datePaiement = new Date(paiement.datePayment);
      const anneePaiement = datePaiement.getFullYear();
      const moisPaiement = datePaiement.getMonth() + 1;

      if (periodeSelectionnee === 'annee') {
        return anneePaiement === anneeSelectionnee;
      } else if (periodeSelectionnee === 'mois') {
        return anneePaiement === anneeSelectionnee && moisPaiement === moisSelectionne;
      }
      return true; // Si 'tout'
    });
  };

  const paiementsFiltres = filtrerPaiementsParPeriode();

  const calculerStatistiquesGenerales = () => {
    const totalCollecte = paiementsFiltres
      .filter(p => p.statut === 'payé')
      .reduce((sum, p) => sum + p.montant, 0);
    
    const totalEnAttente = paiementsFiltres
      .filter(p => p.statut === 'en_attente')
      .reduce((sum, p) => sum + p.montant, 0);

    const nombreTransactions = paiementsFiltres.filter(p => p.statut === 'payé').length;
    
    const montantMoyen = nombreTransactions > 0 ? totalCollecte / nombreTransactions : 0;

    // Calcul de l'évolution par rapport à la période précédente
    const periodePrec = periodeSelectionnee === 'mois' 
      ? paiements.filter(p => {
          const date = new Date(p.datePayment);
          let prevMois = moisSelectionne - 1;
          let prevAnnee = anneeSelectionnee;
          if (prevMois === 0) {
              prevMois = 12;
              prevAnnee--;
          }
          return date.getFullYear() === prevAnnee && 
                 date.getMonth() + 1 === prevMois && 
                 p.statut === 'payé';
        })
      : paiements.filter(p => {
          const date = new Date(p.datePayment);
          return date.getFullYear() === anneeSelectionnee - 1 && p.statut === 'payé';
        });

    const totalPrecedent = periodePrec.reduce((sum, p) => sum + p.montant, 0);

    const evolution = totalPrecedent > 0 
      ? ((totalCollecte - totalPrecedent) / totalPrecedent) * 100 
      : (totalCollecte > 0 ? 100 : 0); // Si pas de données précédentes mais données actuelles, 100% de croissance

    return {
      totalCollecte,
      totalEnAttente,
      nombreTransactions,
      montantMoyen,
      evolution
    };
  };

  const calculerStatistiquesParType = () => {
    const stats = {};
    paiementsFiltres.filter(p => p.statut === 'payé').forEach(paiement => {
      if (!stats[paiement.typePaiement]) {
        stats[paiement.typePaiement] = {
          montant: 0,
          nombre: 0
        };
      }
      stats[paiement.typePaiement].montant += paiement.montant;
      stats[paiement.typePaiement].nombre += 1;
    });
    return stats;
  };

  const calculerStatistiquesParMethode = () => {
    const stats = {};
    paiementsFiltres.filter(p => p.statut === 'payé').forEach(paiement => {
      if (!stats[paiement.methode]) {
        stats[paiement.methode] = {
          montant: 0,
          nombre: 0
        };
      }
      stats[paiement.methode].montant += paiement.montant;
      stats[paiement.methode].nombre += 1;
    });
    return stats;
  };

  const calculerStatistiquesParClasse = () => {
    const stats = {};
    classes.forEach(classe => {
      const elevesClasse = eleves.filter(e => e.classe === classe.nom);
      const paiementsClasse = paiementsFiltres.filter(p => {
        const eleve = eleves.find(e => e.id === p.eleveId);
        return eleve && eleve.classe === classe.nom && p.statut === 'payé';
      });
      
      const montantCollecte = paiementsClasse.reduce((sum, p) => sum + p.montant, 0);
      const tauxPaiement = elevesClasse.length > 0 
        ? (paiementsClasse.length / elevesClasse.length) * 100 
        : 0; // Calcul basé sur le nombre de paiements enregistrés, pas l'effectif total

      stats[classe.nom] = {
        effectif: elevesClasse.length,
        montantCollecte,
        nombrePaiements: paiementsClasse.length,
        tauxPaiement
      };
    });
    return stats;
  };

  const obtenirEvolutionMensuelle = () => {
    const evolution = [];
    const currentYear = new Date().getFullYear();
    // Afficher les 3 dernières années pour les options de filtre, mais pour le graphique,
    // on peut étendre l'historique si les données sont disponibles.
    // Pour cet exemple, je vais simplifier l'historique du graphique à l'année sélectionnée.

    // Si la période est "mois", on veut l'évolution sur 12 mois de l'année sélectionnée
    // Si la période est "année", on peut montrer l'évolution des 12 mois de cette année.
    // Si la période est "tout", on peut montrer l'évolution de toutes les années/mois disponibles.

    // Pour simplifier et correspondre à la sélection de l'année, nous allons afficher
    // l'évolution des 12 mois de l'année sélectionnée.
    for (let i = 1; i <= 12; i++) {
        const paiementsMois = paiements.filter(p => {
            const date = new Date(p.datePayment);
            return date.getFullYear() === anneeSelectionnee && 
                   date.getMonth() + 1 === i && 
                   p.statut === 'payé';
        });
        
        const montant = paiementsMois.reduce((sum, p) => sum + p.montant, 0);
        evolution.push({
            year: anneeSelectionnee,
            monthIndex: i - 1, // Pour accéder au tableau mois
            mois: mois[i - 1],
            montant,
            nombre: paiementsMois.length
        });
    }

    return evolution;
  };


  const statsGenerales = calculerStatistiquesGenerales();
  const statsParType = calculerStatistiquesParType();
  const statsParMethode = calculerStatistiquesParMethode();
  const statsParClasse = calculerStatistiquesParClasse();
  const evolutionMensuelle = obtenirEvolutionMensuelle();

  // Déterminer la valeur max pour la hauteur des barres de l'évolution mensuelle
  const maxMontantMensuel = Math.max(...evolutionMensuelle.map(d => d.montant), 0) || 1; // Éviter division par zéro

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques Financières</h1>
          <p className="text-gray-600">Analyse détaillée des revenus et paiements</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
          <button className="btn-secondary flex items-center justify-center shadow-sm hover:shadow-md">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </button>
          <button className="btn-primary flex items-center justify-center shadow-md hover:shadow-lg">
            <Download className="h-4 w-4 mr-2" />
            Exporter rapport
          </button>
        </div>
      </div>

      {/* Filtres de période */}
      <div className="card p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="form-group">
            <label className="form-label">
              Période
            </label>
            <select
              value={periodeSelectionnee}
              onChange={(e) => setPeriodeSelectionnee(e.target.value)}
              className="input-field"
            >
              <option value="mois">Par mois</option>
              <option value="annee">Par année</option>
              <option value="tout">Toute la période</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Année
            </label>
            <select
              value={anneeSelectionnee}
              onChange={(e) => setAnneeSelectionnee(parseInt(e.target.value))}
              className="input-field"
            >
              {/* Générer les années dynamiquement ou fixer une plage */}
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          {periodeSelectionnee === 'mois' && (
            <div className="form-group">
              <label className="form-label">
                Mois
              </label>
              <select
                value={moisSelectionne}
                onChange={(e) => setMoisSelectionne(parseInt(e.target.value))}
                className="input-field"
              >
                {mois.map((m, index) => (
                  <option key={index} value={index + 1}>{m}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-acacia-50 border border-acacia-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-acacia-700">Total collecté</p>
              <p className="text-2xl font-bold text-acacia-900">
                {statsGenerales.totalCollecte.toLocaleString()} FCFA
              </p>
              <div className="flex items-center mt-2">
                {statsGenerales.evolution >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-acacia-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-terre-600 mr-1" />
                )}
                <span className={`text-sm ${statsGenerales.evolution >= 0 ? 'text-acacia-600' : 'text-terre-600'}`}>
                  {Math.abs(statsGenerales.evolution).toFixed(1)}% {statsGenerales.evolution >= 0 ? 'de croissance' : 'de baisse'}
                </span>
              </div>
            </div>
            <DollarSign className="h-12 w-12 text-acacia-600" />
          </div>
        </div>

        <div className="card bg-soleil-50 border border-soleil-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-soleil-700">En attente</p>
              <p className="text-2xl font-bold text-soleil-900">
                {statsGenerales.totalEnAttente.toLocaleString()} FCFA
              </p>
              <p className="text-sm text-soleil-600 mt-2">
                À collecter
              </p>
            </div>
            <Calendar className="h-12 w-12 text-soleil-600" />
          </div>
        </div>

        <div className="card bg-fleuve-50 border border-fleuve-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fleuve-700">Transactions</p>
              <p className="text-2xl font-bold text-fleuve-900">
                {statsGenerales.nombreTransactions}
              </p>
              <p className="text-sm text-fleuve-600 mt-2">
                Paiements reçus
              </p>
            </div>
            <BarChart3 className="h-12 w-12 text-fleuve-600" />
          </div>
        </div>

        <div className="card bg-terre-50 border border-terre-200 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-terre-700">Montant moyen</p>
              <p className="text-2xl font-bold text-terre-900">
                {statsGenerales.montantMoyen.toLocaleString()} FCFA
              </p>
              <p className="text-sm text-terre-600 mt-2">
                Par transaction
              </p>
            </div>
            <DollarSign className="h-12 w-12 text-terre-600" />
          </div>
        </div>
      </div>

      {/* Évolution mensuelle */}
      <div className="card p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Évolution mensuelle {anneeSelectionnee}</h3>
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-4 items-end" style={{ minWidth: '1000px' }}>
            {evolutionMensuelle.length > 0 && maxMontantMensuel > 0 ? (
                evolutionMensuelle.map((data, index) => (
                <div key={index} className="flex-1 min-w-[60px] text-center">
                    <div className="text-xs text-gray-500 mb-2">{data.mois}</div>
                    <div className="relative w-full bg-gray-200 rounded-lg overflow-hidden h-32 flex items-end">
                        <div
                            className="w-full rounded-t-lg transition-all duration-300 ease-in-out bg-fleuve-500 hover:bg-fleuve-600"
                            style={{ 
                                height: `${Math.max((data.montant / maxMontantMensuel) * 100, 2)}%`,
                            }}
                            title={`${data.montant.toLocaleString()} FCFA`}
                        ></div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 mt-2">
                        {(data.montant / 1000).toFixed(0)}k
                    </div>
                    <div className="text-xs text-gray-500">
                        {data.nombre} paiements
                    </div>
                </div>
                ))
            ) : (
                <div className="w-full text-center py-12">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune donnée de paiement pour cette période.</p>
                </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statistiques par type de paiement */}
        <div className="card p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Revenus par type</h3>
          <div className="space-y-4">
            {Object.entries(statsParType).length > 0 ? (
              Object.entries(statsParType)
                .sort(([,a], [,b]) => b.montant - a.montant)
                .map(([type, stats]) => {
                  const pourcentage = (stats.montant / statsGenerales.totalCollecte) * 100;
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{type}</span>
                        <span className="text-sm text-gray-600">
                          {stats.montant.toLocaleString()} FCFA ({pourcentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-fleuve-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${pourcentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {stats.nombre} transaction{stats.nombre > 1 ? 's' : ''}
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucune donnée de revenu par type de paiement.</p>
              </div>
            )}
          </div>
        </div>

        {/* Statistiques par méthode de paiement */}
        <div className="card p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Répartition par méthode</h3>
          <div className="space-y-4">
            {Object.entries(statsParMethode).length > 0 ? (
              Object.entries(statsParMethode)
                .sort(([,a], [,b]) => b.montant - a.montant)
                .map(([methode, stats]) => {
                  const pourcentage = (stats.montant / statsGenerales.totalCollecte) * 100;
                  const couleurMethode = {
                      'Orange Money': 'bg-soleil-500',
                      'Wave': 'bg-fleuve-500',
                      'Espèces': 'bg-acacia-500',
                      'Free Money': 'bg-terre-500',
                      'Virement bancaire': 'bg-gray-500',
                      'Chèque': 'bg-gray-500',
                      'Carte bancaire': 'bg-gray-500'
                  }[methode] || 'bg-gray-500';

                  const couleurTexteMethode = {
                      'Orange Money': 'text-soleil-900',
                      'Wave': 'text-fleuve-900',
                      'Espèces': 'text-acacia-900',
                      'Free Money': 'text-terre-900',
                  }[methode] || 'text-gray-900';

                  return (
                    <div key={methode} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${couleurMethode}`}></div>
                        <span className={`text-sm font-medium ${couleurTexteMethode}`}>{methode}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {stats.montant.toLocaleString()} FCFA
                        </div>
                        <div className="text-xs text-gray-500">
                          {pourcentage.toFixed(1)}% • {stats.nombre} paiements
                        </div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucune donnée de répartition par méthode de paiement.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistiques par classe */}
      <div className="card p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance par classe</h3>
        <div className="overflow-x-auto">
          {Object.entries(statsParClasse).length > 0 ? (
            <>
              {/* Version desktop */}
              <div className="hidden md:block table-container">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-header-cell">
                        Classe
                      </th>
                      <th className="table-header-cell">
                        Effectif
                      </th>
                      <th className="table-header-cell">
                        Montant collecté
                      </th>
                      <th className="table-header-cell">
                        Paiements
                      </th>
                      <th className="table-header-cell">
                        Taux de paiement
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {Object.entries(statsParClasse)
                      .sort(([,a], [,b]) => b.montantCollecte - a.montantCollecte)
                      .map(([classe, stats]) => (
                        <tr key={classe} className="table-row">
                          <td className="table-cell font-medium text-gray-900">
                            {classe}
                          </td>
                          <td className="table-cell">
                            {stats.effectif} élèves
                          </td>
                          <td className="table-cell">
                            {stats.montantCollecte.toLocaleString()} FCFA
                          </td>
                          <td className="table-cell">
                            {stats.nombrePaiements}
                          </td>
                          <td className="table-cell">
                            <div className="flex items-center">
                              <div className="w-20 bg-gray-200 rounded-full h-2.5 mr-3">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    stats.tauxPaiement >= 80 ? 'bg-acacia-500' :
                                    stats.tauxPaiement >= 60 ? 'bg-soleil-500' :
                                    'bg-terre-500'
                                  }`}
                                  style={{ width: `${Math.min(stats.tauxPaiement, 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {stats.tauxPaiement.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Version mobile */}
              <div className="md:hidden space-y-4">
                {Object.entries(statsParClasse)
                  .sort(([,a], [,b]) => b.montantCollecte - a.montantCollecte)
                  .map(([classe, stats]) => (
                    <div key={classe} className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-900">{classe}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                          stats.tauxPaiement >= 80 ? 'bg-acacia-100 text-acacia-800 border-acacia-200' :
                          stats.tauxPaiement >= 60 ? 'bg-soleil-100 text-soleil-800 border-soleil-200' :
                          'bg-terre-100 text-terre-800 border-terre-200'
                        }`}>
                          {stats.tauxPaiement.toFixed(1)}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-600 uppercase">Effectif</div>
                          <div className="text-sm font-medium text-gray-900">{stats.effectif} élèves</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 uppercase">Paiements</div>
                          <div className="text-sm font-medium text-gray-900">{stats.nombrePaiements}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-xs text-gray-600 uppercase">Montant collecté</div>
                          <div className="text-lg font-bold text-gray-900">
                            {stats.montantCollecte.toLocaleString()} FCFA
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune donnée de performance par classe pour cette période.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatistiquesFinancieres;
