// donneesTemporaires.js (AJOUT DE classId AUX ÉLÈVES)

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
    classesIds: [1, 2, 5], // 6ème A, 5ème B, 2nde C
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
    enfants: [1111, 2], // Ibrahima Sarr (ID 1), Aissatou Sarr (ID 2)
    photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: 1111,
    nom: 'Sarr',
    prenom: 'Ibrahima',
    email: 'ibrahima.sarr@eleve.sn',
    motDePasse: 'eleve123',
    role: 'eleve',
    classe: '6ème A',
    classId: 1,
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
  

];

export const eleves = [
  {
    id: 1111,
    nom: 'Sarr',
    prenom: 'Ibrahima',
    sexe: 'M',
    dateNaissance: '2010-05-15',
    classe: '6ème A',
    classId: 1, 
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
    classId: 3, 
    numeroMatricule: 'EL002',
    telephoneParent: '77 345 67 89',
    emailParent: 'fatou.sow@parent.sn',
    parentId: 3,
    statut: 'actif',
    photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
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
    classesIds: [1, 2, 5],
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
    classesIds: [1, 3, 4, 6], // 6ème A, CM2 A, Tle S2-A, 3ème B
    photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: 9,
    nom: 'Diouf',
    prenom: 'Pape',
    email: 'pape.diouf@ecole.sn',
    motDePasse: 'prof123',
    role: 'enseignant',
    telephone: '77 111 22 33',
    matiere: 'Histoire-Géographie',
    classesIds: [1, 2, 6, 4], // 6ème A, 5ème B, 3ème B, Tle S2-A
    photo: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: 10,
    nom: 'Fall',
    prenom: 'Awa',
    email: 'awa.fall@ecole.sn',
    motDePasse: 'prof123',
    role: 'enseignant',
    telephone: '77 444 55 66',
    matiere: 'Anglais',
    classesIds: [3, 4, 7, 5], // CM2 A, Tle S2-A, CE1 B, 2nde C
    photo: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: 16,
    nom: 'Sankhare',
    prenom: 'Moussa',
    email: 'm.sankhare@ecole.sn',
    motDePasse: 'prof123',
    role: 'enseignant',
    telephone: '77 777 88 99',
    matiere: 'Sciences de la Vie et de la Terre',
    classesIds: [2, 5, 6], // 5ème B, 2nde C, 3ème B
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
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
    emploisDuTempsId: 1,
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
     emploisDuTempsId: 7,
    salle: 'Salle 201'
  },
  {
    id: 4,
    nom: 'Tle S2-A',
    niveau: 'Lycée',
    effectif: 28,
    enseignantPrincipal: 'Khadija Ba',
    enseignantPrincipalId: 7,
    emploisDuTempsId: 7,
    salle: 'Salle 301'
  },
  {
    id: 5,
    nom: '2nde C',
    niveau: 'Lycée',
    effectif: 32,
    enseignantPrincipal: 'Moussa Ndiaye',
    enseignantPrincipalId: 2,
     emploisDuTempsId: 7,
    salle: 'Salle 305'
  },
  {
    id: 6,
    nom: '3ème B',
    niveau: 'Collège',
    effectif: 29,
    enseignantPrincipal: 'Pape Diouf',
    enseignantPrincipalId: 9,
     emploisDuTempsId: 7,
    salle: 'Salle 203'
  },
  {
    id: 7,
    nom: 'CE1 B',
    niveau: 'Primaire',
    effectif: 25,
    enseignantPrincipal: 'Awa Fall',
    enseignantPrincipalId: 10,
    emploisDuTempsId: 7,
    salle: 'Salle 105'
  }
];

export const matieres = [
  { id: 1, nom: 'Mathématiques', code: 'MATH', coefficient: 4 },
  { id: 2, nom: 'Français', code: 'FR', coefficient: 4 },
  { id: 3, nom: 'Anglais', code: 'ANG', coefficient: 3 },
  { id: 4, nom: 'Histoire-Géographie', code: 'HG', coefficient: 3 },
  { id: 5, nom: 'Sciences de la Vie et de la Terre', code: 'SVT', coefficient: 3 },
  { id: 6, nom: 'Physique-Chimie', code: 'PC', coefficient: 3 },
  { id: 7, nom: 'Éducation Physique et Sportive', code: 'EPS', coefficient: 2 },
  { id: 8, nom: 'Philosophie', code: 'PHIL', coefficient: 3 },
  { id: 9, nom: 'Arabe', code: 'AR', coefficient: 2 }
];

