import { BadgeDollarSign } from "lucide-react";

const PricingRecommendation = ({ pricing }) => {
  const outliers = pricing?.outliers || [];

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/75 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-200">
          <BadgeDollarSign size={19} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Pricing Recommendations</h3>
          <p className="text-sm text-slate-500">Category-relative price review</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {outliers.length === 0 ? (
          <p className="rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-400">No material pricing outliers found.</p>
        ) : (
          outliers.slice(0, 5).map((product) => (
            <div key={product.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-white">{product.name}</p>
                <span className={product.variancePercent > 0 ? "text-sm font-semibold text-amber-200" : "text-sm font-semibold text-cyan-200"}>
                  {product.variancePercent > 0 ? "+" : ""}
                  {product.variancePercent}%
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                ${product.price} vs ${product.categoryAverage} category average
              </p>
              <p className="mt-2 text-sm text-slate-500">{product.suggestion}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default PricingRecommendation;
