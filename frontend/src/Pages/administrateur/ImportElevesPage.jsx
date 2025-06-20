import { AlertCircle, Check, Download, FileText, Info, Upload, X } from 'lucide-react';
import { useState } from 'react';

const ImportElevesPage = () => {
  const [fichierSelectionne, setFichierSelectionne] = useState(null);
  const [donneesPreview, setDonneesPreview] = useState([]);
  const [etapeImport, setEtapeImport] = useState('selection'); // 'selection', 'preview', 'traitement', 'termine'
  const [erreurs, setErreurs] = useState([]);
  const [progression, setProgression] = useState(0);

  // Données simulées pour l'exemple
  const exempleCSV = `prenom,nom,sexe,dateNaissance,classe,telephoneParent,emailParent
Ibrahima,Sarr,M,2010-05-15,6ème A,77 345 67 89,fatou.sow@parent.sn
Aissatou,Diallo,F,2011-03-22,CM2,77 456 78 90,diallo.parent@email.sn
Mamadou,Ndiaye,M,2009-08-10,5ème B,77 567 89 01,ndiaye.parent@email.sn`;

  const campsRequis = [
    { nom: 'prenom', label: 'Prénom', type: 'text' },
    { nom: 'nom', label: 'Nom', type: 'text' },
    { nom: 'sexe', label: 'Sexe (M/F)', type: 'text' },
    { nom: 'dateNaissance', label: 'Date de naissance (YYYY-MM-DD)', type: 'date' },
    { nom: 'classe', label: 'Classe', type: 'text' },
    { nom: 'telephoneParent', label: 'Téléphone parent', type: 'text' },
    { nom: 'emailParent', label: 'Email parent', type: 'email' }
  ];

  const gererSelectionFichier = (event) => {
    const fichier = event.target.files[0];
    if (fichier) {
      setFichierSelectionne(fichier);
      simulerLectureFichier(fichier);
    }
  };

  const simulerLectureFichier = (fichier) => {
    // Simulation de la lecture d'un fichier CSV
    const reader = new FileReader();
    reader.onload = (e) => {
      const contenu = e.target.result;
      const lignes = contenu.split('\n');
      const entetes = lignes[0].split(',').map(h => h.trim());
      
      const donnees = [];
      const erreursDetectees = [];
      
      for (let i = 1; i < lignes.length; i++) {
        if (lignes[i].trim()) {
          const valeurs = lignes[i].split(',').map(v => v.trim());
          const objet = {};
          
          entetes.forEach((entete, index) => {
            objet[entete] = valeurs[index] || '';
          });
          
          // Validation simple
          const erreursLigne = [];
          campsRequis.forEach(champ => {
            if (!objet[champ.nom]) {
              erreursLigne.push(`${champ.label} manquant`);
            }
            if (champ.nom === 'sexe' && objet[champ.nom] && !['M', 'F'].includes(objet[champ.nom].toUpperCase())) {
              erreursLignes.push('Sexe doit être M ou F');
            }
            if (champ.nom === 'emailParent' && objet[champ.nom] && !objet[champ.nom].includes('@')) {
              erreursLignes.push('Email invalide');
            }
          });
          
          if (erreursLigne.length > 0) {
            erreursDetectees.push({
              ligne: i + 1,
              erreurs: erreursLigne,
              donnees: objet
            });
          }
          
          objet.numeroLigne = i + 1;
          objet.valide = erreursLigne.length === 0;
          donnees.push(objet);
        }
      }
      
      setDonneesPreview(donnees);
      setErreurs(erreursDetectees);
      setEtapeImport('preview');
    };
    
    reader.readAsText(fichier);
  };

  const confirmerImport = () => {
    setEtapeImport('traitement');
    simulerImport();
  };

  const simulerImport = () => {
    let progression = 0;
    const interval = setInterval(() => {
      progression += 10;
      setProgression(progression);
      
      if (progression >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setEtapeImport('termine');
        }, 500);
      }
    }, 200);
  };

  const recommencer = () => {
    setFichierSelectionne(null);
    setDonneesPreview([]);
    setErreurs([]);
    setProgression(0);
    setEtapeImport('selection');
  };

  const telechargerModele = () => {
    const element = document.createElement('a');
    const fichier = new Blob([exempleCSV], { type: 'text/csv' });
    element.href = URL.createObjectURL(fichier);
    element.download = 'modele_import_eleves.csv';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (etapeImport === 'selection') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Import d'Élèves</h1>
          <p className="text-gray-600">Importez plusieurs élèves à partir d'un fichier CSV ou Excel</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Zone d'upload */}
          <div className="card p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Sélectionner un fichier</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors duration-200 hover:border-fleuve-400 hover:bg-fleuve-50 cursor-pointer">
              <Upload className="mx-auto h-16 w-16 text-fleuve-400 mb-6 animate-bounce" />
              <div className="space-y-3">
                <p className="text-lg font-semibold text-gray-900">
                  Glissez votre fichier ici ou cliquez pour sélectionner
                </p>
                <p className="text-sm text-gray-500">
                  Formats acceptés: CSV, Excel (.xlsx, .xls)
                </p>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={gererSelectionFichier}
                  className="hidden"
                  id="fichier-upload"
                />
                <label
                  htmlFor="fichier-upload"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-all duration-200"
                >
                  <FileText className="h-5 w-5 mr-3" />
                  Choisir un fichier
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={telechargerModele}
                className="btn-secondary flex items-center shadow-sm hover:shadow-md"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger le modèle CSV
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="card p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Instructions d'import</h3>
            
            <div className="space-y-4">
              <div className="bg-fleuve-50 p-4 rounded-lg border border-fleuve-200 shadow-sm">
                <h4 className="font-semibold text-fleuve-900 mb-2 flex items-center">
                    <Info className="h-5 w-5 mr-2" /> Format requis
                </h4>
                <p className="text-sm text-fleuve-700">
                  Votre fichier doit contenir les colonnes suivantes avec les noms exacts :
                </p>
              </div>

              <div className="space-y-2">
                {campsRequis.map((champ, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-md bg-gray-50 border border-gray-100">
                    <div className="w-2 h-2 bg-fleuve-600 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">{champ.nom}</span>
                    <span className="text-sm text-gray-500">- {champ.label}</span>
                  </div>
                ))}
              </div>

              <div className="bg-soleil-50 p-4 rounded-lg border border-soleil-200 shadow-sm">
                <h4 className="font-semibold text-soleil-900 mb-2 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" /> Points importants
                </h4>
                <ul className="text-sm text-soleil-700 space-y-1 list-disc pl-5">
                  <li>La première ligne doit contenir les noms des colonnes</li>
                  <li>Le sexe doit être 'M' pour masculin ou 'F' pour féminin</li>
                  <li>La date de naissance au format YYYY-MM-DD</li>
                  <li>L'email parent doit être valide</li>
                  <li>Maximum 500 élèves par import</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (etapeImport === 'preview') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Aperçu des données</h1>
            <p className="text-gray-600">
              Vérifiez les données avant de confirmer l'import
            </p>
          </div>
          <div className="flex space-x-3">
            <button onClick={recommencer} className="btn-secondary shadow-sm hover:shadow-md">
              Annuler
            </button>
            <button
              onClick={confirmerImport}
              disabled={erreurs.length > 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              Confirmer l'import
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-acacia-50 border border-acacia-200 p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <Check className="h-8 w-8 text-acacia-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-acacia-900">
                  {donneesPreview.filter(d => d.valide).length}
                </p>
                <p className="text-sm text-acacia-700">Élèves valides</p>
              </div>
            </div>
          </div>
          <div className="card bg-terre-50 border border-terre-200 p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <X className="h-8 w-8 text-terre-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-terre-900">{erreurs.length}</p>
                <p className="text-sm text-terre-700">Erreurs detectées</p>
              </div>
            </div>
          </div>
          <div className="card bg-fleuve-50 border border-fleuve-200 p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-fleuve-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-fleuve-900">{donneesPreview.length}</p>
                <p className="text-sm text-fleuve-700">Total lignes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Erreurs */}
        {erreurs.length > 0 && (
          <div className="card bg-terre-50 border border-terre-200 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-terre-900 mb-4 flex items-center">
              <AlertCircle className="h-6 w-6 mr-2" />
              Erreurs à corriger
            </h3>
            <div className="space-y-3">
              {erreurs.slice(0, 5).map((erreur, index) => (
                <div key={index} className="bg-white p-3 rounded border border-terre-200 shadow-sm">
                  <p className="font-medium text-terre-900">Ligne {erreur.ligne}</p>
                  <p className="text-sm text-terre-700">
                    {erreur.donnees.prenom} {erreur.donnees.nom}
                  </p>
                  <ul className="text-sm text-terre-600 mt-1 list-disc pl-4">
                    {erreur.erreurs.map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                  </ul>
                </div>
              ))}
              {erreurs.length > 5 && (
                <p className="text-sm text-terre-600 mt-4 text-center">
                  ... et {erreurs.length - 5} autres erreurs. Veuillez corriger le fichier et réessayez.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Aperçu des données valides */}
        {donneesPreview.filter(d => d.valide).length > 0 && (
          <div className="card p-0 table-container shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 p-4 border-b border-gray-200">
              Aperçu des élèves à importer
            </h3>
            <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">
                      Prénom
                    </th>
                    <th className="table-header-cell">
                      Nom
                    </th>
                    <th className="table-header-cell">
                      Sexe
                    </th>
                    <th className="table-header-cell">
                      Classe
                    </th>
                    <th className="table-header-cell">
                      Téléphone Parent
                    </th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {donneesPreview.filter(d => d.valide).slice(0, 10).map((eleve, index) => (
                    <tr key={index} className="table-row">
                      <td className="table-cell">
                        {eleve.prenom}
                      </td>
                      <td className="table-cell">
                        {eleve.nom}
                      </td>
                      <td className="table-cell">
                        {eleve.sexe === 'M' ? 'Masculin' : 'Féminin'}
                      </td>
                      <td className="table-cell">
                        {eleve.classe}
                      </td>
                      <td className="table-cell">
                        {eleve.telephoneParent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            {donneesPreview.filter(d => d.valide).length > 10 && (
              <p className="text-sm text-gray-500 mt-4 text-center pb-4">
                ... et {donneesPreview.filter(d => d.valide).length - 10} autres élèves.
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (etapeImport === 'traitement') {
    return (
      <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
        <div className="text-center bg-white p-8 rounded-lg shadow-xl border border-gray-100">
          <div className="w-16 h-16 border-4 border-fleuve-200 border-t-fleuve-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Import en cours...</h2>
          <p className="text-gray-600 mb-4">Veuillez patienter pendant l'import des élèves</p>
          <div className="w-64 bg-gray-200 rounded-full h-3 mx-auto">
            <div
              className="bg-fleuve-600 h-3 rounded-full transition-all duration-300 ease-linear" 
              style={{ width: `${progression}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-3 font-semibold">{progression}%</p>
        </div>
      </div>
    );
  }

  if (etapeImport === 'termine') {
    return (
      <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
        <div className="text-center bg-white p-8 rounded-lg shadow-xl border border-gray-100">
          <div className="w-16 h-16 bg-acacia-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-acacia-600" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Import terminé avec succès!</h2>
          <p className="text-gray-600 mb-6">
            <span className="font-semibold text-acacia-700">
              {donneesPreview.filter(d => d.valide).length}
            </span> élèves ont été importés avec succès.
            {erreurs.length > 0 && (
                <span className="text-terre-600 ml-2">({erreurs.length} erreurs non corrigées.)</span>
            )}
          </p>
          <div className="space-x-3">
            <button onClick={recommencer} className="btn-secondary shadow-sm hover:shadow-md">
              Nouvel import
            </button>
            <button
              onClick={() => window.location.href = '/eleves'}
              className="btn-primary shadow-md hover:shadow-lg"
            >
              Voir les élèves
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default ImportElevesPage;
