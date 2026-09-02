/**
 * ui-dashboard.js
 * ----------------------------------------------------------------------
 * Rendu du tableau de bord : corkboard listant tous les modules
 * de storyboard disponibles.
 * ----------------------------------------------------------------------
 */

const UIDashboard = (() => {

  const STATUT_LABELS = {
    valide: "Validé",
    a_relire: "À relire",
    brouillon: "Brouillon"
  };

  function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  }

  function renderProgressStrip(statuts) {
    const total = statuts.total || 1;
    const segments = ["valide", "a_relire", "brouillon"]
      .filter(key => statuts[key] > 0)
      .map(key => {
        const pct = (statuts[key] / total) * 100;
        return `<div class="progress-strip__seg" data-tone="${key}" style="width:${pct}%" title="${STATUT_LABELS[key]} : ${statuts[key]}"></div>`;
      })
      .join("");
    return `<div class="progress-strip">${segments}</div>`;
  }

  function renderModuleCard(entry, index) {
    const tilt = (index % 2 === 0 ? -1 : 1) * (0.3 + (index % 3) * 0.25);
    const statuts = { ...entry.statuts, total: entry.totalDiapos };

    return `
      <a class="module-card" style="--tilt:${tilt}deg" href="module.html?fichier=${encodeURIComponent(entry.fichier)}">
        <div class="module-card__seq">${escapeHtml(entry.sequence)}</div>
        <h2 class="module-card__title">${escapeHtml(entry.titre)}</h2>
        ${renderProgressStrip(statuts)}
        <div class="module-card__meta">
          <span>${entry.totalDiapos} diapo${entry.totalDiapos > 1 ? "s" : ""}</span>
          <span>${statuts.valide || 0} validée${(statuts.valide || 0) > 1 ? "s" : ""}</span>
        </div>
        <div class="module-card__footer">
          <span>Modifié le ${formatDate(entry.derniereModification)}</span>
        </div>
      </a>`;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
  }

  /**
   * Affiche le tableau de bord dans le conteneur fourni.
   * @param {HTMLElement} container
   * @param {Array} modules
   */
  function render(container, modules) {
    if (!modules.length) {
      container.innerHTML = `
        <div class="empty-state">
          Aucun module de storyboard pour l'instant.<br>
          Créez-en un pour démarrer.
        </div>`;
      return;
    }

    const cards = modules.map(renderModuleCard).join("");
    container.innerHTML = `
      <div class="corkboard">
        ${cards}
        <a class="module-card module-card--new" href="#" data-action="new-module">
          + Nouveau module
        </a>
      </div>`;
  }

  return { render };

})();
