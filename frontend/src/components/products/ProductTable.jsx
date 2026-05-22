import { Edit3, Trash2 } from "lucide-react";

import StatusBadge from "../ui/StatusBadge.jsx";

const ProductTable = ({ products, loading, onEdit, onDelete, deletingId }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/80 shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-950/70 text-left text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td className="px-4 py-5 text-slate-400" colSpan="6">
                  Loading products...
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="transition hover:bg-slate-800/50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-800 bg-slate-950 text-xs font-semibold text-cyan-300">
                        {product.image ? <img src={product.image} alt="" className="h-full w-full object-cover" /> : product.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">{product.name}</p>
                        <p className="line-clamp-1 text-xs text-slate-400">{product.description || "No description"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-300">{product.category}</td>
                  <td className="px-4 py-4 font-medium text-white">${Number(product.price).toLocaleString()}</td>
                  <td className="px-4 py-4 text-slate-300">{product.stock}</td>
                  <td className="px-4 py-4">
                    <StatusBadge tone={product.status === "Active" ? "success" : product.status === "Archived" ? "muted" : "warning"}>{product.status}</StatusBadge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        disabled={deletingId === product.id}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-200 transition hover:border-rose-400 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
