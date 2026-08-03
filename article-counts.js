(() => {
  function normalize(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function getListingItems(listing) {
    if (!listing) return [];

    let items = Array.from(listing.querySelectorAll(".quarto-grid-item"));
    if (items.length) return items;

    items = Array.from(listing.querySelectorAll(".quarto-post"));
    if (items.length) return items;

    items = Array.from(
      listing.querySelectorAll(":scope > .grid > .card, :scope .card")
    );

    return items;
  }

  function updateCounts() {
    const summary = document.getElementById("learning-hub-summary");
    if (!summary) return;

    const listing =
      document.getElementById("listing-all-articles") ||
      document.querySelector("#all-articles .quarto-listing") ||
      document.querySelector(".quarto-listing");

    const items = getListingItems(listing);
    if (!items.length) return;

    const counts = {
      "Energy & Climate": 0,
      "AI & Agents": 0,
      "Data Analytics": 0,
      "Programming & Technology": 0
    };

    items.forEach((item) => {
      const categoryNodes = item.querySelectorAll(
        ".listing-category, .quarto-category, .category"
      );

      categoryNodes.forEach((node) => {
        const category = normalize(node.textContent);

        if (Object.prototype.hasOwnProperty.call(counts, category)) {
          counts[category] += 1;
        }
      });
    });

    const totalEl = document.getElementById("article-total");

    if (totalEl) {
      totalEl.textContent = String(items.length);
    }

    const map = {
      "Energy & Climate": "count-energy-climate",
      "AI & Agents": "count-ai-agents",
      "Data Analytics": "count-data-analytics",
      "Programming & Technology": "count-programming-technology"
    };

    Object.entries(map).forEach(([category, id]) => {
      const el = document.getElementById(id);

      if (el) {
        el.textContent = String(counts[category] || 0);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateCounts();

    // Quarto listings may finish rendering just after DOMContentLoaded.
    window.setTimeout(updateCounts, 150);
    window.setTimeout(updateCounts, 500);
  });
})();