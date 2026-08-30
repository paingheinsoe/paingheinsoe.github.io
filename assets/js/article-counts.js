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

    document.querySelectorAll("[data-category-id]").forEach((element) => {
      const category = articleSummary.categories[element.dataset.categoryId];
      const count = typeof category === "number" ? category : category?.count;
      element.textContent = String(count || 0);
    });

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

    const categoryElements = Array.from(
      summary.querySelectorAll("[data-category-id]")
    );
    const categories = new Map(
      categoryElements.map((element) => {
        const label = normalize(
          element.closest(".learning-hub-category")?.querySelector("a")?.textContent
        );
        return [label, { element, count: 0 }];
      })
    );
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

        const categoryEntry = categories.get(category);
        if (categoryEntry) categoryEntry.count += 1;
      });
    });

    setCount("article-total", items.length);
    setCount("count-locked", lockedCount);

    categories.forEach(({ element, count }) => {
      element.textContent = String(count);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateCounts();

    // Quarto listings may finish rendering just after DOMContentLoaded.
    window.setTimeout(updateCounts, 150);
    window.setTimeout(updateCounts, 500);
  });
})();
