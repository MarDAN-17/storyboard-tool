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

  /**
   * Charge l'index léger de tous les modules (pour le tableau de bord).
   * @returns {Promise<{modules: Array}>}
   */
  async function loadIndex() {
    const res = await fetch(`${DATA_ROOT}/index.json`);
    if (!res.ok) {
      throw new Error(`Impossible de charger l'index des modules (${res.status})`);
    }
    return res.json();
  }

  /**
   * Charge un module de storyboard complet (chapitres + diapos).
   * @param {string} fichier - chemin relatif indiqué dans index.json
   * @returns {Promise<Object>}
   */
  async function loadModule(fichier) {
    const res = await fetch(`${DATA_ROOT}/${fichier}`);
    if (!res.ok) {
      throw new Error(`Impossible de charger le module "${fichier}" (${res.status})`);
    }
    return res.json();
  }

  /**
   * Aplatit un module en une liste de diapos, chacune enrichie
   * des informations de son chapitre parent (pratique pour la recherche
   * et les filtres transverses).
   * @param {Object} module
   * @returns {Array<Object>}
   */
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

  /**
   * Calcule la répartition des statuts d'un module (utile pour la barre
   * de progression et les filtres du tableau de bord).
   * @param {Object} module
   * @returns {{valide: number, a_relire: number, brouillon: number, total: number}}
   */
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
