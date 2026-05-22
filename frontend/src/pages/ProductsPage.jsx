import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

import { createProduct, getProducts } from "../api/commerceApi.js";
import StatusBadge from "../components/ui/StatusBadge.jsx";

const emptyProduct = {
  name: "",
  sku: "",
  category: "",
  price: "",
  stock: "",
  reorderPoint: "10"
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts().catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const product = await createProduct(form);
    setProducts((current) => [product, ...current]);
    setForm(emptyProduct);
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">Products</h2>
          <p className="mt-1 text-sm text-slate-600">Create products and monitor catalog performance.</p>
        </div>
        <button
          type="button"
          onClick={loadProducts}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-6">
        {[
          ["name", "Product name"],
          ["sku", "SKU"],
          ["category", "Category"],
          ["price", "Price"],
          ["stock", "Stock"],
          ["reorderPoint", "Reorder"]
        ].map(([key, label]) => (
          <label key={key} className="space-y-1 text-xs font-medium text-slate-500">
            {label}
            <input
              required
              value={form[key]}
              onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-ink outline-none focus:border-mint"
              type={["price", "stock", "reorderPoint"].includes(key) ? "number" : "text"}
            />
          </label>
        ))}
        <button type="submit" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ink px-3 text-sm font-medium text-white md:col-start-6">
          <Plus size={16} />
          Add
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Sales</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td className="px-4 py-5 text-slate-500" colSpan="6">Loading products...</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.sku}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{product.category}</td>
                  <td className="px-4 py-3 font-medium">${product.price}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={product.status === "Active" ? "success" : "warning"}>{product.status}</StatusBadge>
                  </td>
                  <td className="px-4 py-3">{product.sales}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ProductsPage;
