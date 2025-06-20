// donneesTemporaires.js (MODIFIÉ)

export const utilisateurs = [
  {
    id: 1,
    nom: 'Diallo',
    prenom: 'Aminata',
    email: 'admin@ecole.sn',
    motDePasse: 'admin123',
    role: 'administrateur',
    telephone: '77 123 45 67',
    photo: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: 2,
    nom: 'Ndiaye',
    prenom: 'Moussa',
    email: 'moussa.ndiaye@ecole.sn',
    motDePasse: 'prof123',
    role: 'enseignant',
    telephone: '77 234 56 78',
    matiere: 'Mathématiques',
    classes: ['6ème A', '5ème B'],
    classesIds: [1, 2],
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: 3,
    nom: 'Sow',
    prenom: 'Fatou',
    email: 'fatou.sow@parent.sn',
    motDePasse: 'parent123',
    role: 'parent',
    telephone: '77 345 67 89',
    enfants: [1, 2, 8], // Ibrahima Sarr (ID 1), Aissatou Sarr (ID 2)
    photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: 4,
    nom: 'Sarr',
    prenom: 'Ibrahima',
    email: 'ibrahima.sarr@eleve.sn',
    motDePasse: 'eleve123',
    role: 'eleve',
    classe: '6ème A',
    numeroMatricule: 'EL001',
    dateNaissance: '2010-05-15',
    sexe: 'M',
    parentId: 3,
    photo: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: 5,
    nom: 'Kane',
    prenom: 'Mariam',
    email: 'mariam.kane@comptable.sn',
    motDePasse: 'compta123',
    role: 'comptable',
    telephone: '77 456 78 90',
    photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  { // Nouvel utilisateur parent pour Mamadou Diop
    id: 6,
    nom: 'Diop',
    prenom: 'Mamadou Parent',
    email: 'diop.parent@email.sn',
    motDePasse: 'parent123',
    role: 'parent',
    telephone: '77 567 89 01',
    enfants: [3,8], // Mamadou Diop (ID 3)
    photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  { // Nouvel utilisateur élève pour Talla Ndiaye
    id: 8,
    nom: 'Ndiaye',
    prenom: 'Talla',
    email: 'talla.ndiaye@eleve.sn',
    motDePasse: 'eleve123',
    role: 'eleve',
    classe: 'Tle S2-A',
    numeroMatricule: 'EL004',
    dateNaissance: '2001-08-10',
    sexe: 'M',
    parentId: 6, // Parent de Talla Ndiaye
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  }
];

export const eleves = [
  {
    id: 1,
    nom: 'Sarr',
    prenom: 'Ibrahima',
    sexe: 'M',
    dateNaissance: '2010-05-15',
    classe: '6ème A',
    numeroMatricule: 'EL001',
    telephoneParent: '77 345 67 89',
    emailParent: 'fatou.sow@parent.sn',
    parentId: 3,
    statut: 'actif',
    photo: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: 2,
    nom: 'Sarr',
    prenom: 'Aissatou',
    sexe: 'F',
    dateNaissance: '2012-03-22',
    classe: 'CM2 A',
    numeroMatricule: 'EL002',
    telephoneParent: '77 345 67 89',
    emailParent: 'fatou.sow@parent.sn',
    parentId: 3,
    statut: 'actif',
    photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: 3,
    nom: 'Diop',
    prenom: 'Mamadou',
    sexe: 'M',
    dateNaissance: '2009-08-10',
    classe: '5ème B',
    numeroMatricule: 'EL003',
    telephoneParent: '77 567 89 01',
    emailParent: 'diop.parent@email.sn',
    parentId: 6,
    statut: 'actif',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: 4, // L'ID 4 est maintenant utilisé par un élève qui a des notes
    nom: 'Ndiaye',
    prenom: 'Talla',
    sexe: 'M',
    dateNaissance: '2001-08-10',
    classe: 'Tle S2-A',
    numeroMatricule: 'EL004',
    telephoneParent: '77 567 89 01',
    emailParent: 'ndiaye.parent@email.sn',
    parentId: 6,
    statut: 'actif',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  }
];

export const enseignants = [
  {
    id: 2,
    nom: 'Ndiaye',
    prenom: 'Moussa',
    email: 'moussa.ndiaye@ecole.sn',
    motDePasse: 'prof123',
    telephone: '77 234 56 78',
    matiere: 'Mathématiques',
    classes: ['6ème A', '5ème B'],
    classesIds: [1, 2],
    dateEmbauche: '2020-09-01',
    statut: 'actif',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: 7,
    nom: 'Ba',
    prenom: 'Khadija',
    email: 'khadija.ba@ecole.sn',
    motDePasse: 'prof123',
    telephone: '77 678 90 12',
    matiere: 'Français',
    classes: ['6ème A', 'CM2 A', 'Tle S2-A'],
    classesIds: [1, 3, 4],
    dateEmbauche: '2019-02-15',
    statut: 'actif',
    photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  }
];

export const classes = [
  {
    id: 1,
    nom: '6ème A',
    niveau: 'Collège',
    effectif: 35,
    enseignantPrincipal: 'Moussa Ndiaye',
    enseignantPrincipalId: 2,
    salle: 'Salle 101'
  },
  {
    id: 2,
    nom: '5ème B',
    niveau: 'Collège',
    effectif: 30,
    enseignantPrincipal: 'Moussa Ndiaye',
    enseignantPrincipalId: 2,
    salle: 'Salle 102'
  },
  {
    id: 3,
    nom: 'CM2 A',
    niveau: 'Primaire',
    effectif: 28,
    enseignantPrincipal: 'Khadija Ba',
    enseignantPrincipalId: 7,
    salle: 'Salle 201'
  },
  {
    id: 4,
    nom: 'Tle S2-A',
    niveau: 'Lycée',
    effectif: 28,
    enseignantPrincipal: 'Khadija Ba',
    enseignantPrincipalId: 7,
    salle: 'Salle 301'
  }
];

export const matieres = [
  { id: 1, nom: 'Mathématiques', code: 'MATH', coefficient: 4 },
  { id: 2, nom: 'Français', code: 'FR', coefficient: 4 },
  { id: 3, nom: 'Anglais', code: 'ANG', coefficient: 3 },
  { id: 4, nom: 'Histoire-Géographie', code: 'HG', coefficient: 3 },
  { id: 5, nom: 'Sciences de la Vie et de la Terre', code: 'SVT', coefficient: 3 },
  { id: 6, nom: 'Physique-Chimie', code: 'PC', coefficient: 3 },
  { id: 7, nom: 'Éducation Physique et Sportive', code: 'EPS', coefficient: 2 }
];

export const notes = [
  // Notes pour Ibrahima Sarr (ID 1)
  {
    id: 1,
    eleveId: 1,
    matiereId: 1, // Mathématiques
    enseignantId: 2,
    trimestre: 1,
    valeur: 15,
    coefficient: 4,
    type: 'Devoir',
    date: '2024-01-15'
  },
  {
    id: 2,
    eleveId: 1,
    matiereId: 2, // Français
    enseignantId: 7,
    trimestre: 1,
    valeur: 12,
    coefficient: 4,
    type: 'Composition',
    date: '2024-01-20'
  },
  {
    id: 9,
    eleveId: 1,
    matiereId: 1, // Mathématiques
    enseignantId: 2,
    trimestre: 2,
    valeur: 16.5,
    coefficient: 4,
    type: 'Composition',
    date: '2024-04-10'
  },
  {
    id: 10,
    eleveId: 1,
    matiereId: 3, // Anglais
    enseignantId: null, // Si l'enseignant n'est pas spécifié
    trimestre: 2,
    valeur: 14,
    coefficient: 3,
    type: 'Oral',
    date: '2024-04-15'
  },
  {
    id: 11,
    eleveId: 1,
    matiereId: 4, // HG
    enseignantId: null,
    trimestre: 2,
    valeur: 10.5,
    coefficient: 3,
    type: 'Devoir',
    date: '2024-04-20'
  },
  // Notes pour Aissatou Sarr (ID 2)
  {
    id: 3,
    eleveId: 2,
    matiereId: 1, // Mathématiques
    enseignantId: 2,
    trimestre: 1,
    valeur: 18,
    coefficient: 4,
    type: 'Devoir',
    date: '2024-01-15'
  },
  // Notes pour Mamadou Diop (ID 3)
  {
    id: 4,
    eleveId: 3,
    matiereId: 1, // Mathématiques
    enseignantId: 2,
    trimestre: 1,
    valeur: 13,
    coefficient: 4,
    type: 'Devoir',
    date: '2024-01-16'
  },
  {
    id: 5,
    eleveId: 3,
    matiereId: 3, // Anglais
    enseignantId: null,
    trimestre: 1,
    valeur: 10,
    coefficient: 3,
    type: 'Devoir',
    date: '2024-01-22'
  },
  // Notes pour Talla Ndiaye (ID 4 - ajouté en tant qu'utilisateur élève)
  {
    id: 6,
    eleveId: 4,
    matiereId: 1, // Mathématiques
    enseignantId: 2,
    trimestre: 1,
    valeur: 17,
    coefficient: 4,
    type: 'Devoir',
    date: '2024-01-17'
  },
  {
    id: 7,
    eleveId: 4,
    matiereId: 2, // Français
    enseignantId: 7,
    trimestre: 1,
    valeur: 14.5,
    coefficient: 4,
    type: 'Composition',
    date: '2024-01-23'
  },
  {
    id: 8,
    eleveId: 4,
    matiereId: 5, // SVT
    enseignantId: null,
    trimestre: 1,
    valeur: 11,
    coefficient: 3,
    type: 'Interrogation',
    date: '2024-01-25'
  }
];

export const emploisDuTemps = [
  // Cours de Moussa Ndiaye (ID 2)
  {
    id: 1,
    classe: '6ème A',
    jour: 'Lundi',
    heure: '08:00-09:00',
    matiere: 'Mathématiques',
    enseignant: 'Moussa Ndiaye',
    enseignantId: 2,
    salle: 'Salle 101'
  },
  {
    id: 4,
    classe: '6ème A',
    jour: 'Mercredi',
    heure: '10:00-11:00',
    matiere: 'Mathématiques',
    enseignant: 'Moussa Ndiaye',
    enseignantId: 2,
    salle: 'Salle 101'
  },
  {
    id: 5,
    classe: '5ème B',
    jour: 'Mardi',
    heure: '14:00-15:00',
    matiere: 'Mathématiques',
    enseignant: 'Moussa Ndiaye',
    enseignantId: 2,
    salle: 'Salle 102'
  },
  {
    id: 6,
    classe: '5ème B',
    jour: 'Jeudi',
    heure: '09:00-10:00',
    matiere: 'Mathématiques',
    enseignant: 'Moussa Ndiaye',
    enseignantId: 2,
    salle: 'Salle 102'
  },
  // Cours de Khadija Ba (ID 7)
  {
    id: 2,
    classe: '6ème A',
    jour: 'Lundi',
    heure: '09:00-10:00',
    matiere: 'Français',
    enseignant: 'Khadija Ba',
    enseignantId: 7,
    salle: 'Salle 101'
  },
  {
    id: 7,
    classe: 'CM2 A',
    jour: 'Mardi',
    heure: '08:00-09:00',
    matiere: 'Français',
    enseignant: 'Khadija Ba',
    enseignantId: 7,
    salle: 'Salle 201'
  },
  {
    id: 8,
    classe: 'Tle S2-A',
    jour: 'Jeudi',
    heure: '10:00-11:00',
    matiere: 'Français',
    enseignant: 'Khadija Ba',
    enseignantId: 7,
    salle: 'Salle 301'
  },
  {
    id: 9,
    classe: 'CM2 A',
    jour: 'Vendredi',
    heure: '14:00-15:00',
    matiere: 'Histoire',
    enseignant: 'Khadija Ba',
    enseignantId: 7,
    salle: 'Salle 201'
  },
  // Exemple de cours pour la classe Tle S2-A (pour l'élève Talla Ndiaye)
  {
    id: 10,
    classe: 'Tle S2-A',
    jour: 'Lundi',
    heure: '08:00-09:00',
    matiere: 'Philosophie',
    enseignant: 'Mme Diouf',
    enseignantId: null, // Enseignant non listé
    salle: 'Salle 302'
  },
  {
    id: 11,
    classe: 'Tle S2-A',
    jour: 'Lundi',
    heure: '09:00-10:00',
    matiere: 'Mathématiques',
    enseignant: 'Moussa Ndiaye',
    enseignantId: 2,
    salle: 'Salle 302'
  },
  // Exemple de cours sans enseignant attribué à Moussa ou Khadija
  {
    id: 3,
    classe: '6ème A',
    jour: 'Mardi',
    heure: '08:00-09:00',
    matiere: 'Anglais',
    enseignant: 'Fatou Diallo',
    salle: 'Salle 101'
  }
];

export const paiements = [
  {
    id: 1,
    eleveId: 1,
    montant: 50000,
    datePayment: '2024-01-15',
    typePaiement: 'Scolarité',
    statut: 'payé',
    methode: 'Orange Money',
    numeroRecu: 'RC001'
  },
  {
    id: 2,
    eleveId: 2,
    montant: 45000,
    datePayment: '2024-01-10',
    typePaiement: 'Scolarité',
    statut: 'payé',
    methode: 'Wave',
    numeroRecu: 'RC002'
  },
  {
    id: 3,
    eleveId: 3,
    montant: 50000,
    datePayment: '2024-01-20',
    typePaiement: 'Scolarité',
    statut: 'en_attente',
    methode: 'Espèces',
    numeroRecu: 'RC003'
  },
  { // Paiement pour Talla Ndiaye (ID 4)
    id: 4,
    eleveId: 4,
    montant: 75000,
    datePayment: '2024-01-05',
    typePaiement: 'Scolarité',
    statut: 'payé',
    methode: 'Virement bancaire',
    numeroRecu: 'RC004'
  }
];

export const notifications = [
  {
    id: 1,
    titre: 'Réunion des parents',
    message: 'Réunion des parents d\'élèves prévue le 25 janvier 2024 à 15h00',
    date: '2024-01-20',
    expediteur: 'Administration',
    destinataires: ['parent'],
    lue: false,
    priorite: 'haute'
  },
  {
    id: 2,
    titre: 'Compositions du 1er trimestre',
    message: 'Les compositions du premier trimestre débuteront le 30 janvier 2024',
    date: '2024-01-18',
    expediteur: 'Administration',
    destinataires: ['eleve', 'parent', 'enseignant'],
    lue: false,
    priorite: 'normale'
  }
];

export const documents = [
  {
    id: 1,
    titre: 'Cours de Mathématiques - Chapitre 1',
    type: 'cours',
    matiere: 'Mathématiques',
    classe: '6ème A', // Assurez-vous que cette classe existe et qu'au moins un élève est dedans
    enseignantId: 2,
    dateAjout: '2024-01-10',
    taille: '2.5 MB',
    format: 'PDF'
  },
  {
    id: 2,
    titre: 'Exercices de Français',
    type: 'exercices',
    matiere: 'Français',
    classe: '6ème A',
    enseignantId: 7,
    dateAjout: '2024-01-12',
    taille: '1.8 MB',
    format: 'PDF'
  },
  { // Nouveau document pour la classe Tle S2-A (pour l'élève Talla Ndiaye)
    id: 3,
    titre: 'Examen Blanc de Philosophie S2',
    type: 'devoirs',
    matiere: 'Philosophie',
    classe: 'Tle S2-A', // Classe de Talla Ndiaye
    enseignantId: null, // Si l'enseignant n'est pas spécifié
    dateAjout: '2024-05-10',
    taille: '3.1 MB',
    format: 'PDF'
  },
  { // Autre document pour 5ème B
    id: 4,
    titre: 'TD de Sciences Physiques',
    type: 'exercices',
    matiere: 'Physique-Chimie',
    classe: '5ème B',
    enseignantId: 2,
    dateAjout: '2024-03-01',
    taille: '1.2 MB',
    format: 'DOCX'
  }
];
export const statistiques = {
  nombreEleves: 93,
  nombreEnseignants: 12,
  nombreClasses: 8,
  tauxReussite: 85,
  montantCollecte: 4650000,
  montantAttendu: 5000000,
  nombreParents: 65,
  elevesPresents: 88,
  elevesAbsents: 5
};

// Fonction pour simuler une authentification
export const authentifier = (email, motDePasse) => {
  const utilisateur = utilisateurs.find(u => u.email === email && u.motDePasse === motDePasse);
  if (utilisateur) {
    return {
      succes: true,
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
        telephone: utilisateur.telephone,
        photo: utilisateur.photo
      }
    };
  }
  return { succes: false, message: 'Email ou mot de passe incorrect' };
};

// Fonction pour obtenir les données selon le rôle
export const obtenirDonneesParRole = (role, utilisateurId) => {
  switch (role) {
    case 'administrateur':
      return {
        eleves,
        enseignants,
        classes,
        matieres,
        notes,
        emploisDuTemps,
        paiements,
        notifications,
        documents,
        statistiques
      };
    case 'enseignant':
      const enseignant = enseignants.find(e => e.id === utilisateurId);
      const classesEnseigneesParIds = enseignant && enseignant.classesIds
        ? classes.filter(classe => enseignant.classesIds.includes(classe.id))
        : [];
      return {
        classes: classesEnseigneesParIds,
        eleves: eleves.filter(e => classesEnseigneesParIds.some(c => c.nom === e.classe)),
        notes: notes.filter(n => n.enseignantId === utilisateurId),
        documents: documents.filter(d => d.enseignantId === utilisateurId),
        notifications: notifications.filter(n => n.destinataires.includes('enseignant')),
        emploisDuTemps: emploisDuTemps.filter(edt => edt.enseignantId === utilisateurId)
      };
    case 'eleve':
      const eleveData = eleves.find(e => e.id === utilisateurId);
      // Récupérer la classe de l'élève connecté si elle existe
      const classeEleve = classes.find(c => c.nom === eleveData?.classe);
      return {
        profil: eleveData,
        notes: notes.filter(n => n.eleveId === utilisateurId),
        // Filtrer l'emploi du temps pour la classe de l'élève
        emploiDuTemps: emploisDuTemps.filter(edt => edt.classe === eleveData?.classe),
        // Filtrer les documents par la classe de l'élève
        documents: documents.filter(d => d.classe === eleveData?.classe),
        notifications: notifications.filter(n => n.destinataires.includes('eleve')),
        classes: classeEleve ? [classeEleve] : [], // Ne donner que sa propre classe
        matieres: matieres // L'élève a besoin de toutes les matières pour l'affichage des notes
      };
    case 'parent':
      const parent = utilisateurs.find(u => u.id === utilisateurId);
      const enfants = eleves.filter(e => parent?.enfants?.includes(e.id));
      return {
        enfants,
        notes: notes.filter(n => parent?.enfants?.includes(n.eleveId)),
        paiements: paiements.filter(p => parent?.enfants?.includes(p.eleveId)),
        notifications: notifications.filter(n => n.destinataires.includes('parent'))
      };
    case 'comptable':
      return {
        paiements,
        eleves,
        statistiques: {
          montantCollecte: statistiques.montantCollecte,
          montantAttendu: statistiques.montantAttendu,
          nombreEleves: statistiques.nombreEleves
        },
        classes,
        matieres
      };
    default:
      return {};
  }
};