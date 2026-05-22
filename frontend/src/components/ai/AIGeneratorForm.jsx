const tones = ["Professional", "Friendly", "Luxury", "Playful", "Minimal", "Bold"];

const AIGeneratorForm = ({ form, onChange }) => {
  const updateField = (field, value) => {
    onChange({ ...form, [field]: value });
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-soft">
      <div>
        <h3 className="text-base font-semibold text-white">Product Input</h3>
        <p className="mt-1 text-sm text-slate-400">Give the AI only verified product details to avoid unsupported claims.</p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-slate-300">
          Product name
          <input
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="h-11 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 text-white outline-none transition focus:border-cyan-400"
            placeholder="AeroFlex Running Shoes"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-300">
          Category
          <input
            required
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="h-11 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 text-white outline-none transition focus:border-cyan-400"
            placeholder="Footwear"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-300 md:col-span-2">
          Features
          <textarea
            required
            value={form.features}
            onChange={(event) => updateField("features", event.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-cyan-400"
            placeholder="lightweight mesh, cushioned sole, reflective accents"
          />
          <span className="text-xs text-slate-500">Separate features with commas.</span>
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-300">
          Price
          <input
            value={form.price}
            onChange={(event) => updateField("price", event.target.value)}
            className="h-11 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 text-white outline-none transition focus:border-cyan-400"
            placeholder="$129"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-300">
          Target audience
          <input
            required
            value={form.targetAudience}
            onChange={(event) => updateField("targetAudience", event.target.value)}
            className="h-11 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 text-white outline-none transition focus:border-cyan-400"
            placeholder="urban runners"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-300">
          Tone
          <select
            value={form.tone}
            onChange={(event) => updateField("tone", event.target.value)}
            className="h-11 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 text-white outline-none transition focus:border-cyan-400"
          >
            {tones.map((tone) => (
              <option key={tone}>{tone}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default AIGeneratorForm;
