import { AnimatePresence, motion } from "framer-motion";
import { Plus, RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { createProduct, deleteProduct, getProducts, updateProduct } from "../api/commerceApi.js";
import EmptyState from "../components/common/EmptyState.jsx";
import PageHeader from "../components/common/PageHeader.jsx";
import DashboardCard from "../components/dashboard/DashboardCard.jsx";
import ProductFormModal from "../components/products/ProductFormModal.jsx";
import ProductTable from "../components/products/ProductTable.jsx";

const getErrorMessage = (error, fallback) => {
  return error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || fallback;
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [modal, setModal] = useState({ open: false, mode: "create", product: null });

  const categories = useMemo(() => {
    return [...new Set(products.map((product) => product.category).filter(Boolean))].sort();
  }, [products]);

  const totals = useMemo(() => {
    return products.reduce(
      (summary, product) => {
        summary.stock += Number(product.stock || 0);
        summary.value += Number(product.price || 0) * Number(product.stock || 0);
        summary.active += product.status === "Active" ? 1 : 0;
        return summary;
      },
      { stock: 0, value: 0, active: 0 }
    );
  }, [products]);

  const loadProducts = async (nextFilters = {}) => {
    setLoading(true);
    setError("");

    try {
      const selectedSearch = nextFilters.search ?? search;
      const selectedStatus = nextFilters.status ?? status;
      const selectedCategory = nextFilters.category ?? category;
      const data = await getProducts({
        search: selectedSearch || undefined,
        status: selectedStatus || undefined,
        category: selectedCategory || undefined
      });
      setProducts(data);
    } catch (requestError) {
      setProducts([]);
      setError(getErrorMessage(requestError, "Products could not be loaded. Check your session, database connection, and backend server."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadProducts();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [search, status, category]);

  const openCreate = () => {
    setFormError("");
    setModal({ open: true, mode: "create", product: null });
  };

  const openEdit = (product) => {
    setFormError("");
    setModal({ open: true, mode: "edit", product });
  };

  const closeModal = () => {
    if (!submitting) {
      setModal({ open: false, mode: "create", product: null });
      setFormError("");
    }
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setFormError("");

    try {
      const savedProduct =
        modal.mode === "edit" && modal.product
          ? await updateProduct(modal.product.id, payload)
          : await createProduct(payload);

      setProducts((current) => {
        if (modal.mode === "edit") {
          return current.map((product) => (product.id === savedProduct.id ? savedProduct : product));
        }

        return [savedProduct, ...current];
      });
      closeModal();
    } catch (requestError) {
      setFormError(getErrorMessage(requestError, "Product could not be saved. Check the fields and try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Delete ${product.name}? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    setDeletingId(product.id);
    setError("");

    try {
      await deleteProduct(product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Product could not be deleted. Try again."));
    } finally {
      setDeletingId("");
    }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Phase 4"
        title="Product Management"
        description="Create, edit, filter, and maintain the catalog that powers your storefront operations."
        action={
          <button type="button" onClick={openCreate} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
            <Plus size={17} />
            Add product
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard label="Catalog Items" value={products.length.toLocaleString()} tone="text-cyan-300" />
        <DashboardCard label="Inventory Units" value={totals.stock.toLocaleString()} tone="text-emerald-300" />
        <DashboardCard label="Inventory Value" value={`$${Math.round(totals.value).toLocaleString()}`} tone="text-rose-300" />
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 shadow-soft">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
          <label className="flex h-11 items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 text-slate-400">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              placeholder="Search name, category, or description"
            />
          </label>

          <label className="flex h-11 items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 text-slate-400">
            <SlidersHorizontal size={16} />
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none">
              <option value="">All status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
              <option value="Out of stock">Out of stock</option>
            </select>
          </label>

          <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 rounded-lg border border-slate-800 bg-slate-950 px-3 text-sm text-white outline-none">
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button type="button" onClick={() => loadProducts()} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {error && <p className="rounded-lg border border-rose-900 bg-rose-950/60 px-4 py-3 text-sm text-rose-200">{error}</p>}

      <AnimatePresence mode="wait">
        {!loading && products.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyState title="No products found" description="Add a product or adjust your filters to see catalog items here." action={<button type="button" onClick={openCreate} className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">Add product</button>} />
          </motion.div>
        ) : (
          <motion.div key="table" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <ProductTable products={products} loading={loading} onEdit={openEdit} onDelete={handleDelete} deletingId={deletingId} />
          </motion.div>
        )}
      </AnimatePresence>

      <ProductFormModal
        open={modal.open}
        mode={modal.mode}
        product={modal.product}
        submitting={submitting}
        error={formError}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

export default ProductsPage;
