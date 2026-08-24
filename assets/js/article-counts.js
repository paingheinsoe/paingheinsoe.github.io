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

  function setCount(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = String(value || 0);
  }

  function updateFromGeneratedSummary() {
    const articleSummary = window.__ARTICLE_SUMMARY__;
    if (!articleSummary || !articleSummary.categories) return false;

    setCount("article-total", articleSummary.all);
    setCount("count-locked", articleSummary.locked);
    setCount("count-energy-climate", articleSummary.categories["Energy & Climate"]);
    setCount("count-ai-agents", articleSummary.categories["AI & Agents"]);
    setCount("count-data-analytics", articleSummary.categories["Data Analytics"]);
    setCount(
      "count-programming-technology",
      articleSummary.categories["Programming & Technology"]
    );

    return true;
  }

  function updateCounts() {
    const summary = document.getElementById("learning-hub-summary");
    if (!summary) return;

    if (updateFromGeneratedSummary()) return;

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
    let lockedCount = 0;

    items.forEach((item) => {
      if (item.querySelector(".article-status--locked")) {
        lockedCount += 1;
      }

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

    setCount("article-total", items.length);
    setCount("count-locked", lockedCount);

    const map = {
      "Energy & Climate": "count-energy-climate",
      "AI & Agents": "count-ai-agents",
      "Data Analytics": "count-data-analytics",
      "Programming & Technology": "count-programming-technology"
    };

    Object.entries(map).forEach(([category, id]) => {
      setCount(id, counts[category]);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateCounts();

    // Quarto listings may finish rendering just after DOMContentLoaded.
    window.setTimeout(updateCounts, 150);
    window.setTimeout(updateCounts, 500);
  });
})();
