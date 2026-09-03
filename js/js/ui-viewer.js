/**
 * ui-viewer.js
 * ----------------------------------------------------------------------
 * Rendu de la vue consultation d'un module : rail de chapitres à gauche,
 * fiches de diapos empilées à droite. Gère aussi la recherche et les
 * filtres par statut (entièrement côté client, sur les données déjà
 * chargées — aucun rechargement réseau lors du filtrage).
 * ----------------------------------------------------------------------
 */

const UIViewer = (() => {

  const STATUT_LABELS = {
    valide: "Validé",
    a_relire: "À relire",
    brouillon: "Brouillon"
  };

  let currentModule = null;
  let currentFilters = { statut: "all", query: "" };
  let elements = {};

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
  }

  function renderField(label, value) {
    const hasValue = value && value.trim().length > 0;
    return `
      <div>
        <div class="field-label">${label}</div>
        <div class="field-value ${hasValue ? "" : "field-value--empty"}">${hasValue ? escapeHtml(value) : "Non renseigné"}</div>
      </div>`;
  }

  function renderSlideCard(diapo) {
    return `
      <article class="slide-card" data-statut="${diapo.statut}">
        <div class="slide-card__top">
          <div class="slide-card__id">
            <strong>${escapeHtml(diapo.numeroTitre || diapo.id)}</strong>
            ${escapeHtml(diapo.id)}
          </div>
          <span class="status-tag" data-tone="${diapo.statut}">${STATUT_LABELS[diapo.statut] || diapo.statut}</span>
        </div>
        ${diapo.referenceMasque ? `<div class="slide-card__ref">Masque : ${escapeHtml(diapo.referenceMasque)}</div>` : ""}
        <div class="slide-card__text">${escapeHtml(diapo.texteEcran) || "<em>Texte à l'écran non renseigné</em>"}</div>
        <div class="slide-card__grid">
          ${renderField("Interactions", diapo.interactions)}
          ${renderField("Éléments visuels", diapo.elementsVisuels)}
          ${renderField("Notes pour la production", diapo.notesProduction)}
        </div>
        ${diapo.navigation ? `<div class="slide-card__nav">${escapeHtml(diapo.navigation)}</div>` : ""}
      </article>`;
  }

  function chapterMatchesFilters(chapitre) {
    return chapitre.diapos.some(diapoMatchesFilters);
  }

  function diapoMatchesFilters(diapo) {
    if (currentFilters.statut !== "all" && diapo.statut !== currentFilters.statut) {
      return false;
    }
    if (currentFilters.query) {
      const haystack = [
        diapo.texteEcran, diapo.interactions, diapo.elementsVisuels,
        diapo.notesProduction, diapo.numeroTitre
      ].join(" ").toLowerCase();
      if (!haystack.includes(currentFilters.query.toLowerCase())) {
        return false;
      }
    }
    return true;
  }

  function renderRail() {
    const items = currentModule.chapitres.map(chapitre => `
      <a class="chapter-rail__item" href="#chapitre-${chapitre.id}" data-chapitre="${chapitre.id}">
        <span class="chapter-rail__num">Chapitre ${escapeHtml(chapitre.numero)}</span>
        <span class="chapter-rail__title">${escapeHtml(chapitre.titre)}</span>
        <span class="chapter-rail__count">${chapitre.diapos.length} diapo${chapitre.diapos.length > 1 ? "s" : ""}</span>
      </a>`).join("");
    elements.rail.innerHTML = items;
  }

  function renderSlides() {
    const visibleChapters = currentModule.chapitres.filter(chapterMatchesFilters);

    if (!visibleChapters.length) {
      elements.slides.innerHTML = `
        <div class="empty-state">
          Aucune diapo ne correspond à votre recherche ou aux filtres actifs.
        </div>`;
      return;
    }

    elements.slides.innerHTML = visibleChapters.map(chapitre => {
      const visibleSlides = chapitre.diapos.filter(diapoMatchesFilters);
      return `
        <section class="chapter-section" id="chapitre-${chapitre.id}">
          <div class="chapter-section__heading">
            <span class="num">${escapeHtml(chapitre.numero)}</span>
            <h2>${escapeHtml(chapitre.titre)}</h2>
          </div>
          <div class="slide-stack">
            ${visibleSlides.map(renderSlideCard).join("")}
          </div>
        </section>`;
    }).join("");
  }

  function highlightActiveChapter() {
    const sections = [...elements.slides.querySelectorAll(".chapter-section")];
    if (!sections.length) return;

    const railItems = [...elements.rail.querySelectorAll(".chapter-rail__item")];
    const setActive = (id) => {
      railItems.forEach(item => {
        item.dataset.active = String(item.dataset.chapitre === id);
      });
    };

    setActive(sections[0].id.replace("chapitre-", ""));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id.replace("chapitre-", ""));
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });

    sections.forEach(section => observer.observe(section));
  }

  function bindToolbar() {
    elements.searchInput.addEventListener("input", (e) => {
      currentFilters.query = e.target.value;
      renderSlides();
    });

    elements.statutChips.forEach(chip => {
      chip.addEventListener("click", () => {
        currentFilters.statut = chip.dataset.statut;
        elements.statutChips.forEach(c => c.dataset.active = String(c === chip));
        renderSlides();
      });
    });
  }

  function render(module, refs) {
    currentModule = module;
    elements = refs;

    elements.titleEl.textContent = module.titre;
    elements.seqEl.textContent = module.sequence;

    renderRail();
    renderSlides();
    bindToolbar();
    highlightActiveChapter();
  }

  return { render };

})();
