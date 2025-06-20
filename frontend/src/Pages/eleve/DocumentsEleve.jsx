import {
  BookOpen, // Pour la matière
  Calendar // Pour la date d'ajout
  ,


  Download,
  Eye,
  FileText,
  Filter, // Pour les icônes de détails
  GraduationCap,
  Search
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext';

const DocumentsEleve = () => {
  const { utilisateur, donnees } = useAuth();
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [filtreType, setFiltreType] = useState('');
  const [filtreMatiere, setFiltreMatiere] = useState('');

  // Les documents sont déjà filtrés par la classe de l'élève via obtenirDonneesParRole
  const documents = donnees.documents || [];
  const profil = donnees.profil || {}; // Profil de l'élève connecté

  const documentsFiltres = documents.filter(doc => {
    // S'assurer que doc.titre existe avant d'appeler toLowerCase()
    const correspondRecherche = doc.titre?.toLowerCase().includes(rechercheTexte.toLowerCase());
    const correspondType = !filtreType || doc.type === filtreType;
    const correspondMatiere = !filtreMatiere || doc.matiere === filtreMatiere;
    return correspondRecherche && correspondType && correspondMatiere;
  });

  // Récupérer les matières uniques des documents disponibles pour cet élève
  const matieresUniques = [...new Set(documents.map(doc => doc.matiere))].sort();

  const documentTypesOptions = [
    { value: 'cours', label: 'Cours' },
    { value: 'exercices', label: 'Exercices' },
    { value: 'devoirs', label: 'Devoirs' },
    { value: 'corrections', label: 'Corrections' },
    { value: 'evaluations', label: 'Évaluations' },
  ];

  const obtenirIconeType = (type) => {
    switch (type) {
      case 'cours':
        return <BookOpen className="h-6 w-6 text-fleuve-600" />;
      case 'exercices':
        return <FileText className="h-6 w-6 text-acacia-600" />;
      case 'devoirs':
        return <FileText className="h-6 w-6 text-soleil-600" />;
      case 'corrections':
        return <FileText className="h-6 w-6 text-terre-600" />;
      case 'evaluations':
        return <FileText className="h-6 w-6 text-terre-600" />; // Ou une autre couleur/icône pour les évaluations
      default:
        return <FileText className="h-6 w-6 text-gray-600" />;
    }
  };

  const obtenirCouleurType = (type) => {
    switch (type) {
      case 'cours':
        return 'bg-fleuve-100 text-fleuve-800 border-fleuve-200';
      case 'exercices':
        return 'bg-acacia-100 text-acacia-800 border-acacia-200';
      case 'devoirs':
        return 'bg-soleil-100 text-soleil-800 border-soleil-200';
      case 'corrections':
        return 'bg-terre-100 text-terre-800 border-terre-200';
      case 'evaluations':
        return 'bg-terre-100 text-terre-800 border-terre-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Documents</h1>
          <p className="text-gray-600">Accédez à vos ressources pédagogiques - Classe <span className="font-semibold text-fleuve-700">{profil.classe || 'N/A'}</span></p>
        </div>
      </div>

      {/* Filtres */}
      <div className="card p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative form-group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={rechercheTexte}
              onChange={(e) => setRechercheTexte(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          <div className="form-group">
            <select
              value={filtreType}
              onChange={(e) => setFiltreType(e.target.value)}
              className="input-field"
            >
              <option value="">Tous les types</option>
              {documentTypesOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
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
              {matieresUniques.map(matiere => (
                <option key={matiere} value={matiere}>{matiere}</option>
              ))}
            </select>
          </div>
          {/* Exemple de bouton "Plus de filtres" si vous en avez besoin, sinon retirez le */}
          <div className="form-group">
            <button className="w-full btn-secondary flex items-center justify-center shadow-sm hover:shadow-md h-[42px]">
              <Filter className="h-4 w-4 mr-2" />
              Plus de filtres
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {documentTypesOptions.map(typeOption => {
          const count = documents.filter(doc => doc.type === typeOption.value).length;
          return (
            <div key={typeOption.value} className={`card p-4 text-center shadow-sm border ${obtenirCouleurType(typeOption.value).split(' ')[2]}`}> {/* Extraction de la bordure */}
              <div className="flex justify-center mb-2">
                {obtenirIconeType(typeOption.value)}
              </div>
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{typeOption.label}</div>
            </div>
          );
        })}
      </div>

      {/* Liste des documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documentsFiltres.length > 0 ? (
          documentsFiltres.map((document) => (
            <div key={document.id} className="card p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-gray-100 p-3 rounded-lg flex-shrink-0"> {/* flex-shrink-0 pour icône ne rétrécisse pas */}
                  {obtenirIconeType(document.type)}
                </div>
                <div className="flex-1 min-w-0"> {/* min-w-0 pour permettre au texte de tronquer */}
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                    {document.titre}
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${obtenirCouleurType(document.type)}`}>
                    {document.type}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-soleil-600" />
                  <span>{document.matiere}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-acacia-600" />
                  <span>{document.format} • {document.taille}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-4 w-4 mr-2 text-fleuve-600" />
                  Ajouté le {new Date(document.dateAjout).toLocaleDateString('fr-FR')}
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 btn-primary flex items-center justify-center text-sm shadow-sm hover:shadow-md py-2.5">
                  <Download className="h-4 w-4 mr-1" />
                  Télécharger
                </button>
                <button className="flex-1 btn-secondary flex items-center justify-center text-sm shadow-sm hover:shadow-md py-2.5">
                  <Eye className="h-4 w-4 mr-1" />
                  Aperçu
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="lg:col-span-3 text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun document trouvé pour cette sélection.</p>
            <p className="text-gray-400 text-sm mt-2">
              {documents.length === 0 
                ? "Aucun document n'a encore été partagé pour votre classe."
                : "Essayez d'ajuster vos filtres de recherche."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsEleve;