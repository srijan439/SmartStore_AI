const styles = {
  "In Stock": "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  "Low Stock": "border-amber-500/30 bg-amber-500/10 text-amber-100",
  "Out of Stock": "border-rose-500/30 bg-rose-500/10 text-rose-200"
};

const StockBadge = ({ status }) => {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status] || styles["In Stock"]}`}>
      {status}
    </span>
  );
};

export default StockBadge;
