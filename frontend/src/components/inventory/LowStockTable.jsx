import { PackageCheck } from "lucide-react";

import StockBadge from "./StockBadge.jsx";

const LowStockTable = ({ products = [], title = "Low Stock Products" }) => {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/75 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/15 text-amber-200">
          <PackageCheck size={19} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="text-sm text-slate-500">Products needing availability attention</p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="pb-3 font-semibold">Product</th>
              <th className="pb-3 font-semibold">Category</th>
              <th className="pb-3 font-semibold">Stock</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Suggested</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-5 text-slate-400">No products match this inventory view.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="text-slate-300">
                  <td className="py-3 pr-4 font-medium text-white">{product.name}</td>
                  <td className="py-3 pr-4">{product.category}</td>
                  <td className="py-3 pr-4">{product.stock}</td>
                  <td className="py-3 pr-4"><StockBadge status={product.inventoryStatus} /></td>
                  <td className="py-3 pr-4">{product.suggestedRestockUnits || 0} units</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LowStockTable;
