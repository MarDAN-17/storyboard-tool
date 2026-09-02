/**
 * app-module.js
 * ----------------------------------------------------------------------
 * Point d'entrée de la page module.html (vue consultation).
 * Lit le paramètre ?fichier= dans l'URL pour savoir quel module charger.
 * ----------------------------------------------------------------------
 */

(async function init() {
  const params = new URLSearchParams(window.location.search);
  const fichier = params.get("fichier");
  const slidesRoot = document.getElementById("slides-root");

  if (!fichier) {
    slidesRoot.innerHTML = `
      <div class="empty-state">
        Aucun module spécifié. Retournez au
        <a href="index.html">tableau de bord</a>.
      </div>`;
    return;
  }

  try {
    const module = await StoryboardModel.loadModule(fichier);

    document.title = `${module.titre} — Storyboard`;
    document.getElementById("breadcrumb-module").textContent = module.titre;

    UIViewer.render(module, {
      rail: document.getElementById("chapter-rail"),
      slides: slidesRoot,
      searchInput: document.getElementById("search-input"),
      statutChips: [...document.querySelectorAll("#statut-chips .chip")],
      titleEl: document.getElementById("module-title"),
      seqEl: document.getElementById("module-sequence")
    });
  } catch (err) {
    console.error(err);
    slidesRoot.innerHTML = `
      <div class="empty-state">
        Impossible de charger ce module.<br>
        ${err.message}
      </div>`;
  }
})();
