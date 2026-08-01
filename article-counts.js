function updateArticleCounts() {
  const articleCards = Array.from(
    document.querySelectorAll(".quarto-grid-item")
  );

  if (articleCards.length === 0) {
    return false;
  }

  const categoryCounts = {};

  articleCards.forEach((card) => {
    const categories = card.querySelectorAll(".listing-category");

    categories.forEach((category) => {
      const categoryName = category.textContent.trim();

      if (categoryName) {
        categoryCounts[categoryName] =
          (categoryCounts[categoryName] || 0) + 1;
      }
    });
  });

  const totalElement = document.getElementById("article-total-count");

  if (totalElement) {
    totalElement.textContent = String(articleCards.length);
  }

  document
    .querySelectorAll("[data-category-count]")
    .forEach((element) => {
      const categoryName = element.dataset.categoryCount;

      element.textContent = String(
        categoryCounts[categoryName] || 0
      );
    });

  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  if (updateArticleCounts()) {
    return;
  }

  let attempts = 0;

  const interval = window.setInterval(() => {
    attempts += 1;

    if (updateArticleCounts() || attempts >= 20) {
      window.clearInterval(interval);
    }
  }, 150);
});