export const notes = [
  // Notes pour Ibrahima Sarr (ID 1) - 6ème A
  { id: 1, eleveId: 1111, matiereId: 1, enseignantId: 2, trimestre: 1, valeur: 15, coefficient: 4, type: 'Devoir', date: '2024-01-15' },
  { id: 2, eleveId: 1111, matiereId: 2, enseignantId: 7, trimestre: 1, valeur: 12, coefficient: 4, type: 'Composition', date: '2024-01-20' },
  
  // Notes pour Aissatou Sarr (ID 2) - CM2 A
  { id: 3, eleveId: 2, matiereId: 1, enseignantId: 2, trimestre: 1, valeur: 18, coefficient: 4, type: 'Devoir', date: '2024-01-15' },
  { id: 14, eleveId: 2, matiereId: 2, enseignantId: 7, trimestre: 1, valeur: 17, coefficient: 4, type: 'Composition', date: '2024-01-22' },
 
];

export const emploisDuTemps = [
  // --- Cours de Moussa Ndiaye (ID 2) - Mathématiques ---
  // 6ème A
  { id: 1, classId: 1, classe: '6ème A', jour: 'Lundi', heure: '08:00-09:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 101' },
  { id: 4, classId: 1,classe: '6ème A', jour: 'Mercredi', heure: '10:00-11:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 101' },
  { id: 16, classId: 1, classe: '6ème A', jour: 'Vendredi', heure: '14:00-15:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 101' },
  

// --- Cours de Khadija Ba (ID 7) - Français ---
  // 6ème A
  { id: 2, classId: 1, classe: '6ème A', jour: 'Lundi', heure: '09:00-10:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 7, salle: 'Salle 101' },
  { id: 20, classId: 1, classe: '6ème A', jour: 'Mardi', heure: '11:00-12:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 7, salle: 'Salle 101' },
  { id: 27, classId: 1, classe: '6ème A', jour: 'Jeudi', heure: '16:00-17:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 7, salle: 'Salle 101' },
  // CM2 A
  { id: 7, classId: 3, classe: 'CM2 A', jour: 'Mardi', heure: '08:00-09:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 7, salle: 'Salle 201' },
  { id: 9, classId: 3, classe: 'CM2 A', jour: 'Vendredi', heure: '14:00-15:00', matiere: 'Histoire', enseignant: 'Khadija Ba', enseignantId: 7, salle: 'Salle 201' },
  { id: 28, classId: 3, classe: 'CM2 A', jour: 'Lundi', heure: '16:00-17:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 7, salle: 'Salle 201' },
  

  // --- Cours de Pape Diouf (ID 9) - Histoire-Géographie ---
  // 6ème A
  { id: 21, classId: 1, classe: '6ème A', jour: 'Mardi', heure: '09:00-10:00', matiere: 'Histoire-Géographie', enseignant: 'Pape Diouf', enseignantId: 9, salle: 'Salle 101' },
  { id: 31, classId: 1, classe: '6ème A', jour: 'Jeudi', heure: '10:00-11:00', matiere: 'Histoire-Géographie', enseignant: 'Pape Diouf', enseignantId: 9, salle: 'Salle 101' },
 

  // --- Cours de Awa Fall (ID 10) - Anglais ---
  // CM2 A
  { id: 24, classId: 3, classe: 'CM2 A', jour: 'Lundi', heure: '14:00-15:00', matiere: 'Anglais', enseignant: 'Awa Fall', enseignantId: 10, salle: 'Salle 201' },
  { id: 35, classId: 3, classe: 'CM2 A', jour: 'Jeudi', heure: '11:00-12:00', matiere: 'Anglais', enseignant: 'Awa Fall', enseignantId: 10, salle: 'Salle 201' },


];

export const paiements = [
  {
    id: 1,
    eleveId: 1111,
    montant: 50000,
    datePayment: '2024-01-15',
    typePaiement: 'Scolarité',
    statut: 'payé',
    methode: 'Orange Money',
    numeroRecu: 'RC001',
    commentaire: 'Premier versement scolarité T1'
  },
  {
    id: 2,
    eleveId: 2,
    montant: 45000,
    datePayment: '2024-01-10',
    typePaiement: 'Scolarité',
    statut: 'payé',
    methode: 'Wave',
    numeroRecu: 'RC002',
    commentaire: 'Versement scolarité T1'
  },
  {
    id: 3,
    eleveId: 3,
    montant: 50000,
    datePayment: '2024-01-20',
    typePaiement: 'Scolarité',
    statut: 'en_attente',
    methode: 'Espèces',
    numeroRecu: 'RC003',
    commentaire: 'En attente de confirmation'
  },
  {
    id: 4,
    eleveId: 4, // Talla Ndiaye
    montant: 75000,
    datePayment: '2023-09-01',
    typePaiement: 'Inscription',
    statut: 'payé',
    methode: 'Virement bancaire',
    numeroRecu: 'INS001',
    commentaire: 'Frais d\'inscription année scolaire'
  },
  {
    id: 5,
    eleveId: 4, // Talla Ndiaye
    montant: 60000,
    datePayment: '2023-10-05',
    typePaiement: 'Scolarité',
    statut: 'payé',
    methode: 'Orange Money',
    numeroRecu: 'RC004',
    commentaire: '1ère tranche scolarité'
  },
  {
    id: 6,
    eleveId: 4, // Talla Ndiaye
    montant: 60000,
    datePayment: '2024-01-05',
    typePaiement: 'Scolarité',
    statut: 'payé',
    methode: 'Wave',
    numeroRecu: 'RC005',
    commentaire: '2ème tranche scolarité'
  },
  {
    id: 7,
    eleveId: 4, // Talla Ndiaye
    montant: 15000,
    datePayment: '2024-03-20',
    typePaiement: 'Cantine',
    statut: 'payé',
    methode: 'Espèces',
    numeroRecu: 'CANT001',
    commentaire: 'Paiement cantine Mars'
  },
  {
    id: 8,
    eleveId: 11110, // Khadija Diouf
    montant: 55000,
    datePayment: '2023-09-10',
    typePaiement: 'Scolarité',
    statut: 'payé',
    methode: 'Espèces',
    numeroRecu: 'RC006',
    commentaire: 'Paiement rentrée CM2'
  },
  {
    id: 9,
    eleveId: 9, // Aminata Diouf
    montant: 40000,
    datePayment: '2023-09-05',
    typePaiement: 'Scolarité',
    statut: 'payé',
    methode: 'Orange Money',
    numeroRecu: 'RC007',
    commentaire: 'Scolarité CE1'
  },
  {
    id: 10,
    eleveId: 11111, // Ousmane Traore
    montant: 60000,
    datePayment: '2023-09-15',
    typePaiement: 'Scolarité',
    statut: 'payé',
    methode: 'Wave',
    numeroRecu: 'RC008',
    commentaire: 'Scolarité 3ème'
  },
  {
    id: 11,
    eleveId: 11112, // Mariam Cisse
    montant: 50000,
    datePayment: '2023-09-20',
    typePaiement: 'Scolarité',
    statut: 'payé',
    methode: 'Espèces',
    numeroRecu: 'RC009',
    commentaire: 'Scolarité 6ème'
  },
  {
    id: 12,
    eleveId: 11113, // Cheikh Ba
    montant: 70000,
    datePayment: '2023-09-25',
    typePaiement: 'Scolarité',
    statut: 'en_attente',
    methode: 'Virement bancaire',
    numeroRecu: 'RC010',
    commentaire: 'En attente de virement'
  }
];

export const notifications = [
  {
    id: 1,
    titre: 'Réunion des parents',
    message: 'Réunion des parents d\'élèves prévue le 25 janvier 2024 à 15h00 à la salle polyvalente.',
    date: '2024-01-20',
    expediteur: 'Administration',
    destinataires: ['parent'],
    lue: false,
    priorite: 'haute'
  },
  {
    id: 2,
    titre: 'Compositions du 1er trimestre',
    message: 'Les compositions du premier trimestre débuteront le 30 janvier 2024. Veuillez consulter le calendrier détaillé.',
    date: '2024-01-18',
    expediteur: 'Administration',
    destinataires: ['eleve', 'parent', 'enseignant'],
    lue: false,
    priorite: 'normale'
  },
  {
    id: 3,
    titre: 'Portes ouvertes de l\'école',
    message: 'Venez découvrir nos installations et rencontrer nos équipes le samedi 10 février. Programme complet disponible sur le site.',
    date: '2024-02-01',
    expediteur: 'Direction',
    destinataires: ['parent', 'eleve'],
    lue: false,
    priorite: 'normale'
  },
  {
    id: 4,
    titre: 'Avis de retard de paiement',
    message: 'Le paiement de la scolarité du mois de Février est en attente pour votre enfant. Veuillez régulariser avant le 15/02 afin d\'éviter des frais supplémentaires.',
    date: '2024-02-05',
    expediteur: 'Comptabilité',
    destinataires: ['parent'],
    lue: false,
    priorite: 'urgente'
  },
  {
    id: 5,
    titre: 'Sortie scolaire au Lac Rose',
    message: 'Une sortie scolaire est organisée pour les classes de 6ème et 5ème le 15 mars. Coût: 5000 FCFA. Inscriptions ouvertes.',
    date: '2024-03-01',
    expediteur: 'Vie Scolaire',
    destinataires: ['eleve', 'parent'],
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
    classe: '6ème A',
    enseignantId: 2,
    dateAjout: '2024-01-10',
    taille: '2.5 MB',
    format: 'PDF'
  },
  {
    id: 2,
    titre: 'Exercices de Français - CM2',
    type: 'exercices',
    matiere: 'Français',
    classe: 'CM2 A',
    enseignantId: 7,
    dateAjout: '2024-01-12',
    taille: '1.8 MB',
    format: 'PDF'
  },
  {
    id: 3,
    titre: 'Examen Blanc de Philosophie S2',
    type: 'devoirs',
    matiere: 'Philosophie',
    classe: 'Tle S2-A',
    enseignantId: null,
    dateAjout: '2024-05-10',
    taille: '3.1 MB',
    format: 'PDF'
  },
  {
    id: 4,
    titre: 'TD de Sciences Physiques - 5ème',
    type: 'exercices',
    matiere: 'Physique-Chimie',
    classe: '5ème B',
    enseignantId: 2,
    dateAjout: '2024-03-01',
    taille: '1.2 MB',
    format: 'DOCX'
  },
  {
    id: 5,
    titre: 'Planning des révisions BAC S2',
    type: 'evaluations',
    matiere: 'Général',
    classe: 'Tle S2-A',
    enseignantId: null,
    dateAjout: '2024-05-15',
    taille: '0.5 MB',
    format: 'PDF'
  },
  {
    id: 6,
    titre: 'Leçon de lecture CP',
    type: 'cours',
    matiere: 'Français',
    classe: 'CE1 B',
    enseignantId: 7,
    dateAjout: '2024-04-01',
    taille: '0.8 MB',
    format: 'PDF'
  },
  {
    id: 7,
    titre: 'Résumé Histoire 3ème',
    type: 'cours',
    matiere: 'Histoire-Géographie',
    classe: '3ème B',
    enseignantId: 9,
    dateAjout: '2024-03-10',
    taille: '2.1 MB',
    format: 'PDF'
  },
  {
    id: 8,
    titre: 'Exercices d\'Anglais 2nde',
    type: 'exercices',
    matiere: 'Anglais',
    classe: '2nde C',
    enseignantId: 10,
    dateAjout: '2024-02-14',
    taille: '1.5 MB',
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
    // Cloner l'objet utilisateur pour ne pas modifier directement l'original du tableau `utilisateurs`
    const utilisateurEnrichi = { ...utilisateur }; 

    // Si l'utilisateur est un élève, trouver ses informations complètes
    if (utilisateur.role === 'eleve') {
        const eleveData = eleves.find(e => e.id === utilisateur.id);
        if (eleveData) { // S'assurer que les données de l'élève sont trouvées
            // Fusionne les propriétés spécifiques de l'élève
            Object.assign(utilisateurEnrichi, eleveData); 
        } else {
            console.warn(`Aucune donnée d'élève trouvée pour l'utilisateur ID: ${utilisateur.id}`);
            return { succes: false, message: 'Profil élève introuvable.' };
        }
    }
    // Si l'utilisateur est un parent, enrichir avec les détails complets de leurs enfants
    else if (utilisateur.role === 'parent') { // Utilisez 'else if' pour les rôles exclusifs
        const enfantsIds = utilisateur.enfants || [];
        const enfantsDetails = eleves.filter(e => enfantsIds.includes(e.id));
        utilisateurEnrichi.enfants = enfantsDetails; // Remplace les IDs par les objets complets
    }
    // Si l'utilisateur est un enseignant, enrichir avec les détails de leurs classes enseignées
    else if (utilisateur.role === 'enseignant') {
        const enseignantData = enseignants.find(e => e.id === utilisateur.id);
        if (enseignantData) {
            Object.assign(utilisateurEnrichi, {
                matiere: enseignantData.matiere,
                classesIds: enseignantData.classesIds,
                // Assurez-vous que l'enseignant aura ses propres IDs (non partagés avec les élèves/parents)
                // Son ID utilisateur est déjà l'ID de l'enseignant.
            });
        }
    }
    // Pour les autres rôles (admin, comptable), l'objet `utilisateurEnrichi` est déjà cloné
    // et contient les propriétés de base de `utilisateurs`.

    return { succes: true, utilisateur: utilisateurEnrichi };
  }
  return { succes: false, message: 'Email ou mot de passe incorrect' };
};

// Fonction pour obtenir les données selon le rôle (plus englobante)
export const obtenirDonneesParRole = (role, utilisateurId) => {
  const donneesCommunes = {
    eleves, // Tous les élèves
    enseignants, // Tous les enseignants
    classes, // Toutes les classes
    matieres, // Toutes les matières
    notes, // Toutes les notes
    emploisDuTemps, // Tous les emplois du temps
    paiements, // Tous les paiements
    notifications, // Toutes les notifications
    documents, // Tous les documents
    statistiques // Toutes les statistiques
  };

  // Les composants de page se chargeront de filtrer les données spécifiques
  // au rôle ou à l'utilisateur connecté à partir de ces données communes.
  return donneesCommunes;
};