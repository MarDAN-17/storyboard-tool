/**
 * app-dashboard.js
 * ----------------------------------------------------------------------
 * Point d'entrée de la page index.html (tableau de bord).
 * ----------------------------------------------------------------------
 */

(async function init() {
  const root = document.getElementById("dashboard-root");

  try {
    const { modules } = await StoryboardModel.loadIndex();
    UIDashboard.render(root, modules);
  } catch (err) {
    console.error(err);
    root.innerHTML = `
      <div class="empty-state">
        Impossible de charger la liste des modules.<br>
        ${err.message}
      </div>`;
  }
})();
