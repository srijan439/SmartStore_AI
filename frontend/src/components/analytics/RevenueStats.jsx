import { BadgeDollarSign, Boxes, PackageCheck, TrendingUp } from "lucide-react";

import AnalyticsCard from "../../charts/AnalyticsCard.jsx";

const formatCurrency = (value) => `$${Number(value || 0).toLocaleString()}`;

const RevenueStats = ({ summary }) => {
  const cards = [
    {
      title: "Revenue",
      value: formatCurrency(summary.revenue),
      detail: "Inventory-backed revenue value",
      icon: BadgeDollarSign,
      accent: "from-cyan-400/20 to-cyan-400/0"
    },
    {
      title: "Products",
      value: Number(summary.products || 0).toLocaleString(),
      detail: `${Number(summary.activeProducts || 0).toLocaleString()} active products`,
      icon: PackageCheck,
      accent: "from-emerald-400/20 to-emerald-400/0"
    },
    {
      title: "Inventory Units",
      value: Number(summary.inventoryUnits || 0).toLocaleString(),
      detail: `${Number(summary.lowStockCount || 0).toLocaleString()} low-stock items`,
      icon: Boxes,
      accent: "from-amber-400/20 to-amber-400/0"
    },
    {
      title: "Avg. Order Value",
      value: formatCurrency(summary.averageOrderValue),
      detail: "Estimated from catalog activity",
      icon: TrendingUp,
      accent: "from-rose-400/20 to-rose-400/0"
    }
  ];

  return cards.map((card) => <AnalyticsCard key={card.title} {...card} />);
};

export default RevenueStats;
