import { ExpenseCategory, ExpenseCategoryGroup } from '@/types/expense';

export const EXPENSE_CATEGORY_GROUP_LABELS: Record<ExpenseCategoryGroup, string> = {
  [ExpenseCategoryGroup.ADMINISTRATIVE]: '🏢 Dépenses administratives',
  [ExpenseCategoryGroup.MOBILITY]: '🚗 Déplacements et mobilité',
  [ExpenseCategoryGroup.MARKETING]: '📢 Marketing & communication',
  [ExpenseCategoryGroup.IT]: '🖥️ IT et technologie',
  [ExpenseCategoryGroup.OPERATIONS]: '📦 Opérations / services',
  [ExpenseCategoryGroup.LEGAL]: '⚖️ Légal & conformité',
  [ExpenseCategoryGroup.OTHER]: '🔐 Autres / Divers',
};

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  // Administratives
  [ExpenseCategory.OFFICE_RENT]: 'Loyer du bureau',
  [ExpenseCategory.OFFICE_CHARGES]: 'Charges locatives (eau, électricité, sécurité)',
  [ExpenseCategory.INTERNET]: 'Internet et télécommunications',
  [ExpenseCategory.OFFICE_SUPPLIES]: 'Fournitures de bureau',
  [ExpenseCategory.SOFTWARE_SUBSCRIPTIONS]: 'Abonnements logiciels',
  [ExpenseCategory.POSTAL_FEES]: 'Frais postaux et coursiers',
  [ExpenseCategory.INSURANCE]: 'Assurance bureau / entreprise',

  // Déplacements et mobilité
  [ExpenseCategory.LOCAL_TRANSPORT]: 'Transport local (taxi, essence, moto)',
  [ExpenseCategory.MILEAGE_REIMBURSEMENT]: 'Remboursement frais kilométriques',
  [ExpenseCategory.FLIGHTS]: "Billets d'avion",
  [ExpenseCategory.ACCOMMODATION]: 'Hébergement (hôtel)',
  [ExpenseCategory.PER_DIEM]: 'Per diem (allocations journalières)',
  [ExpenseCategory.CAR_RENTAL]: 'Location de voiture',
  [ExpenseCategory.MISSION_FEES]: 'Visa et frais de mission',

  // Marketing & communication
  [ExpenseCategory.ONLINE_ADS]: 'Publicité en ligne (Meta Ads, Google Ads, TikTok Ads…)',
  [ExpenseCategory.DESIGN]: 'Conception graphique / visuelle',
  [ExpenseCategory.PRINTING]: 'Impression (flyers, roll-up, brochures)',
  [ExpenseCategory.PHOTOGRAPHY]: 'Photographe / vidéaste',
  [ExpenseCategory.SOCIAL_MEDIA]: 'Réseaux sociaux (sponsoring, community manager)',
  [ExpenseCategory.PARTNERSHIPS]: 'Partenariats & influenceurs',
  [ExpenseCategory.WEBSITE]: 'Site internet (hébergement, nom de domaine)',

  // IT et technologie
  [ExpenseCategory.SOFTWARE_DEV]: 'Développement logiciel / maintenance',
  [ExpenseCategory.SERVER_HOSTING]: 'Hébergement serveur (AWS, OVH, etc.)',
  [ExpenseCategory.CYBERSECURITY]: 'Sécurité informatique (antivirus, VPN)',
  [ExpenseCategory.HARDWARE_PURCHASE]: 'Achat de matériel (PC, routeurs, etc.)',
  [ExpenseCategory.SOFTWARE_LICENSES]: 'Licences logicielles (SaaS)',
  [ExpenseCategory.TECH_EQUIPMENT]: 'Achat de matériel technique ou équipements',

  // Opérations / services
  [ExpenseCategory.BANK_FEES]: 'Frais bancaires (virements, transferts, frais de retrait)',
  [ExpenseCategory.FREELANCE_FEES]: 'Rémunération prestataires / freelances',
  [ExpenseCategory.EXTERNAL_MISSIONS]: "Frais de mission ou d'intervention externe",
  [ExpenseCategory.CERTIFICATION_FEES]: "Frais de certification ou d'audit",

  // Légal & conformité
  [ExpenseCategory.LEGAL_FEES]: "Honoraires d'avocat ou notaire",
  [ExpenseCategory.ADMIN_REGISTRATION]: 'Enregistrement administratif',
  [ExpenseCategory.LICENSE_RENEWAL]: 'Renouvellement de licence ou agrément',
  [ExpenseCategory.COMPLIANCE_FEES]:
    'Frais de conformité réglementaire (PSP, anti-blanchiment, etc.)',

  // Autres / Divers
  [ExpenseCategory.TAXES]: 'Impôts et taxes',
  [ExpenseCategory.PENALTIES]: 'Pénalités / amendes',
  [ExpenseCategory.DONATIONS]: 'Dons ou sponsoring',
  [ExpenseCategory.LOSSES]: 'Pertes ou écarts de caisse',
  [ExpenseCategory.ONE_TIME_PURCHASE]: 'Achat ponctuel ou exceptionnel',
};

