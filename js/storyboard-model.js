/**
 * storyboard-model.js
 * ----------------------------------------------------------------------
 * Chargement et accès aux données des storyboards.
 * Étape 1 : lecture seule depuis les fichiers JSON locaux (data/).
 * Étape 3 (à venir) : ces mêmes fonctions liront depuis l'API GitHub,
 * sans changer la façon dont les vues consomment les données.
 * ----------------------------------------------------------------------
 */

const StoryboardModel = (() => {

  const DATA_ROOT = "data";

  async function loadIndex() {
    const res = await fetch(`${DATA_ROOT}/index.json`);
    if (!res.ok) {
      throw new Error(`Impossible de charger l'index des modules (${res.status})`);
    }
    return res.json();
  }

  async function loadModule(fichier) {
    const res = await fetch(`${DATA_ROOT}/${fichier}`);
    if (!res.ok) {
      throw new Error(`Impossible de charger le module "${fichier}" (${res.status})`);
    }
    return res.json();
  }

  function flattenDiapos(module) {
    const out = [];
    for (const chapitre of module.chapitres || []) {
      for (const diapo of chapitre.diapos || []) {
        out.push({
          ...diapo,
          chapitreId: chapitre.id,
          chapitreNumero: chapitre.numero,
          chapitreTitre: chapitre.titre
        });
      }
    }
    return out;
  }

  function computeStatuts(module) {
    const counts = { valide: 0, a_relire: 0, brouillon: 0 };
    let total = 0;
    for (const diapo of flattenDiapos(module)) {
      if (counts[diapo.statut] !== undefined) counts[diapo.statut]++;
      total++;
    }
    return { ...counts, total };
  }

  return {
    loadIndex,
    loadModule,
    flattenDiapos,
    computeStatuts
  };

})();
