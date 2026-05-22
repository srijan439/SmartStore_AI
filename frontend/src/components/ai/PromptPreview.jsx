const PromptPreview = ({ form }) => {
  const features = form.features
    .split(",")
    .map((feature) => feature.trim())
    .filter(Boolean);

  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 shadow-soft">
      <h3 className="text-sm font-semibold text-white">Prompt Input</h3>
      <dl className="mt-4 space-y-3 text-sm">
        {[
          ["Name", form.name || "Not set"],
          ["Category", form.category || "Not set"],
          ["Features", features.length ? features.join(", ") : "Not set"],
          ["Price", form.price || "Not provided"],
          ["Audience", form.targetAudience || "Not set"],
          ["Tone", form.tone]
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</dt>
            <dd className="mt-1 text-slate-300">{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
};

export default PromptPreview;