export const CATEGORIES_BY_GROUP: Record<ExpenseCategoryGroup, ExpenseCategory[]> = {
  [ExpenseCategoryGroup.ADMINISTRATIVE]: [
    ExpenseCategory.OFFICE_RENT,
    ExpenseCategory.OFFICE_CHARGES,
    ExpenseCategory.INTERNET,
    ExpenseCategory.OFFICE_SUPPLIES,
    ExpenseCategory.SOFTWARE_SUBSCRIPTIONS,
    ExpenseCategory.POSTAL_FEES,
    ExpenseCategory.INSURANCE,
  ],
  [ExpenseCategoryGroup.MOBILITY]: [
    ExpenseCategory.LOCAL_TRANSPORT,
    ExpenseCategory.MILEAGE_REIMBURSEMENT,
    ExpenseCategory.FLIGHTS,
    ExpenseCategory.ACCOMMODATION,
    ExpenseCategory.PER_DIEM,
    ExpenseCategory.CAR_RENTAL,
    ExpenseCategory.MISSION_FEES,
  ],
  [ExpenseCategoryGroup.MARKETING]: [
    ExpenseCategory.ONLINE_ADS,
    ExpenseCategory.DESIGN,
    ExpenseCategory.PRINTING,
    ExpenseCategory.PHOTOGRAPHY,
    ExpenseCategory.SOCIAL_MEDIA,
    ExpenseCategory.PARTNERSHIPS,
    ExpenseCategory.WEBSITE,
  ],
  [ExpenseCategoryGroup.IT]: [
    ExpenseCategory.SOFTWARE_DEV,
    ExpenseCategory.SERVER_HOSTING,
    ExpenseCategory.CYBERSECURITY,
    ExpenseCategory.HARDWARE_PURCHASE,
    ExpenseCategory.SOFTWARE_LICENSES,
    ExpenseCategory.TECH_EQUIPMENT,
  ],
  [ExpenseCategoryGroup.OPERATIONS]: [
    ExpenseCategory.BANK_FEES,
    ExpenseCategory.FREELANCE_FEES,
    ExpenseCategory.EXTERNAL_MISSIONS,
    ExpenseCategory.CERTIFICATION_FEES,
  ],
  [ExpenseCategoryGroup.LEGAL]: [
    ExpenseCategory.LEGAL_FEES,
    ExpenseCategory.ADMIN_REGISTRATION,
    ExpenseCategory.LICENSE_RENEWAL,
    ExpenseCategory.COMPLIANCE_FEES,
  ],
  [ExpenseCategoryGroup.OTHER]: [
    ExpenseCategory.TAXES,
    ExpenseCategory.PENALTIES,
    ExpenseCategory.DONATIONS,
    ExpenseCategory.LOSSES,
    ExpenseCategory.ONE_TIME_PURCHASE,
  ],
};
