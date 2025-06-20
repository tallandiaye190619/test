import {
  Calendar,
  Download,
  Eye,
  FileText,
  Filter, // Pour la classe
  GraduationCap // Pour la matière
  , // Assurez-vous que Filter est importé si vous l'utilisez
  Info,
  Plus, // Pour la date d'ajout
  School,
  Search,
  Trash2,
  Upload,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext';

const Documents = () => {
  const { utilisateur, donnees } = useAuth();
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [filtreClasse, setFiltreClasse] = useState('');
  const [filtreType, setFiltreType] = useState('');
  const [modalOuverte, setModalOuverte] = useState(false);
  const [documentSelectionne, setDocumentSelectionne] = useState(null);
  const [typeModal, setTypeModal] = useState(''); // Pour gérer "ajouter" ou "voir"

  const mesClasses = donnees.classes || [];
  const documents = donnees.documents || [];

  const documentsFiltres = documents.filter(doc => {
    const correspondRecherche = doc.titre?.toLowerCase().includes(rechercheTexte.toLowerCase());
    const correspondClasse = !filtreClasse || doc.classe === filtreClasse;
    const correspondType = !filtreType || doc.type === filtreType;
    return correspondRecherche && correspondClasse && correspondType;
  });

  const ouvrirModal = (type, document = null) => {
    setTypeModal(type); // Définit le type du modal (par exemple, 'ajouter' ou 'voir')
    setDocumentSelectionne(document);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setDocumentSelectionne(null);
    setTypeModal(''); // Réinitialise le type de modal
  };

  const FormulaireDocument = () => {
    const [formData, setFormData] = useState(documentSelectionne || {
      titre: '',
      type: 'cours',
      classe: '',
      matiere: utilisateur?.matiere || '',
      description: ''
    });

    const gererSoumission = (e) => {
      e.preventDefault();
      console.log('Upload document:', formData);
      // Implémenter la logique d'upload ici
      fermerModal();
    };

    const documentTypes = [
      { value: 'cours', label: 'Cours' },
      { value: 'exercices', label: 'Exercices' },
      { value: 'devoirs', label: 'Devoirs' },
      { value: 'corrections', label: 'Corrections' },
      { value: 'evaluations', label: 'Évaluations' },
    ];

    return (
      <form onSubmit={gererSoumission} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Titre du document *</label>
            <input
              type="text"
              value={formData.titre}
              onChange={(e) => setFormData({...formData, titre: e.target.value})}
              className="input-field"
              placeholder="Ex: Cours de Mathématiques - Chapitre 1"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Type de document *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="input-field"
              required
            >
              {documentTypes.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Classe *</label>
            <select
              value={formData.classe}
              onChange={(e) => setFormData({...formData, classe: e.target.value})}
              className="input-field"
              required
            >
              <option value="">Sélectionner une classe</option>
              {mesClasses.map(classe => (
                <option key={classe.id} value={classe.nom}>{classe.nom}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Matière</label>
            <input
              type="text"
              value={formData.matiere}
              onChange={(e) => setFormData({...formData, matiere: e.target.value})}
              className="input-field"
              placeholder="Matière"
            />
          </div>
          <div className="md:col-span-2 form-group">
            <label className="form-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="input-field"
              rows="3"
              placeholder="Description du document..."
            />
          </div>
          <div className="md:col-span-2 form-group">
            <label className="form-label">Fichier *</label>
            <div className="border-2 border-dashed border-fleuve-300 rounded-lg p-6 text-center hover:border-fleuve-500 hover:bg-fleuve-50 transition-all duration-200 cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-fleuve-400 mb-2" />
              <div className="mt-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="block text-sm font-medium text-fleuve-700 hover:text-fleuve-900 transition-colors">
                    Cliquez pour sélectionner un fichier
                  </span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  PDF, DOC, DOCX, PPT, PPTX jusqu'à 10MB
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button type="button" onClick={fermerModal} className="btn-secondary shadow-sm hover:shadow-md">
            Annuler
          </button>
          <button type="submit" className="btn-primary flex items-center shadow-md hover:shadow-lg">
            <Upload className="h-4 w-4 mr-2" />
            Télécharger
          </button>
        </div>
      </form>
    );
  };

  const documentTypesForFilter = [
    { value: 'cours', label: 'Cours' },
    { value: 'exercices', label: 'Exercices' },
    { value: 'devoirs', label: 'Devoirs' },
    { value: 'corrections', label: 'Corrections' },
    { value: 'evaluations', label: 'Évaluations' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Documents</h1>
          <p className="text-gray-600">Gérez vos documents pédagogiques</p>
        </div>
        <button
          onClick={() => ouvrirModal('ajouter')} // Ouvre le modal pour ajouter
          className="btn-primary flex items-center shadow-md hover:shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Document
        </button>
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
              value={filtreClasse}
              onChange={(e) => setFiltreClasse(e.target.value)}
              className="input-field"
            >
              <option value="">Toutes les classes</option>
              {mesClasses.map(classe => (
                <option key={classe.id} value={classe.nom}>{classe.nom}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <select
              value={filtreType}
              onChange={(e) => setFiltreType(e.target.value)}
              className="input-field"
            >
              <option value="">Tous les types</option>
              {documentTypesForFilter.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <button className="w-full btn-secondary flex items-center justify-center shadow-sm hover:shadow-md h-[42px]">
              <Filter className="h-4 w-4 mr-2" />
              Plus de filtres
            </button>
          </div>
        </div>
      </div>

      {/* Liste des documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documentsFiltres.length > 0 ? (
          documentsFiltres.map((document) => (
            <div key={document.id} className="card p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-fleuve-100 p-3 rounded-lg shadow-inner">
                    <FileText className="h-7 w-7 text-fleuve-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{document.titre}</h3>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-acacia-100 text-acacia-800 border border-acacia-200 mt-1">
                      {document.type}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => ouvrirModal('voir', document)} // Ouvre le modal en mode "voir"
                    className="p-2 rounded-full text-fleuve-600 hover:bg-fleuve-50 hover:text-fleuve-800 transition-colors duration-200"
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 rounded-full text-terre-600 hover:bg-terre-50 hover:text-terre-800 transition-colors duration-200"
                    title="Supprimer le document"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center"><span className="font-medium mr-1">Classe:</span> {document.classe}</div>
                <div className="flex items-center"><span className="font-medium mr-1">Matière:</span> {document.matiere}</div>
                <div className="flex items-center"><span className="font-medium mr-1">Ajouté le:</span> {new Date(document.dateAjout).toLocaleDateString('fr-FR')}</div>
                <div className="flex items-center"><span className="font-medium mr-1">Taille:</span> {document.taille}</div>
              </div>

              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => console.log('Télécharger document:', document.id)}
                  className="flex-1 btn-primary flex items-center justify-center text-base shadow-sm hover:shadow-md py-2.5"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Télécharger
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="lg:col-span-3 text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun document trouvé pour cette sélection.</p>
            <p className="text-gray-400 text-sm mt-2">Commencez par ajouter vos premiers documents ou ajustez vos filtres.</p>
          </div>
        )}
      </div>

      {/* Modal - Unifié pour l'ajout et la visualisation détaillée */}
      {modalOuverte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {typeModal === 'ajouter' ? 'Ajouter un nouveau document' : 'Détails du document'}
                </h3>
                <button
                  onClick={fermerModal}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Fermer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {typeModal === 'voir' && documentSelectionne ? (
                // Contenu pour la visualisation des détails du document
                <div className="space-y-4 fade-in">
                  <div className="text-center bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
                    <FileText className="h-16 w-16 text-fleuve-600 mx-auto mb-4" />
                    <h4 className="text-2xl font-bold text-gray-900">{documentSelectionne.titre}</h4>
                    <span className="inline-flex mt-2 px-3 py-1 text-sm font-semibold rounded-full bg-acacia-100 text-acacia-800 border border-acacia-200">
                      {documentSelectionne.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Classe</p>
                      <p className="text-base text-gray-900 font-semibold flex items-center">
                        <School className="h-5 w-5 mr-2 text-fleuve-600" />
                        {documentSelectionne.classe}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Matière</p>
                      <p className="text-base text-gray-900 font-semibold flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2 text-soleil-600" />
                        {documentSelectionne.matiere}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Date d'ajout</p>
                      <p className="text-base text-gray-900 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-acacia-600" />
                        {new Date(documentSelectionne.dateAjout).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Taille</p>
                      <p className="text-base text-gray-900 font-semibold">
                        {documentSelectionne.taille}
                      </p>
                    </div>
                  </div>
                  {documentSelectionne.description && (
                    <div className="bg-soleil-50 p-4 rounded-lg border border-soleil-200 shadow-sm">
                      <p className="text-sm font-medium text-soleil-900 flex items-center mb-1">
                        <Info className="h-5 w-5 mr-2 text-soleil-600" /> Description
                      </p>
                      <p className="text-soleil-800 mt-1">{documentSelectionne.description}</p>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => console.log('Télécharger document depuis modal:', documentSelectionne.id)}
                      className="btn-primary flex items-center justify-center shadow-md hover:shadow-lg"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </button>
                    {/* Ajoutez ici un bouton "Modifier" si vous souhaitez la fonctionnalité d'édition depuis ce modal */}
                    {/* <button className="btn-secondary flex items-center justify-center shadow-sm hover:shadow-md">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </button> */}
                  </div>
                </div>
              ) : (
                // Formulaire d'ajout/modification de document
                <FormulaireDocument />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;