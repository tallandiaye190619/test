import {
  AlertCircle,
  ArrowLeftCircle, // Pour les boutons de navigation du slider
  ArrowRightCircle, // Pour les boutons de navigation du slider
  Bell // Pour les notifications
  ,


  BookOpen,
  Calendar,
  CheckCircle,
  DollarSign,
  GraduationCap,
  Icon,
  TrendingDown,
  TrendingUp, // Importation correcte pour TrendingDown
  Users
} from 'lucide-react';
import { useMemo, useRef } from 'react'; // Import de useMemo et useRef
import { useAuth } from '../context/MonContext';

const TableauDeBord = () => {
  const { utilisateur, donnees } = useAuth();
  const sliderRef = useRef(null);

  // Calcul de mesClassesEnseignant plus tôt, pour être disponible
  const mesClassesEnseignant = useMemo(() => {
    // S'assurer que donnees.classes est un tableau pour le filtre
    return donnees.classes?.filter(classe =>
      classe.enseignantPrincipalId === utilisateur?.id
    ) || [];
  }, [donnees.classes, utilisateur]);

  // La fonction obtient maintenant mesClassesEnseignant en paramètre
  const obtenirStatistiquesParRole = (classesEnseignees) => {
    switch (utilisateur?.role) {
      case 'administrateur':
        return [
          {
            titre: 'Total Élèves',
            valeur: donnees.eleves?.length || 0, // Utilisation directe de donnees.eleves
            icone: Users,
            couleurBg: 'bg-fleuve-500', // Couleurs plus vives pour l'administrateur
            couleurText: 'text-white', // Texte blanc pour contraste
            couleurIcon: 'text-white',
            tendance: '+5%'
          },
          {
            titre: 'Enseignants',
            valeur: donnees.enseignants?.length || 0, // Utilisation directe de donnees.enseignants
            icone: GraduationCap,
            couleurBg: 'bg-acacia-500',
            couleurText: 'text-white',
            couleurIcon: 'text-white',
            tendance: '+2%'
          },
          {
            titre: 'Classes',
            valeur: donnees.classes?.length || 0, // Utilisation directe de donnees.classes
            icone: BookOpen,
            couleurBg: 'bg-soleil-500',
            couleurText: 'text-white',
            couleurIcon: 'text-white',
            tendance: '0%'
          },
          {
            titre: 'Revenus (FCFA)',
            valeur: (donnees.paiements?.filter(p => p.statut === 'payé').reduce((sum, p) => sum + p.montant, 0) || 0).toLocaleString(), // Calcul direct
            icone: DollarSign,
            couleurBg: 'bg-terre-500',
            couleurText: 'text-white',
            couleurIcon: 'text-white',
            tendance: '+12%'
          }
        ];
      case 'enseignant':
        const elevesMesClasses = donnees.eleves?.filter(e => classesEnseignees.some(c => c.nom === e.classe)).length || 0;
        const notesSaisies = donnees.notes?.filter(n => n.enseignantId === utilisateur?.id).length || 0;
        const documentsEnseignant = donnees.documents?.filter(d => d.enseignantId === utilisateur?.id).length || 0;
        return [
          {
            titre: 'Mes Classes',
            valeur: classesEnseignees.length || 0,
            icone: BookOpen,
            couleurBg: 'bg-fleuve-500',
            couleurText: 'text-fleuve-900',
            couleurIcon: 'text-white'
          },
          {
            titre: 'Mes Élèves',
            valeur: elevesMesClasses,
            icone: Users,
            couleurBg: 'bg-acacia-500',
            couleurText: 'text-acacia-900',
            couleurIcon: 'text-white'
          },
          {
            titre: 'Notes saisies',
            valeur: notesSaisies,
            icone: CheckCircle,
            couleurBg: 'bg-soleil-500',
            couleurText: 'text-soleil-900',
            couleurIcon: 'text-white'
          },
          {
            titre: 'Documents',
            valeur: documentsEnseignant,
            icone: BookOpen,
            couleurBg: 'bg-terre-500',
            couleurText: 'text-terre-900',
            couleurIcon: 'text-white'
          }
        ];
      case 'eleve':
        const classeEleve = donnees.classes.filter(c => c.id === utilisateur?.classId) || 'N/A'; // Correction: 'N/A' si classeId n'est pas trouvé
        const notesEleve = donnees.notes?.filter(n => n.eleveId === utilisateur?.id).length || 0;
        const documentsEleve = donnees.documents?.filter(d => d.classe === utilisateur?.classe).length || 0;
        const notificationsNonLuesEleve = donnees.notifications?.filter(n => !n.lue && n.destinataires.includes('eleve')).length || 0;
        return [
          {
            titre: 'Ma Classe',
            valeur: utilisateur?.classe || 'N/A',
            icone: BookOpen,
            couleurBg: 'bg-fleuve-500',
            couleurText: 'text-fleuve-900',
            couleurIcon: 'text-white'
          },
          {
            titre: 'Mes Notes',
            valeur: notesEleve,
            icone: CheckCircle,
            couleurBg: 'bg-acacia-500',
            couleurText: 'text-acacia-900',
            couleurIcon: 'text-white'
          },
          {
            titre: 'Documents',
            valeur: documentsEleve,
            icone: BookOpen,
            couleurBg: 'bg-soleil-500',
            couleurText: 'text-soleil-900',
            couleurIcon: 'text-white'
          },
          {
            titre: 'Notifications',
            valeur: notificationsNonLuesEleve,
            icone: AlertCircle,
            couleurBg: 'bg-terre-500',
            couleurText: 'text-terre-900',
            couleurIcon: 'text-white'
          }
        ];
      case 'parent':
        const enfantsP = utilisateur.enfants || []; // Correctement extrait de l'objet utilisateur
        const paiementsPayesParents = donnees.paiements?.filter(p => p.statut === 'payé' && enfantsP.some(e => e.id === p.eleveId)).length || 0;
        const paiementsEnAttenteParents = donnees.paiements?.filter(p => p.statut === 'en_attente' && enfantsP.some(e => e.id === p.eleveId)).length || 0;
        const notificationsNonLuesParent = donnees.notifications?.filter(n => !n.lue && n.destinataires.includes('parent')).length || 0;
        return [
          {
            titre: 'Mes Enfants',
            valeur: enfantsP.length || 0,
            icone: Users,
            couleurBg: 'bg-fleuve-500',
            couleurText: 'text-fleuve-900',
            couleurIcon: 'text-white'
          },
          {
            titre: 'Paiements Payés',
            valeur: paiementsPayesParents,
            icone: CheckCircle,
            couleurBg: 'bg-acacia-500',
            couleurText: 'text-acacia-900',
            couleurIcon: 'text-white'
          },
          {
            titre: 'Paiements Attente',
            valeur: paiementsEnAttenteParents,
            icone: AlertCircle,
            couleurBg: 'bg-soleil-500',
            couleurText: 'text-soleil-900',
            couleurIcon: 'text-white'
          },
          {
            titre: 'Notifications',
            valeur: notificationsNonLuesParent,
            icone: Bell,
            couleurBg: 'bg-terre-500',
            couleurText: 'text-terre-900',
            couleurIcon: 'text-white'
          }
        ];
      case 'comptable':
        return [
          {
            titre: 'Collecté (FCFA)',
            valeur: (donnees.paiements?.filter(p => p.statut === 'payé').reduce((sum, p) => sum + p.montant, 0) || 0).toLocaleString(),
            icone: DollarSign,
            couleurBg: 'bg-acacia-500',
            couleurText: 'text-acacia-900',
            couleurIcon: 'text-white'
          },
          {
            titre: 'Attendu (FCFA)',
            valeur: (donnees.paiements?.filter(p => p.statut === 'en_attente').reduce((sum, p) => sum + p.montant, 0) || 0).toLocaleString(),
            icone: DollarSign,
            couleurBg: 'bg-fleuve-500',
            couleurText: 'text-fleuve-900',
            couleurIcon: 'text-white'
          },
          {
            titre: 'Paiements reçus',
            valeur: donnees.paiements?.filter(p => p.statut === 'payé').length || 0,
            icone: CheckCircle,
            couleurBg: 'bg-soleil-500',
            couleurText: 'text-soleil-900',
            couleurIcon: 'text-white'
          },
          {
            titre: 'En attente',
            valeur: donnees.paiements?.filter(p => p.statut === 'en_attente').length || 0,
            icone: AlertCircle,
            couleurBg: 'bg-terre-500',
            couleurText: 'text-terre-900',
            couleurIcon: 'text-white'
          }
        ];
      default:
        return [];
    }
  };

  // Passe mesClassesEnseignant à la fonction de statistiques
  const statistiques = obtenirStatistiquesParRole(mesClassesEnseignant);

  const obtenirActivitesRecentes = () => {
    const activites = [];
    
    // Ajoutez des activités spécifiques pour l'administrateur
    if (utilisateur?.role === 'administrateur') {
      activites.push(
        { titre: 'Nouveau paiement reçu', temps: 'Il y a 2h', type: 'paiement', color: 'bg-acacia-500' },
        { titre: 'Note ajoutée par M. Ndiaye', temps: 'Il y a 4h', type: 'note', color: 'bg-fleuve-500' },
        { titre: 'Nouvel élève inscrit', temps: 'Il y a 1 jour', type: 'eleve', color: 'bg-soleil-500' },
        { titre: 'Absence non justifiée de Ibrahima Sarr', temps: 'Il y a 1 jour', type: 'absence', color: 'bg-terre-500' } // Exemple
      );
    } else if (utilisateur?.role === 'enseignant') {
      activites.push(
        { titre: 'Note ajoutée pour Ibrahima', temps: 'Il y a 1h', type: 'note', color: 'bg-fleuve-500' },
        { titre: 'Document uploadé', temps: 'Il y a 3h', type: 'document', color: 'bg-soleil-500' }
      );
    } else if (utilisateur?.role === 'eleve') {
      activites.push(
        { titre: 'Nouvelle note en Mathématiques', temps: 'Il y a 2h', type: 'note', color: 'bg-fleuve-500' },
        { titre: 'Document ajouté en Français', temps: 'Il y a 1 jour', type: 'document', color: 'bg-soleil-500' }
      );
    } else if (utilisateur?.role === 'parent') {
        activites.push(
            { titre: `Paiement reçu pour ${donnees.enfants?.[0]?.prenom || 'un enfant'}`, temps: 'Il y a 5h', type: 'paiement', color: 'bg-acacia-500' },
            { titre: `Nouvelle note pour ${donnees.enfants?.[0]?.prenom || 'un enfant'} en Français`, temps: 'Il y a 1 jour', type: 'note', color: 'bg-fleuve-500' }
        );
    }
    
    return activites;
  };

  const activitesRecentes = obtenirActivitesRecentes();

  // Logique du slider (pour les statistiques)
  const scrollContainer = (direction) => {
    if (sliderRef.current) {
      // Défile d'une "carte" à la fois
      const cardWidth = sliderRef.current.querySelector('.snap-center')?.offsetWidth || 0;
      const scrollAmount = cardWidth + (window.innerWidth < 640 ? 16 : 24); // cardWidth + gap (px-2 ou px-3)
      
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };


  return (
    <div className="space-y-8 fade-in">
  {/* Header */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
      Tableau de bord – {utilisateur?.role?.charAt(0).toUpperCase() + utilisateur?.role?.slice(1)}
    </h1>
    <span className="text-sm text-gray-500 mt-2 sm:mt-0">
      Dernière connexion : {new Date().toLocaleDateString('fr-FR')}
    </span>
  </div>

  {/* Statistiques (Slider) */}
  <div className="relative">
    <div 
        ref={sliderRef}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 -mx-2"
        style={{ scrollBehavior: 'smooth' }}
    >
      {statistiques.map((stat, index) => {
        const IconeStat = stat.icone;
        return (
          <div 
            key={index} 
            className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 px-2 snap-start" // snap-start pour s'aligner au début
          >
            <div className={`card p-5 ${stat.couleurBg} border ${stat.couleurBg.replace('bg-', 'border-').replace('-500', '-200')} shadow-md transition-all duration-200 hover:shadow-lg`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-white">{stat.titre}</p> {/* Texte blanc pour contrast */}
                  <p className="text-2xl font-bold text-white">{stat.valeur}</p> {/* Texte blanc */}
                  {stat.tendance && (
                    <p className={`text-sm mt-1 flex items-center ${
                      stat.tendance.startsWith('+') ? 'text-acacia-100' : 'text-red-100' // Tendances en blanc sur fond coloré (red-100 pour la baisse)
                    }`}>
                      {stat.tendance.startsWith('+') ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                      {stat.tendance}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-full bg-opacity-30 ${stat.couleurBg}`}> {/* Cercle avec opacité */}
                  <IconeStat className={`h-6 w-6 text-white`} /> {/* Icône blanche */}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
    {/* Boutons de navigation du slider (visibles sur les écrans où le défilement est nécessaire) */}
    {statistiques.length > (window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4) && ( // Afficher si plus de cartes que de visibles
        <>
            <Icon 
                onClick={() => scrollContainer('left')} 
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-100 p-2 z-10 hidden sm:block cursor-pointer" // Ajout de cursor-pointer
                aria-label="Previous slide"
            >
                <ArrowLeftCircle size={24} />
            </Icon>
            <Icon 
                onClick={() => scrollContainer('right')} 
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-100 p-2 z-10 hidden sm:block cursor-pointer" // Ajout de cursor-pointer
                aria-label="Next slide"
            >
                <ArrowRightCircle size={24} />
            </Icon>
        </>
    )}
  </div>


  {/* Activités + Événements */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Activités récentes */}
    <div className="card p-5 shadow-sm">
      <h3 className="text-lg font-bold text-fleuve-700 mb-4">Activités récentes</h3>
      <div className="space-y-3">
        {activitesRecentes.length > 0 ? (
          activitesRecentes.map((a, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-fleuve-50 rounded-md border border-fleuve-200 shadow-sm transition-transform duration-200 hover:scale-[1.01]"> {/* Ajout d'effet hover */}
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${a.color}`} /> {/* Utilise la couleur définie dans l'activité */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{a.titre}</p>
                <p className="text-xs text-gray-500">{a.temps}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm py-4 text-center">Aucune activité récente</p>
        )}
      </div>
    </div>

    {/* Événements */}
    <div className="card p-5 shadow-sm">
      <h3 className="text-lg font-bold text-fleuve-700 mb-4">Prochains événements</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-acacia-50 rounded-md border border-acacia-200 shadow-sm transition-transform duration-200 hover:scale-[1.01]">
          <Calendar className="h-5 w-5 text-acacia-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Réunion des parents</p>
            <p className="text-xs text-gray-500">25 janvier 2024 à 15h00</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-soleil-50 rounded-md border border-soleil-200 shadow-sm transition-transform duration-200 hover:scale-[1.01]">
          <BookOpen className="h-5 w-5 text-soleil-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Compositions 1er trimestre</p>
            <p className="text-xs text-gray-500">30 janvier 2024</p>
          </div>
        </div>
         <div className="flex items-center space-x-3 p-3 bg-fleuve-50 rounded-md border border-fleuve-200 shadow-sm transition-transform duration-200 hover:scale-[1.01]">
          <Calendar className="h-5 w-5 text-fleuve-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Sortie scolaire</p>
            <p className="text-xs text-gray-500">15 mars 2024 (Classes 6ème/5ème)</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Notifications importantes */}
  {donnees.notifications && donnees.notifications.filter(n => !n.lue && n.priorite === 'urgente').length > 0 && (
    <div className="card border border-terre-200 bg-terre-50 p-5 shadow-md transition-transform duration-200 hover:scale-[1.005]"> {/* Ajout d'effet hover */}
      <h3 className="text-lg font-bold text-terre-700 flex items-center mb-4">
        <AlertCircle className="h-5 w-5 mr-2 animate-pulse" /> {/* Ajout d'animation */}
        Notifications urgentes non lues
      </h3>
      <div className="space-y-2">
        {donnees.notifications
          .filter(n => !n.lue && n.priorite === 'urgente')
          .slice(0, 3)
          .map((notification, i) => (
            <div key={notification.id} className="p-3 bg-white border border-terre-100 rounded-md shadow-sm">
              <p className="text-sm font-semibold text-terre-900">{notification.titre}</p>
              <p className="text-xs text-terre-600 mt-1 line-clamp-2">{notification.message}</p>
            </div>
          ))}
      </div>
    </div>
  )}
</div>
  );
};

export default TableauDeBord;