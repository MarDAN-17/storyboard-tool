# Storyboard Tool

Outil web pour créer, consulter et faire relire les storyboards de modules e-learning en équipe — hébergé sur GitHub Pages, sans backend dédié.

## État actuel — Étape 1/4

✅ **Étape 1 : Tableau de bord + vue consultation** (cette livraison)
⬜ Étape 2 : Éditeur (créer/modifier/réordonner les diapos)
⬜ Étape 3 : Intégration API GitHub (authentification, écriture, gestion des conflits)
⬜ Étape 4 : Mode Relecture (annotations via GitHub Issues), export PDF/CSV

## Structure du projet

```
storyboard-tool/
├── index.html              → Tableau de bord (liste des modules)
├── module.html              → Vue consultation d'un module
├── css/
│   └── styles.css           → Feuille de style unique
├── js/
│   ├── storyboard-model.js  → Accès aux données (fetch JSON)
│   ├── ui-dashboard.js      → Rendu du tableau de bord
│   ├── ui-viewer.js         → Rendu de la vue consultation
│   ├── app-dashboard.js     → Point d'entrée de index.html
│   └── app-module.js        → Point d'entrée de module.html
└── data/
    ├── index.json                             → Registre léger des modules
    ├── templates/
    │   └── module-vierge.json                 → Modèle à copier pour tout nouveau module
    └── storyboards/
        ├── methodes-implantation-stocks.json    → Exemple 1 (logistique)
        └── sensibilisation-cybersecurite.json   → Exemple 2 (cybersécurité)
```

> **Deux modules de démonstration, dans deux domaines différents**, sont inclus
> volontairement : ni le modèle de données, ni l'interface ne contiennent quoi
> que ce soit de spécifique à la logistique. L'outil est générique — n'importe
> quel type de formation (sécurité, RH, produit, réglementaire…) suit exactement
> le même schéma.

## Modèle de données

Chaque module de storyboard est **un fichier JSON indépendant** dans `data/storyboards/`.
Ce découpage est volontaire : deux personnes qui éditent deux modules différents ne
génèrent jamais de conflit Git, et il n'y a aucune limite au nombre de modules.

`data/index.json` référence tous les modules avec leurs métadonnées légères
(titre, séquence, statuts agrégés) — c'est ce fichier qui alimente le tableau de bord
sans avoir à charger chaque module en entier.

### Schéma d'un module (`data/storyboards/<id>.json`)

```jsonc
{
  "id": "identifiant-unique",
  "titre": "Titre du module",
  "sequence": "Nom de la séquence pédagogique",
  "savoirs": "Codes savoirs couverts (ex. SAV-SFT-SFO-SFC)",
  "derniereModification": "AAAA-MM-JJ",
  "chapitres": [
    {
      "id": "chap-1",
      "numero": "1",
      "titre": "Titre du chapitre",
      "diapos": [
        {
          "id": "slide-001",
          "numeroTitre": "4- Introduction",
          "referenceMasque": "Logistique 3",
          "texteEcran": "Texte affiché à l'écran",
          "interactions": "Description des interactions",
          "elementsVisuels": "Description des éléments visuels",
          "notesProduction": "Notes internes pour la production",
          "navigation": "Règles de navigation",
          "statut": "brouillon | a_relire | valide"
        }
      ]
    }
  ]
}
```

## Lancer le projet en local

Les pages utilisent `fetch()` pour charger les fichiers JSON, ce qui nécessite un
serveur local (l'ouverture directe du fichier `index.html` via `file://` bloque ces
requêtes dans la plupart des navigateurs).

```bash
# Depuis le dossier storyboard-tool/
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Ajouter un nouveau module (pour l'instant, manuellement)

1. Copier `data/templates/module-vierge.json` dans `data/storyboards/` sous un nouveau nom
   (ex. `onboarding-rh.json`), et supprimer le champ `_commentaire`.
2. Adapter `id`, `titre`, `sequence`, `chapitres` et `diapos` au contenu réel du module.
3. Ajouter une entrée correspondante dans `data/index.json`.

*(Cette étape sera automatisée dans l'éditeur à l'Étape 2.)*

## Prochaine étape

L'**Étape 2** ajoutera l'édition : création/modification/suppression/réordonnancement
des diapos et chapitres, directement dans le navigateur — toujours sans écriture
réseau à ce stade (elle arrivera à l'Étape 3 avec l'API GitHub).
