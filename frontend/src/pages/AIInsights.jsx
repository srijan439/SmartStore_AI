import { motion } from "framer-motion";
import { AlertTriangle, BarChart3, BrainCircuit, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getAIInsights } from "../api/commerceApi.js";
import AIInsightSummary from "../components/ai-insights/AIInsightSummary.jsx";
import InsightCard from "../components/ai-insights/InsightCard.jsx";
import InventoryInsights from "../components/ai-insights/InventoryInsights.jsx";
import PricingRecommendation from "../components/ai-insights/PricingRecommendation.jsx";
import RevenueInsights from "../components/ai-insights/RevenueInsights.jsx";
import TrendInsights from "../components/ai-insights/TrendInsights.jsx";
import PageHeader from "../components/common/PageHeader.jsx";

const formatError = (error) => {
  if (error.code === "ECONNABORTED") {
    return "AI insights timed out. Try refreshing again in a moment.";
  }

  return error.response?.data?.message || "AI business insights could not be loaded.";
};

const loadingCards = Array.from({ length: 4 }, (_, index) => index);

const AIInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInsights = async () => {
    setLoading(true);
    setError("");

    try {
      const insights = await getAIInsights();
      setData(insights);
    } catch (requestError) {
      setError(formatError(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  const aiRecommendations = useMemo(() => data?.ai?.recommendations || [], [data]);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Phase 7"
        title="AI Business Intelligence"
        description="Pricing, inventory, trend, product, customer engagement, and revenue recommendations from live store signals."
      />

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-rose-900 bg-rose-950/60 px-4 py-3 text-sm text-rose-100">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading && !data ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {loadingCards.map((item) => (
            <div key={item} className="h-56 animate-pulse rounded-lg border border-slate-800 bg-slate-900/80" />
          ))}
        </div>
      ) : (
        data && (
          <motion.div className="space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <AIInsightSummary data={data} loading={loading} onRefresh={loadInsights} />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Products", data.metrics.summary.totalProducts, BrainCircuit],
                ["Inventory Value", `$${data.metrics.summary.inventoryValue.toLocaleString("en-US")}`, BarChart3],
                ["AI Recommendations", aiRecommendations.length, Sparkles],
                ["Restock Alerts", (data.metrics.inventory.lowStockProducts.length + data.metrics.inventory.outOfStockProducts.length), AlertTriangle]
              ].map(([label, value, Icon]) => (
                <div key={label} className="rounded-lg border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-400">{label}</p>
                    <Icon size={18} className="text-cyan-300" />
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <PricingRecommendation pricing={data.metrics.pricing} />
              <InventoryInsights inventory={data.metrics.inventory} />
              <TrendInsights categories={data.metrics.categoryPerformance} ai={data.ai} />
              <RevenueInsights summary={data.metrics.summary} ai={data.ai} />
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">Recommendation Cards</h3>
                  <p className="mt-1 text-sm text-slate-500">AI interpretation plus deterministic business signals.</p>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {(data.recommendations || []).map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </div>
          </motion.div>
        )
      )}
    </section>
  );
};

export default AIInsights;
