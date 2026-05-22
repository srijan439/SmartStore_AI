const formatCurrency = (value) => `$${Number(value || 0).toLocaleString()}`;

const TopProducts = ({ products = [] }) => {
  const maxRevenue = Math.max(...products.map((product) => product.revenue || 0), 1);

  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Top Products</h3>
        <span className="text-xs text-slate-500">By revenue value</span>
      </div>

      <div className="mt-5 space-y-4">
        {products.length === 0 ? (
          <p className="text-sm text-slate-500">No product performance data yet.</p>
        ) : (
          products.map((product) => (
            <div key={product.id}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{product.name}</p>
                  <p className="text-xs text-slate-500">{product.category} · {product.stock} units</p>
                </div>
                <span className="font-semibold text-cyan-300">{formatCurrency(product.revenue)}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-950">
                <div className="h-full rounded-full bg-cyan-400" style={{ width: `${Math.max((product.revenue / maxRevenue) * 100, 6)}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
};

export default TopProducts;
