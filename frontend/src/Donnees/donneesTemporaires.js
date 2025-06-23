// frontend/src/Donnees/donneesTemporaires.js (MODIFIÉ : classeId -> classeId)

export const utilisateurs = [
  // IDs des utilisateurs (pour la connexion)
  // Administrateur
  { id: 1, nom: 'Diallo', prenom: 'Aminata', email: 'admin@ecole.sn', motDePasse: 'admin123', role: 'administrateur', telephone: '77 123 45 67', photo: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  // Enseignants (leurs IDs correspondent à ceux du tableau 'enseignants')
  { id: 2, nom: 'Ndiaye', prenom: 'Moussa', email: 'moussa.ndiaye@ecole.sn', motDePasse: 'prof123', role: 'enseignant', telephone: '77 234 56 78', matiere: 'Mathématiques', classesIds: [1, 2, 5], photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 6, nom: 'Ba', prenom: 'Khadija', email: 'khadija.ba@ecole.sn', motDePasse: 'prof123', role: 'enseignant', telephone: '77 678 90 12', matiere: 'Français', classesIds: [1, 3, 4, 6], photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 7, nom: 'Diouf', prenom: 'Pape', email: 'pape.diouf@ecole.sn', motDePasse: 'prof123', role: 'enseignant', telephone: '77 111 22 33', matiere: 'Histoire-Géographie', classesIds: [1, 2, 6, 4], photo: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 8, nom: 'Fall', prenom: 'Awa', email: 'awa.fall@ecole.sn', motDePasse: 'prof123', role: 'enseignant', telephone: '77 444 55 66', matiere: 'Anglais', classesIds: [3, 4, 7, 5], photo: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 14, nom: 'Sankhare', prenom: 'Moussa', email: 'm.sankhare@ecole.sn', motDePasse: 'prof123', role: 'enseignant', telephone: '77 777 88 99', matiere: 'Sciences de la Vie et de la Terre', classesIds: [2, 5, 6], photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  // Parents (leurs IDs ici correspondent à leurs IDs dans le tableau 'utilisateurs' plus haut)
  // Les IDs des enfants dans `enfants` sont ceux du tableau `eleves`
  { id: 101, nom: 'Sarr', prenom: 'Ibrahima', email: 'ibrahima.sarr@eleve.sn', motDePasse: 'eleve123', role: 'eleve', classe: '6ème A', numeroMatricule: 'EL001', dateNaissance: '2010-05-15', sexe: 'M', parentId: 3, photo: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 3, nom: 'Sow', prenom: 'Fatou', email: 'fatou.sow@parent.sn', motDePasse: 'parent123', role: 'parent', telephone: '77 345 67 89', enfants: [101, 102], photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 5, nom: 'Diallo', prenom: 'Marie', email: 'marie.diallo@parent.sn', motDePasse: 'parent123', role: 'parent', telephone: '77 987 65 43', enfants: [103, 104, 110], photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 9, nom: 'Traore', prenom: 'Abdou', email: 'famille.diouf@parent.sn', motDePasse: 'parent123', role: 'parent', telephone: '77 123 00 11', enfants: [109], photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 10, nom: 'Traore', prenom: 'Safiatou', email: 'famille.traore@parent.sn', motDePasse: 'parent123', role: 'parent', telephone: '77 222 33 44', enfants: [111], photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 11, nom: 'Cisse', prenom: 'Mamadou', email: 'famille.cisse@parent.sn', motDePasse: 'parent123', role: 'parent', telephone: '77 100 20 30', enfants: [112], photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 12, nom: 'Ba', prenom: 'Aicha', email: 'famille.ba@parent.sn', motDePasse: 'parent123', role: 'parent', telephone: '77 555 66 77', enfants: [113], photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 13, nom: 'Gueye', prenom: 'Moussa', email: 'famille.gueye@parent.sn', motDePasse: 'parent123', role: 'parent', telephone: '77 888 99 00', enfants: [114], photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  // Comptable
  { id: 4, nom: 'Kane', prenom: 'Mariam', email: 'mariam.kane@comptable.sn', motDePasse: 'compta123', role: 'comptable', telephone: '77 456 78 90', photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' }
];

export const eleves = [
  // IDs des élèves (pour leurs détails) - CES IDs DOIVENT ÊTRE RÉFÉRENCÉS PAR LES PARENTS ET LES NOTES, ETC.
  { id: 101, nom: 'Sarr', prenom: 'Ibrahima', sexe: 'M', dateNaissance: '2010-05-15', classe: '6ème A', classeId: 1, numeroMatricule: 'EL001', telephoneParent: '77 345 67 89', emailParent: 'fatou.sow@parent.sn', parentId: 3, statut: 'actif', photo: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 102, nom: 'Sarr', prenom: 'Aissatou', sexe: 'F', dateNaissance: '2012-03-22', classe: 'CM2 A', classeId: 3, numeroMatricule: 'EL002', telephoneParent: '77 345 67 89', emailParent: 'fatou.sow@parent.sn', parentId: 3, statut: 'actif', photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 103, nom: 'Diop', prenom: 'Mamadou', sexe: 'M', dateNaissance: '2009-08-10', classe: '5ème B', classeId: 2, numeroMatricule: 'EL003', telephoneParent: '77 567 89 01', emailParent: 'marie.diallo@parent.sn', parentId: 5, statut: 'actif', photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 104, nom: 'Ndiaye', prenom: 'Talla', sexe: 'M', dateNaissance: '2001-08-10', classe: 'Tle S2-A', classeId: 4, numeroMatricule: 'EL004', telephoneParent: '77 567 89 01', emailParent: 'marie.diallo@parent.sn', parentId: 5, statut: 'actif', photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 109, nom: 'Diouf', prenom: 'Aminata', sexe: 'F', dateNaissance: '2015-01-20', classe: 'CE1 B', classeId: 7, numeroMatricule: 'EL005', telephoneParent: '77 123 00 11', emailParent: 'famille.diouf@parent.sn', parentId: 9, statut: 'actif', photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 110, nom: 'Diouf', prenom: 'Khadija', sexe: 'F', dateNaissance: '2012-11-05', classe: 'CM2 A', classeId: 3, numeroMatricule: 'EL006', telephoneParent: '77 987 65 43', emailParent: 'marie.diallo@parent.sn', parentId: 5, statut: 'actif', photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 111, nom: 'Traore', prenom: 'Ousmane', sexe: 'M', dateNaissance: '2008-03-01', classe: '3ème B', classeId: 6, numeroMatricule: 'EL007', telephoneParent: '77 222 33 44', emailParent: 'famille.traore@parent.sn', parentId: 10, statut: 'actif', photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 112, nom: 'Cisse', prenom: 'Mariam', sexe: 'F', dateNaissance: '2011-09-10', classe: '6ème A', classeId: 1, numeroMatricule: 'EL008', telephoneParent: '77 100 20 30', emailParent: 'famille.cisse@parent.sn', parentId: 11, statut: 'actif', photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 113, nom: 'Ba', prenom: 'Cheikh', sexe: 'M', dateNaissance: '2006-07-25', classe: 'Tle S2-A', classeId: 4, numeroMatricule: 'EL009', telephoneParent: '77 555 66 77', emailParent: 'famille.ba@parent.sn', parentId: 12, statut: 'actif', photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 114, nom: 'Gueye', prenom: 'Fatima', sexe: 'F', dateNaissance: '2013-02-18', classe: 'CM2 A', classeId: 3, numeroMatricule: 'EL010', telephoneParent: '77 888 99 00', emailParent: 'famille.gueye@parent.sn', parentId: 13, statut: 'actif', photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' }
];

export const enseignants = [
  // Ces IDs sont utilisés à la fois pour la connexion (si rôle enseignant) et comme enseignantId dans d'autres tableaux
  { id: 2, nom: 'Ndiaye', prenom: 'Moussa', email: 'moussa.ndiaye@ecole.sn', motDePasse: 'prof123', telephone: '77 234 56 78', matiere: 'Mathématiques', classesIds: [1, 2, 5], photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 6, nom: 'Ba', prenom: 'Khadija', email: 'khadija.ba@ecole.sn', motDePasse: 'prof123', telephone: '77 678 90 12', matiere: 'Français', classesIds: [1, 3, 4, 6], photo: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 7, nom: 'Diouf', prenom: 'Pape', email: 'pape.diouf@ecole.sn', motDePasse: 'prof123', role: 'enseignant', telephone: '77 111 22 33', matiere: 'Histoire-Géographie', classesIds: [1, 2, 6, 4], photo: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 8, nom: 'Fall', prenom: 'Awa', email: 'awa.fall@ecole.sn', motDePasse: 'prof123', role: 'enseignant', telephone: '77 444 55 66', matiere: 'Anglais', classesIds: [3, 4, 7, 5], photo: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { id: 14, nom: 'Sankhare', prenom: 'Moussa', email: 'm.sankhare@ecole.sn', motDePasse: 'prof123', role: 'enseignant', telephone: '77 777 88 99', matiere: 'Sciences de la Vie et de la Terre', classesIds: [2, 5, 6], photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' }
];

export const classes = [
  { id: 1, nom: '6ème A', niveau: 'Collège', effectif: 35, enseignantPrincipal: 'Moussa Ndiaye', enseignantPrincipalId: 2, salle: 'Salle 101' },
  { id: 2, nom: '5ème B', niveau: 'Collège', effectif: 30, enseignantPrincipal: 'Moussa Ndiaye', enseignantPrincipalId: 2, salle: 'Salle 102' },
  { id: 3, nom: 'CM2 A', niveau: 'Primaire', effectif: 28, enseignantPrincipal: 'Khadija Ba', enseignantPrincipalId: 6, salle: 'Salle 201' },
  { id: 4, nom: 'Tle S2-A', niveau: 'Lycée', effectif: 28, enseignantPrincipal: 'Khadija Ba', enseignantPrincipalId: 6, salle: 'Salle 301' },
  { id: 5, nom: '2nde C', niveau: 'Lycée', effectif: 32, enseignantPrincipal: 'Moussa Ndiaye', enseignantPrincipalId: 2, salle: 'Salle 305' },
  { id: 6, nom: '3ème B', niveau: 'Collège', effectif: 29, enseignantPrincipal: 'Pape Diouf', enseignantPrincipalId: 7, salle: 'Salle 203' },
  { id: 7, nom: 'CE1 B', niveau: 'Primaire', effectif: 25, enseignantPrincipal: 'Awa Fall', enseignantPrincipalId: 8, salle: 'Salle 105' }
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
  // eleveId fait référence aux IDs du tableau `eleves`
  { id: 1, eleveId: 101, matiereId: 1, enseignantId: 2, trimestre: 1, valeur: 15, coefficient: 4, type: 'Devoir', date: '2024-01-15' },
  { id: 2, eleveId: 101, matiereId: 2, enseignantId: 6, trimestre: 1, valeur: 12, coefficient: 4, type: 'Composition', date: '2024-01-20' },
  { id: 9, eleveId: 101, matiereId: 1, enseignantId: 2, trimestre: 2, valeur: 16.5, coefficient: 4, type: 'Composition', date: '2024-04-10' },
  { id: 10, eleveId: 101, matiereId: 3, enseignantId: 8, trimestre: 2, valeur: 14, coefficient: 3, type: 'Oral', date: '2024-04-15' },
  { id: 11, eleveId: 101, matiereId: 4, enseignantId: 7, trimestre: 2, valeur: 10.5, coefficient: 3, type: 'Devoir', date: '2024-04-20' },
  { id: 3, eleveId: 102, matiereId: 1, enseignantId: 2, trimestre: 1, valeur: 18, coefficient: 4, type: 'Devoir', date: '2024-01-15' },
  { id: 14, eleveId: 102, matiereId: 2, enseignantId: 6, trimestre: 1, valeur: 17, coefficient: 4, type: 'Composition', date: '2024-01-22' },
  { id: 12, eleveId: 103, matiereId: 1, enseignantId: 2, trimestre: 1, valeur: 13, coefficient: 4, type: 'Devoir', date: '2024-01-16' },
  { id: 13, eleveId: 103, matiereId: 3, enseignantId: 8, trimestre: 1, valeur: 10, coefficient: 3, type: 'Devoir', date: '2024-01-22' },
  { id: 20, eleveId: 103, matiereId: 4, enseignantId: 7, trimestre: 2, valeur: 15.5, coefficient: 3, type: 'Projet', date: '2024-04-25' },
  { id: 6, eleveId: 104, matiereId: 1, enseignantId: 2, trimestre: 1, valeur: 17, coefficient: 4, type: 'Devoir', date: '2024-01-17' },
  { id: 7, eleveId: 104, matiereId: 2, enseignantId: 6, trimestre: 1, valeur: 14.5, coefficient: 4, type: 'Composition', date: '2024-01-23' },
  { id: 8, eleveId: 104, matiereId: 5, enseignantId: 14, trimestre: 1, valeur: 11, coefficient: 3, type: 'Interrogation', date: '2024-01-25' },
  { id: 15, eleveId: 104, matiereId: 8, enseignantId: null, trimestre: 1, valeur: 16, coefficient: 3, type: 'Devoir', date: '2024-01-28' },
  { id: 16, eleveId: 109, matiereId: 2, enseignantId: 6, trimestre: 1, valeur: 19, coefficient: 4, type: 'Dictée', date: '2024-01-10' },
  { id: 17, eleveId: 109, matiereId: 1, enseignantId: 2, trimestre: 1, valeur: 18, coefficient: 4, type: 'Calcul Mental', date: '2024-01-12' },
  { id: 21, eleveId: 110, matiereId: 2, enseignantId: 6, trimestre: 1, valeur: 16, coefficient: 4, type: 'Composition', date: '2024-01-25' },
  { id: 22, eleveId: 110, matiereId: 1, enseignantId: 2, trimestre: 1, valeur: 14, coefficient: 4, type: 'Devoir', date: '2024-01-20' },
  { id: 18, eleveId: 111, matiereId: 4, enseignantId: 7, trimestre: 1, valeur: 14, coefficient: 3, type: 'Exposé', date: '2024-01-18' },
  { id: 19, eleveId: 111, matiereId: 6, enseignantId: null, trimestre: 1, valeur: 11, coefficient: 3, type: 'TP', date: '2024-01-20' },
  { id: 23, eleveId: 112, matiereId: 1, enseignantId: 2, trimestre: 1, valeur: 10, coefficient: 4, type: 'Devoir', date: '2024-01-19' },
  { id: 24, eleveId: 112, matiereId: 3, enseignantId: 8, trimestre: 1, valeur: 15, coefficient: 3, type: 'Interro', date: '2024-01-21' },
  { id: 25, eleveId: 113, matiereId: 8, enseignantId: null, trimestre: 1, valeur: 12, coefficient: 3, type: 'Devoir', date: '2024-01-26' },
  { id: 26, eleveId: 113, matiereId: 1, enseignantId: 2, trimestre: 1, valeur: 9, coefficient: 4, type: 'Composition', date: '2024-01-29' }
];

export const emploisDuTemps = [
  // --- Cours de Moussa Ndiaye (ID 2) - Mathématiques ---
  // 6ème A (ID 1)
  { id: 1, classeId: 1, classe: '6ème A', jour: 'Lundi', heure: '08:00-09:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 101' },
  { id: 4, classeId: 1, classe: '6ème A', jour: 'Mercredi', heure: '10:00-11:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 101' },
  { id: 16, classeId: 1, classe: '6ème A', jour: 'Vendredi', heure: '14:00-15:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 101' },
  { id: 52, classeId: 1, classe: '6ème A', jour: 'Mardi', heure: '15:00-16:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 101' },
  { id: 53, classeId: 1, classe: '6ème A', jour: 'Jeudi', heure: '08:00-09:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 101' },
  { id: 54, classeId: 1, classe: '6ème A', jour: 'Samedi', heure: '09:00-10:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 101' },

  // 5ème B (ID 2)
  { id: 5, classeId: 2, classe: '5ème B', jour: 'Mardi', heure: '14:00-15:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 102' },
  { id: 6, classeId: 2, classe: '5ème B', jour: 'Jeudi', heure: '09:00-10:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 102' },
  { id: 55, classeId: 2, classe: '5ème B', jour: 'Lundi', heure: '11:00-12:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 102' },
  { id: 56, classeId: 2, classe: '5ème B', jour: 'Mercredi', heure: '08:00-09:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 102' },
  { id: 57, classeId: 2, classe: '5ème B', jour: 'Vendredi', heure: '10:00-11:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 102' },

  // 2nde C (ID 5)
  { id: 17, classeId: 5, classe: '2nde C', jour: 'Lundi', heure: '10:00-11:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 305' },
  { id: 18, classeId: 5, classe: '2nde C', jour: 'Mercredi', heure: '08:00-09:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 305' },
  { id: 19, classeId: 5, classe: '2nde C', jour: 'Vendredi', heure: '16:00-17:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 305' },
  { id: 58, classeId: 5, classe: '2nde C', jour: 'Mardi', heure: '10:00-11:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 305' },
  { id: 59, classeId: 5, classe: '2nde C', jour: 'Jeudi', heure: '14:00-15:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 305' },


  // --- Cours de Khadija Ba (ID 6) - Français ---
  // 6ème A (ID 1)
  { id: 2, classeId: 1, classe: '6ème A', jour: 'Lundi', heure: '09:00-10:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 6, salle: 'Salle 101' },
  { id: 20, classeId: 1, classe: '6ème A', jour: 'Mardi', heure: '11:00-12:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 6, salle: 'Salle 101' },
  { id: 27, classeId: 1, classe: '6ème A', jour: 'Jeudi', heure: '16:00-17:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 6, salle: 'Salle 101' },
  { id: 60, classeId: 1, classe: '6ème A', jour: 'Mercredi', heure: '09:00-10:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 6, salle: 'Salle 101' },
  { id: 61, classeId: 1, classe: '6ème A', jour: 'Vendredi', heure: '08:00-09:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 6, salle: 'Salle 101' },
  { id: 62, classeId: 1, classe: '6ème A', jour: 'Samedi', heure: '10:00-11:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 6, salle: 'Salle 101' },

  // CM2 A (ID 3)
  { id: 7, classeId: 3, classe: 'CM2 A', jour: 'Mardi', heure: '08:00-09:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 6, salle: 'Salle 201' },
  { id: 9, classeId: 3, classe: 'CM2 A', jour: 'Vendredi', heure: '14:00-15:00', matiere: 'Histoire', enseignant: 'Khadija Ba', enseignantId: 6, salle: 'Salle 201' },
  { id: 28, classeId: 3, classe: 'CM2 A', jour: 'Lundi', heure: '16:00-17:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 6, salle: 'Salle 201' },
  { id: 63, classeId: 3, classe: 'CM2 A', jour: 'Jeudi', heure: '09:00-10:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 6, salle: 'Salle 201' },

  // Tle S2-A (ID 4)
  { id: 8, classeId: 4, classe: 'Tle S2-A', jour: 'Jeudi', heure: '10:00-11:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 6, salle: 'Salle 301' },
  { id: 29, classeId: 4, classe: 'Tle S2-A', jour: 'Mardi', heure: '08:00-09:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 6, salle: 'Salle 301' },
  { id: 64, classeId: 4, classe: 'Tle S2-A', jour: 'Lundi', heure: '14:00-15:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 6, salle: 'Salle 301' },

  // 3ème B (ID 6)
  { id: 30, classeId: 6, jour: 'Lundi', heure: '15:00-16:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 6, salle: 'Salle 203' },
  { id: 65, classeId: 6, jour: 'Mercredi', heure: '10:00-11:00', matiere: 'Français', enseignant: 'Khadija Ba', enseignantId: 6, salle: 'Salle 203' },


  // --- Cours de Pape Diouf (ID 7) - Histoire-Géographie ---
  // 6ème A (ID 1)
  { id: 21, classeId: 1, classe: '6ème A', jour: 'Mardi', heure: '09:00-10:00', matiere: 'Histoire-Géographie', enseignant: 'Pape Diouf', enseignantId: 7, salle: 'Salle 101' },
  { id: 31, classeId: 1, classe: '6ème A', jour: 'Jeudi', heure: '10:00-11:00', matiere: 'Histoire-Géographie', enseignant: 'Pape Diouf', enseignantId: 7, salle: 'Salle 101' },
  { id: 66, classeId: 1, classe: '6ème A', jour: 'Lundi', heure: '10:00-11:00', matiere: 'Histoire-Géographie', enseignant: 'Pape Diouf', enseignantId: 7, salle: 'Salle 101' },

  // 5ème B (ID 2)
  { id: 22, classeId: 2, classe: '5ème B', jour: 'Lundi', heure: '10:00-11:00', matiere: 'Histoire-Géographie', enseignant: 'Pape Diouf', enseignantId: 7, salle: 'Salle 102' },
  { id: 32, classeId: 2, classe: '5ème B', jour: 'Mercredi', heure: '14:00-15:00', matiere: 'Histoire-Géographie', enseignant: 'Pape Diouf', enseignantId: 7, salle: 'Salle 102' },
  { id: 67, classeId: 2, classe: '5ème B', jour: 'Vendredi', heure: '08:00-09:00', matiere: 'Histoire-Géographie', enseignant: 'Pape Diouf', enseignantId: 7, salle: 'Salle 102' },

  // 3ème B (ID 6)
  { id: 23, classeId: 6, jour: 'Jeudi', heure: '14:00-15:00', matiere: 'Histoire-Géographie', enseignant: 'Pape Diouf', enseignantId: 7, salle: 'Salle 203' },
  { id: 33, classeId: 6, jour: 'Mardi', heure: '10:00-11:00', matiere: 'Histoire-Géographie', enseignant: 'Pape Diouf', enseignantId: 7, salle: 'Salle 203' },
  { id: 68, classeId: 6, jour: 'Vendredi', heure: '11:00-12:00', matiere: 'Histoire-Géographie', enseignant: 'Pape Diouf', enseignantId: 7, salle: 'Salle 203' },

  // Tle S2-A (ID 4)
  { id: 34, classeId: 4, classe: 'Tle S2-A', jour: 'Vendredi', heure: '08:00-09:00', matiere: 'Histoire-Géographie', enseignant: 'Pape Diouf', enseignantId: 7, salle: 'Salle 301' },
  { id: 69, classeId: 4, classe: 'Tle S2-A', jour: 'Mercredi', heure: '14:00-15:00', matiere: 'Histoire-Géographie', enseignant: 'Pape Diouf', enseignantId: 7, salle: 'Salle 301' },


  // --- Cours de Awa Fall (ID 8) - Anglais ---
  // CM2 A (ID 3)
  { id: 24, classeId: 3, classe: 'CM2 A', jour: 'Lundi', heure: '14:00-15:00', matiere: 'Anglais', enseignant: 'Awa Fall', enseignantId: 8, salle: 'Salle 201' },
  { id: 35, classeId: 3, classe: 'CM2 A', jour: 'Jeudi', heure: '11:00-12:00', matiere: 'Anglais', enseignant: 'Awa Fall', enseignantId: 8, salle: 'Salle 201' },
  { id: 70, classeId: 3, classe: 'CM2 A', jour: 'Mardi', heure: '16:00-17:00', matiere: 'Anglais', enseignant: 'Awa Fall', enseignantId: 8, salle: 'Salle 201' },

  // Tle S2-A (ID 4)
  { id: 25, classeId: 4, classe: 'Tle S2-A', jour: 'Mardi', heure: '15:00-16:00', matiere: 'Anglais', enseignant: 'Awa Fall', enseignantId: 8, salle: 'Salle 301' },
  { id: 36, classeId: 4, classe: 'Tle S2-A', jour: 'Mercredi', heure: '09:00-10:00', matiere: 'Anglais', enseignant: 'Awa Fall', enseignantId: 8, salle: 'Salle 301' },
  { id: 71, classeId: 4, classe: 'Tle S2-A', jour: 'Lundi', heure: '08:00-09:00', matiere: 'Anglais', enseignant: 'Awa Fall', enseignantId: 8, salle: 'Salle 301' },

  // CE1 B (ID 7)
  { id: 26, classeId: 7, classe: 'CE1 B', jour: 'Mercredi', heure: '09:00-10:00', matiere: 'Anglais', enseignant: 'Awa Fall', enseignantId: 8, salle: 'Salle 105' },
  { id: 37, classeId: 7, classe: 'CE1 B', jour: 'Vendredi', heure: '10:00-11:00', matiere: 'Anglais', enseignant: 'Awa Fall', enseignantId: 8, salle: 'Salle 105' },
  { id: 72, classeId: 7, classe: 'CE1 B', jour: 'Mardi', heure: '14:00-15:00', matiere: 'Anglais', enseignant: 'Awa Fall', enseignantId: 8, salle: 'Salle 105' },

  // 2nde C (ID 5)
  { id: 38, classeId: 5, classe: '2nde C', jour: 'Lundi', heure: '11:00-12:00', matiere: 'Anglais', enseignant: 'Awa Fall', enseignantId: 8, salle: 'Salle 305' },
  { id: 39, classeId: 5, classe: '2nde C', jour: 'Jeudi', heure: '15:00-16:00', matiere: 'Anglais', enseignant: 'Awa Fall', enseignantId: 8, salle: 'Salle 305' },
  { id: 73, classeId: 5, classe: '2nde C', jour: 'Mercredi', heure: '14:00-15:00', matiere: 'Anglais', enseignant: 'Awa Fall', enseignantId: 8, salle: 'Salle 305' },


  // --- Cours de Moussa Sankhare (ID 14) - SVT/PC ---
  // 5ème B (ID 2) (SVT)
  { id: 40, classeId: 2, classe: '5ème B', jour: 'Lundi', heure: '08:00-09:00', matiere: 'SVT', enseignant: 'Moussa Sankhare', enseignantId: 14, salle: 'Salle Labo SVT' },
  { id: 41, classeId: 2, classe: '5ème B', jour: 'Mercredi', heure: '11:00-12:00', matiere: 'SVT', enseignant: 'Moussa Sankhare', enseignantId: 14, salle: 'Salle 102' },
  { id: 74, classeId: 2, classe: '5ème B', jour: 'Vendredi', heure: '15:00-16:00', matiere: 'SVT', enseignant: 'Moussa Sankhare', enseignantId: 14, salle: 'Salle 102' },

  // 2nde C (ID 5) (PC)
  { id: 42, classeId: 5, classe: '2nde C', jour: 'Mardi', heure: '09:00-10:00', matiere: 'Physique-Chimie', enseignant: 'Moussa Sankhare', enseignantId: 14, salle: 'Salle Labo PC' },
  { id: 43, classeId: 5, classe: '2nde C', jour: 'Jeudi', heure: '11:00-12:00', matiere: 'Physique-Chimie', enseignant: 'Moussa Sankhare', enseignantId: 14, salle: 'Salle 305' },
  { id: 75, classeId: 5, classe: '2nde C', jour: 'Lundi', heure: '09:00-10:00', matiere: 'Physique-Chimie', enseignant: 'Moussa Sankhare', enseignantId: 14, salle: 'Salle Labo PC' },

  // 3ème B (ID 6) (SVT)
  { id: 44, classeId: 6, jour: 'Vendredi', heure: '08:00-09:00', matiere: 'SVT', enseignant: 'Moussa Sankhare', enseignantId: 14, salle: 'Salle 203' },
  { id: 76, classeId: 6, jour: 'Mardi', heure: '16:00-17:00', matiere: 'SVT', enseignant: 'Moussa Sankhare', enseignantId: 14, salle: 'Salle 203' },


  // --- Autres cours (non attribués à des profs spécifiques de la liste utilisateurs) ---
  { id: 3, classeId: 1, classe: '6ème A', jour: 'Mardi', heure: '08:00-09:00', matiere: 'Anglais', enseignant: 'Fatou Diallo', enseignantId: null, salle: 'Salle 101' },
  { id: 45, classeId: 1, classe: '6ème A', jour: 'Lundi', heure: '15:00-16:00', matiere: 'EPS', enseignant: 'Coach Amina', enseignantId: null, salle: 'Terrain Foot' },
  { id: 46, classeId: 3, classe: 'CM2 A', jour: 'Jeudi', heure: '16:00-17:00', matiere: 'Musique', enseignant: 'M. Ly', enseignantId: null, salle: 'Salle Musique' },
  { id: 47, classeId: 7, classe: 'CE1 B', jour: 'Lundi', heure: '08:00-09:00', matiere: 'Mathématiques', enseignant: 'M. Dia', enseignantId: null, salle: 'Salle 105' },
  { id: 48, classeId: 7, classe: 'CE1 B', jour: 'Mardi', heure: '10:00-11:00', matiere: 'Lecture', enseignant: 'Mme Gaye', enseignantId: null, salle: 'Salle 105' },
  { id: 49, classeId: 6, classe: '3ème B', jour: 'Mardi', heure: '08:00-09:00', matiere: 'Mathématiques', enseignant: 'Moussa Ndiaye', enseignantId: 2, salle: 'Salle 203' },
  { id: 50, classeId: 6, classe: '3ème B', jour: 'Mercredi', heure: '09:00-10:00', matiere: 'Arabe', enseignant: 'Imam Fall', enseignantId: null, salle: 'Salle Mosquée' },
  { id: 51, classeId: 5, classe: '2nde C', jour: 'Vendredi', heure: '08:00-09:00', matiere: 'SVT', enseignant: 'Moussa Sankhare', enseignantId: 14, salle: 'Salle Labo SVT' },
  { id: 77, classeId: 1, classe: '6ème A', jour: 'Mercredi', heure: '14:00-15:00', matiere: 'Technologie', enseignant: 'M. Jean', enseignantId: null, salle: 'Salle Info' },
  { id: 78, classeId: 2, classe: '5ème B', jour: 'Jeudi', heure: '15:00-16:00', matiere: 'Anglais', enseignant: 'Mme Ndiaye', enseignantId: null, salle: 'Salle 102' }
];

export const paiements = [
  { id: 1, eleveId: 101, montant: 50000, datePayment: '2024-01-15', typePaiement: 'Scolarité', statut: 'payé', methode: 'Orange Money', numeroRecu: 'RC001', commentaire: 'Premier versement scolarité T1' },
  { id: 2, eleveId: 102, montant: 45000, datePayment: '2024-01-10', typePaiement: 'Scolarité', statut: 'payé', methode: 'Wave', numeroRecu: 'RC002', commentaire: 'Versement scolarité T1' },
  { id: 3, eleveId: 103, montant: 50000, datePayment: '2024-01-20', typePaiement: 'Scolarité', statut: 'en_attente', methode: 'Espèces', numeroRecu: 'RC003', commentaire: 'En attente de confirmation' },
  { id: 4, eleveId: 104, montant: 75000, datePayment: '2023-09-01', typePaiement: 'Inscription', statut: 'payé', methode: 'Virement bancaire', numeroRecu: 'INS001', commentaire: 'Frais d\'inscription année scolaire' },
  { id: 5, eleveId: 104, montant: 60000, datePayment: '2023-10-05', typePaiement: 'Scolarité', statut: 'payé', methode: 'Orange Money', numeroRecu: 'RC004', commentaire: '1ère tranche scolarité' },
  { id: 6, eleveId: 104, montant: 60000, datePayment: '2024-01-05', typePaiement: 'Scolarité', statut: 'payé', methode: 'Wave', numeroRecu: 'RC005', commentaire: '2ème tranche scolarité' },
  { id: 7, eleveId: 104, montant: 15000, datePayment: '2024-03-20', typePaiement: 'Cantine', statut: 'payé', methode: 'Espèces', numeroRecu: 'CANT001', commentaire: 'Paiement cantine Mars' },
  { id: 8, eleveId: 110, montant: 55000, datePayment: '2023-09-10', typePaiement: 'Scolarité', statut: 'payé', methode: 'Espèces', numeroRecu: 'RC006', commentaire: 'Paiement rentrée CM2' },
  { id: 9, eleveId: 109, montant: 40000, datePayment: '2023-09-05', typePaiement: 'Scolarité', statut: 'payé', methode: 'Orange Money', numeroRecu: 'RC007', commentaire: 'Scolarité CE1' },
  { id: 10, eleveId: 111, montant: 60000, datePayment: '2023-09-15', typePaiement: 'Scolarité', statut: 'payé', methode: 'Wave', numeroRecu: 'RC008', commentaire: 'Scolarité 3ème' },
  { id: 11, eleveId: 112, montant: 50000, datePayment: '2024-03-20', typePaiement: 'Scolarité', statut: 'payé', methode: 'Espèces', numeroRecu: 'RC009', commentaire: 'Scolarité 6ème' },
  { id: 12, eleveId: 113, montant: 70000, datePayment: '2023-09-25', typePaiement: 'Scolarité', statut: 'en_attente', methode: 'Virement bancaire', numeroRecu: 'RC010', commentaire: 'En attente de virement' },
  { id: 13, eleveId: 114, montant: 45000, datePayment: '2023-09-08', typePaiement: 'Cantine', statut: 'payé', methode: 'Mobile Money', numeroRecu: 'CANT002', commentaire: 'Paiement cantine Septembre' }
];

export const notifications = [
  { id: 1, titre: 'Réunion des parents', message: 'Réunion des parents d\'élèves prévue le 25 janvier 2024 à 15h00 à la salle polyvalente.', date: '2024-01-20', expediteur: 'Administration', destinataires: ['parent'], lue: false, priorite: 'haute' },
  { id: 2, titre: 'Compositions du 1er trimestre', message: 'Les compositions du premier trimestre débuteront le 30 janvier 2024. Veuillez consulter le calendrier détaillé.', date: '2024-01-18', expediteur: 'Administration', destinataires: ['eleve', 'parent', 'enseignant'], lue: false, priorite: 'normale' },
  { id: 3, titre: 'Portes ouvertes de l\'école', message: 'Venez découvrir nos installations et rencontrer nos équipes le samedi 10 février. Programme complet disponible sur le site.', date: '2024-02-01', expediteur: 'Direction', destinataires: ['parent', 'eleve'], lue: false, priorite: 'normale' },
  { id: 4, titre: 'Avis de retard de paiement', message: 'Le paiement de la scolarité du mois de Février est en attente pour votre enfant. Veuillez régulariser avant le 15/02 afin d\'éviter des frais supplémentaires.', date: '2024-02-05', expediteur: 'Comptabilité', destinataires: ['parent'], lue: false, priorite: 'urgente' },
  { id: 5, titre: 'Sortie scolaire au Lac Rose', message: 'Une sortie scolaire est organisée pour les classes de 6ème et 5ème le 15 mars. Coût: 5000 FCFA. Inscriptions ouvertes.', date: '2024-03-01', expediteur: 'Vie Scolaire', destinataires: ['eleve', 'parent'], lue: false, priorite: 'normale' }
];

export const documents = [
  { id: 1, titre: 'Cours de Mathématiques - Chapitre 1', type: 'cours', matiere: 'Mathématiques', classe: '6ème A', enseignantId: 2, dateAjout: '2024-01-10', taille: '2.5 MB', format: 'PDF' },
  { id: 2, titre: 'Exercices de Français - CM2', type: 'exercices', matiere: 'Français', classe: 'CM2 A', enseignantId: 6, dateAjout: '2024-01-12', taille: '1.8 MB', format: 'PDF' },
  { id: 3, titre: 'Examen Blanc de Philosophie S2', type: 'devoirs', matiere: 'Philosophie', classe: 'Tle S2-A', enseignantId: null, dateAjout: '2024-05-10', taille: '3.1 MB', format: 'PDF' },
  { id: 4, titre: 'TD de Sciences Physiques - 5ème', type: 'exercices', matiere: 'Physique-Chimie', classe: '5ème B', enseignantId: 2, dateAjout: '2024-03-01', taille: '1.2 MB', format: 'DOCX' },
  { id: 5, titre: 'Planning des révisions BAC S2', type: 'evaluations', matiere: 'Général', classe: 'Tle S2-A', enseignantId: null, dateAjout: '2024-05-15', taille: '0.5 MB', format: 'PDF' },
  { id: 6, titre: 'Leçon de lecture CP',
    type: 'cours', matiere: 'Français', classe: 'CE1 B', enseignantId: 6, dateAjout: '2024-04-01', taille: '0.8 MB', format: 'PDF' },
  { id: 7, titre: 'Résumé Histoire 3ème', type: 'cours', matiere: 'Histoire-Géographie', classe: '3ème B', enseignantId: 7, dateAjout: '2024-03-10', taille: '2.1 MB', format: 'PDF' },
  { id: 8, titre: 'Exercices d\'Anglais 2nde', type: 'exercices', matiere: 'Anglais', classe: '2nde C', enseignantId: 8, dateAjout: '2024-02-14', taille: '1.5 MB', format: 'DOCX' }
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