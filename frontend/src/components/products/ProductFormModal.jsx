import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const emptyProduct = {
  name: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  image: "",
  status: "Active"
};

const ProductFormModal = ({ open, mode = "create", product, submitting, error, onClose, onSubmit }) => {
  const [form, setForm] = useState(emptyProduct);

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm(
      product
        ? {
            name: product.name || "",
            description: product.description || "",
            category: product.category || "",
            price: String(product.price ?? ""),
            stock: String(product.stock ?? ""),
            image: product.image || "",
            status: product.status || "Active"
          }
        : emptyProduct
    );
  }, [open, product]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image.trim()
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm" aria-label="Close product form" onClick={onClose} />
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">{mode === "edit" ? "Edit product" : "New product"}</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{mode === "edit" ? "Update catalog item" : "Add catalog item"}</h3>
              </div>
              <button type="button" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300">
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            Name
            <input
              required
              minLength={2}
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-slate-950 outline-none transition focus:border-cyan-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </label>

          <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            Category
            <input
              required
              minLength={2}
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-slate-950 outline-none transition focus:border-cyan-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </label>

          <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            Price
            <input
              required
              min={0}
              step="0.01"
              type="number"
              value={form.price}
              onChange={(event) => updateField("price", event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-slate-950 outline-none transition focus:border-cyan-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </label>

          <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            Stock
            <input
              required
              min={0}
              step="1"
              type="number"
              value={form.stock}
              onChange={(event) => updateField("stock", event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-slate-950 outline-none transition focus:border-cyan-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </label>

          <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            Status
            <select
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-slate-950 outline-none transition focus:border-cyan-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            >
              <option>Active</option>
              <option>Draft</option>
              <option>Archived</option>
              <option>Out of stock</option>
            </select>
          </label>

          <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            Image URL
            <input
              type="url"
              value={form.image}
              onChange={(event) => updateField("image", event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-slate-950 outline-none transition focus:border-cyan-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              placeholder="https://example.com/product.jpg"
            />
          </label>

          <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-300 sm:col-span-2">
            Description
            <textarea
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-950 outline-none transition focus:border-cyan-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </label>
        </div>

            {error && <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200">{error}</p>}

            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="h-10 rounded-lg bg-cyan-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70">
                {submitting ? "Saving..." : mode === "edit" ? "Save changes" : "Create product"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductFormModal;
