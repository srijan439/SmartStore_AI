const currency = (value) => `$${Math.round(Number(value || 0)).toLocaleString("en-US")}`;

const createInsight = ({ id, type, title, priority = "Medium", impact = "Medium", action, reasoning, metric, productIds = [], products = [] }) => ({
  id,
  type,
  title,
  priority,
  impact,
  action,
  reasoning,
  metric,
  productIds,
  products
});

export const buildRecommendationCandidates = (metrics) => {
  const products = metrics.products || [];
  const categories = metrics.categoryPerformance || [];
  const lowStock = metrics.inventory?.lowStockProducts || [];
  const outOfStock = metrics.inventory?.outOfStockProducts || [];
  const overstocked = metrics.inventory?.overstockedProducts || [];
  const underperforming = metrics.productPerformance?.underperforming || [];
  const highPerforming = metrics.productPerformance?.highPerforming || [];
  const priceOutliers = metrics.pricing?.outliers || [];
  const recommendations = [];

  if (outOfStock.length > 0 || lowStock.length > 0) {
    const productsToRestock = [...outOfStock, ...lowStock].slice(0, 5);
    recommendations.push(createInsight({
      id: "inventory-restock",
      type: "Inventory",
      title: "Prioritize replenishment for constrained products",
      priority: outOfStock.length > 0 ? "High" : "Medium",
      impact: "Protects catalog availability and reduces missed demand risk.",
      action: `Review reorder quantities for ${productsToRestock.map((product) => product.name).join(", ")}.`,
      reasoning: `${outOfStock.length} products are out of stock and ${lowStock.length} products are at or below the low-stock threshold.`,
      metric: `${outOfStock.length + lowStock.length} constrained products`,
      productIds: productsToRestock.map((product) => product.id),
      products: productsToRestock.map((product) => product.name)
    }));
  }

  if (priceOutliers.length > 0) {
    const reviewed = priceOutliers.slice(0, 5);
    recommendations.push(createInsight({
      id: "pricing-review",
      type: "Pricing",
      title: "Review product prices against category averages",
      priority: "Medium",
      impact: "Improves price consistency without assuming margin or conversion data.",
      action: "Validate whether each outlier has a clear positioning reason before changing the price.",
      reasoning: "These products sit materially above or below their category average price.",
      metric: `${reviewed.length} pricing outliers`,
      productIds: reviewed.map((product) => product.id),
      products: reviewed.map((product) => product.name)
    }));
  }

  if (underperforming.length > 0) {
    const reviewed = underperforming.slice(0, 5);
    recommendations.push(createInsight({
      id: "product-underperformance",
      type: "Product",
      title: "Improve underperforming product listings",
      priority: "Medium",
      impact: "Helps clean up weak catalog entries before paid promotion.",
      action: "Refresh descriptions, images, statuses, and category placement for the flagged products.",
      reasoning: "Products were flagged by inactive status, stock constraints, or low inventory value compared with catalog averages.",
      metric: `${reviewed.length} products flagged`,
      productIds: reviewed.map((product) => product.id),
      products: reviewed.map((product) => product.name)
    }));
  }

  if (highPerforming.length > 0) {
    const leaders = highPerforming.slice(0, 4);
    recommendations.push(createInsight({
      id: "high-performing-products",
      type: "Sales",
      title: "Use strong products as merchandising anchors",
      priority: "High",
      impact: "Focuses merchandising around products with the strongest inventory-value signal.",
      action: `Feature ${leaders.map((product) => product.name).join(", ")} in collections, bundles, and admin campaigns.`,
      reasoning: "These products lead the catalog by inventory value while remaining active or available.",
      metric: `${currency(leaders.reduce((sum, product) => sum + product.inventoryValue, 0))} combined inventory value`,
      productIds: leaders.map((product) => product.id),
      products: leaders.map((product) => product.name)
    }));
  }

  if (categories.length > 0) {
    const topCategory = categories[0];
    recommendations.push(createInsight({
      id: "category-growth",
      type: "Growth",
      title: `Expand the ${topCategory.category} category playbook`,
      priority: "Medium",
      impact: "Turns the strongest category signal into repeatable catalog planning.",
      action: "Audit adjacent products, bundles, and landing-page placement for this category.",
      reasoning: `${topCategory.category} currently leads category inventory value in the available analytics.`,
      metric: `${currency(topCategory.revenue)} category inventory value`,
      products: []
    }));
  }

  if (overstocked.length > 0) {
    const reviewed = overstocked.slice(0, 4);
    recommendations.push(createInsight({
      id: "overstocked-inventory",
      type: "Revenue",
      title: "Convert excess inventory into revenue opportunities",
      priority: "Medium",
      impact: "Reduces capital tied up in slow-moving stock signals.",
      action: "Consider bundles, homepage placement, or targeted campaigns for overstocked products.",
      reasoning: "These products have stock above the catalog overstock threshold.",
      metric: `${reviewed.reduce((sum, product) => sum + product.stock, 0)} units in focus`,
      productIds: reviewed.map((product) => product.id),
      products: reviewed.map((product) => product.name)
    }));
  }

  if (products.length > 0) {
    recommendations.push(createInsight({
      id: "customer-engagement",
      type: "Customer",
      title: "Improve customer-facing engagement around active catalog strengths",
      priority: "Low",
      impact: "Makes product pages and campaigns clearer without inventing customer data.",
      action: "Create concise benefit-led copy for active products with healthy stock and consistent pricing.",
      reasoning: "The catalog has enough product, category, and inventory signals to support better merchandising copy.",
      metric: `${metrics.summary.activeProducts} active products`,
      products: highPerforming.slice(0, 3).map((product) => product.name)
    }));
  }

  if (categories.length > 1) {
    recommendations.push(createInsight({
      id: "seasonal-trend-planning",
      type: "Trend",
      title: "Plan seasonal tests from category concentration",
      priority: "Low",
      impact: "Creates trend experiments without claiming unsupported seasonal demand.",
      action: "Build calendar-based campaigns for the top categories and compare stock movement after each campaign.",
      reasoning: "Seasonal recommendations are planning suggestions only because no historical seasonal sales collection exists.",
      metric: `${categories.length} tracked categories`,
      products: []
    }));
  }

  return recommendations.slice(0, 10);
};
