import {
  BookOpen,
  Calendar,
  Eye,
  FileText,
  Search,
  Users,
  X // Assurez-vous que X est importé pour le bouton de fermeture du modal
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/MonContext';

const MesClasses = () => {
  const { utilisateur, donnees } = useAuth();
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [classeSelectionnee, setClasseSelectionnee] = useState(null);
  const [modalOuverte, setModalOuverte] = useState(false);

  const toutesLesClasses = donnees.classes || [];
  const tousLesEleves = donnees.eleves || [];
  const tousLesEnseignants = donnees.enseignants || [];

  const estEnseignantConnecte = utilisateur && utilisateur.role === 'enseignant';
  
  const mesClasses = estEnseignantConnecte
    ? toutesLesClasses.filter(classe => {
        // Le filtrage se fait maintenant par enseignantPrincipalId dans l'objet classe
        return classe.enseignantPrincipalId === utilisateur.id;
      })
    : [];

  const classesFiltrees = mesClasses.filter(classe =>
    classe.nom?.toLowerCase().includes(rechercheTexte.toLowerCase())
  );

  const obtenirElevesClasse = (nomClasse) => {
    return tousLesEleves.filter(eleve => eleve.classe === nomClasse);
  };

  const ouvrirModal = (classe) => {
    setClasseSelectionnee(classe);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setClasseSelectionnee(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Classes</h1>
          <p className="text-gray-600">Gérez vos classes et vos élèves</p>
        </div>
      </div>

      {/* Recherche */}
      <div className="card p-6 shadow-sm">
        <div className="relative form-group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher une classe..."
            value={rechercheTexte}
            onChange={(e) => setRechercheTexte(e.target.value)}
            className="pl-10 input-field"
          />
        </div>
      </div>

      {/* Grille des classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mesClasses.length === 0 && rechercheTexte === '' ? (
          <div className="lg:col-span-3 text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune classe ne vous est actuellement assignée.</p>
            <p className="text-gray-400 text-sm mt-2">Veuillez contacter l'administrateur pour l'attribution des classes.</p>
          </div>
        ) : classesFiltrees.length > 0 ? (
          classesFiltrees.map((classe) => {
            const elevesClasse = obtenirElevesClasse(classe.nom);
            
            return (
              <div key={classe.id} className="card p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{classe.nom}</h3>
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-fleuve-100 text-fleuve-800 border border-fleuve-200">
                      {classe.niveau}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => ouvrirModal(classe)}
                      className="p-2 rounded-full text-fleuve-600 hover:bg-fleuve-50 hover:text-fleuve-800 transition-colors duration-200"
                      title="Voir les détails"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-700">
                    <Users className="h-4 w-4 mr-2 text-fleuve-600" />
                    <span className="font-medium text-gray-900">{elevesClasse.length}</span> élèves
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Calendar className="h-4 w-4 mr-2 text-acacia-600" />
                    <span>Salle {classe.salle || 'Non définie'}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <button className="w-full btn-primary flex items-center justify-center shadow-sm hover:shadow-md">
                    <FileText className="h-4 w-4 mr-2" />
                    Gestion des notes
                  </button>
                  <button className="w-full btn-secondary flex items-center justify-center shadow-sm hover:shadow-md">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Documents
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="lg:col-span-3 text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune classe ne correspond à votre recherche.</p>
            <p className="text-gray-400 text-sm mt-2">Veuillez vérifier l'orthographe ou essayer un autre terme.</p>
          </div>
        )}
      </div>

      {/* Modal détails classe */}
      {modalOuverte && classeSelectionnee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in"> {/* Taille du modal ajustée à max-w-xl */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-xl font-medium text-gray-900 flex items-center">
                  <Users className="h-6 w-6 mr-2 text-fleuve-600" />
                  Élèves de {classeSelectionnee.nom}
                </h3>
                <button
                  onClick={fermerModal}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Fermer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Section Informations Générales de la classe dans le modal (ajoutée pour l'esthétique) */}
                <div className="bg-soleil-50 p-4 rounded-lg border border-soleil-200 shadow-inner text-soleil-900">
                  <h4 className="text-lg font-semibold mb-2 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-soleil-600" /> Informations de la classe
                  </h4>
                  <p className="text-base">
                    **Niveau:** {classeSelectionnee.niveau}
                  </p>
                  <p className="text-base">
                    **Salle:** {classeSelectionnee.salle || 'Non définie'}
                  </p>
                  <p className="text-base">
                    **Enseignant Principal:** {classeSelectionnee.enseignantPrincipal || 'Non assigné'}
                  </p>
                </div>

                {/* Section Liste des élèves */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-fleuve-600" />
                    Liste des élèves ({obtenirElevesClasse(classeSelectionnee.nom).length})
                  </h4>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-3"> {/* Scrollbar pour la liste des élèves */}
                    {obtenirElevesClasse(classeSelectionnee.nom).length > 0 ? (
                      obtenirElevesClasse(classeSelectionnee.nom).map((eleve) => (
                        <div key={eleve.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          <img
                            src={eleve.photo || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                            alt={`${eleve.prenom} ${eleve.nom}`}
                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {eleve.prenom} {eleve.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {eleve.numeroMatricule}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">Aucun élève trouvé dans cette classe.</p>
                    )}
                  </div>
                </div>

                {/* Boutons d'action du modal (peut-être pas pertinents pour un simple "voir") */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={fermerModal} className="btn-secondary">
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesClasses;