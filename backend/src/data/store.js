let products = [
  {
    id: "prd-1001",
    name: "AeroFlex Running Shoes",
    sku: "AF-RUN-42",
    category: "Footwear",
    price: 129,
    stock: 18,
    reorderPoint: 24,
    status: "Low stock",
    sales: 342
  },
  {
    id: "prd-1002",
    name: "Nimbus Travel Backpack",
    sku: "NB-BAG-18",
    category: "Bags",
    price: 89,
    stock: 72,
    reorderPoint: 28,
    status: "Active",
    sales: 226
  },
  {
    id: "prd-1003",
    name: "Pulse Smart Watch",
    sku: "PLS-WCH-9",
    category: "Electronics",
    price: 219,
    stock: 11,
    reorderPoint: 16,
    status: "Low stock",
    sales: 418
  },
  {
    id: "prd-1004",
    name: "Luma Desk Lamp",
    sku: "LUM-LMP-2",
    category: "Home",
    price: 64,
    stock: 0,
    reorderPoint: 14,
    status: "Out of stock",
    sales: 151
  },
  {
    id: "prd-1005",
    name: "Hydra Steel Bottle",
    sku: "HYD-BTL-1",
    category: "Accessories",
    price: 34,
    stock: 96,
    reorderPoint: 32,
    status: "Active",
    sales: 503
  }
];

const salesTrend = [
  { month: "Jan", revenue: 31200, orders: 412 },
  { month: "Feb", revenue: 35600, orders: 448 },
  { month: "Mar", revenue: 39100, orders: 493 },
  { month: "Apr", revenue: 42800, orders: 531 },
  { month: "May", revenue: 48200, orders: 588 },
  { month: "Jun", revenue: 51700, orders: 624 }
];

export const getProducts = () => products;

export const addProduct = (product) => {
  const stock = Number(product.stock || 0);
  const reorderPoint = Number(product.reorderPoint || 10);
  const sku = String(product.sku).trim().toUpperCase();
  const nextProduct = {
    id: `prd-${Date.now()}`,
    name: String(product.name).trim(),
    sku,
    category: String(product.category).trim(),
    price: Number(product.price || 0),
    stock,
    reorderPoint,
    status: stock === 0 ? "Out of stock" : stock <= reorderPoint ? "Low stock" : "Active",
    sales: 0
  };

  products = [nextProduct, ...products];
  return nextProduct;
};

export const getInventory = () => {
  return products
    .map((product) => ({
      ...product,
      restockUnits: Math.max(product.reorderPoint * 2 - product.stock, 0)
    }))
    .sort((a, b) => a.stock - b.stock);
};

export const getAnalytics = () => {
  const revenue = salesTrend.at(-1).revenue;
  const orders = salesTrend.at(-1).orders;
  const lowStockCount = products.filter((product) => product.stock <= product.reorderPoint).length;
  const topProducts = [...products].sort((a, b) => b.sales - a.sales).slice(0, 4);

  return {
    summary: {
      revenue,
      orders,
      averageOrderValue: Math.round(revenue / orders),
      products: products.length,
      lowStockCount
    },
    salesTrend,
    topProducts
  };
};

export const getAssistantInsights = () => {
  const inventory = getInventory();
  const urgent = inventory.filter((product) => product.stock <= product.reorderPoint);
  const topProduct = [...products].sort((a, b) => b.sales - a.sales)[0];

  return [
    {
      title: "Restock priority",
      impact: "High",
      detail: `${urgent[0]?.name || "Core inventory"} needs attention first. Reorder ${urgent[0]?.restockUnits || 20} units to restore buffer stock.`
    },
    {
      title: "Revenue momentum",
      impact: "Medium",
      detail: `${topProduct.name} is the fastest seller. Feature it in the next campaign while stock is available.`
    },
    {
      title: "Catalog cleanup",
      impact: "Medium",
      detail: "Review products with zero stock and pause paid promotion until replenishment is confirmed."
    }
  ];
};
