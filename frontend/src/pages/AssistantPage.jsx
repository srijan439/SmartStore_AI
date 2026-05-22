import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { generateAIContent } from "../api/aiApi.js";
import AIGeneratorForm from "../components/ai/AIGeneratorForm.jsx";
import AIResultCard from "../components/ai/AIResultCard.jsx";
import GenerateButton from "../components/ai/GenerateButton.jsx";
import PromptPreview from "../components/ai/PromptPreview.jsx";
import PageHeader from "../components/common/PageHeader.jsx";

const contentTypes = [
  ["description", "Description"],
  ["seoTags", "SEO Tags"],
  ["caption", "Caption"],
  ["highlights", "Highlights"],
  ["summary", "Summary"]
];

const resultTitles = {
  description: "Product Description",
  seoTags: "SEO Tags",
  caption: "Marketing Caption",
  highlights: "Product Highlights",
  summary: "Product Summary"
};

const initialForm = {
  name: "AeroFlex Running Shoes",
  category: "Footwear",
  features: "lightweight mesh, cushioned sole, reflective accents",
  price: "$129",
  targetAudience: "urban runners",
  tone: "Professional"
};

const getErrorMessage = (error) => {
  if (error.code === "ECONNABORTED") {
    return "AI generation timed out. Try again in a moment or generate one content type at a time.";
  }

  if (!error.response) {
    return "AI service is not reachable. Make sure the backend server is running.";
  }

  return error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || "AI content could not be generated. Try again.";
};

const AssistantPage = () => {
  const [form, setForm] = useState(initialForm);
  const [results, setResults] = useState({});
  const [loadingType, setLoadingType] = useState("");
  const [error, setError] = useState("");

  const payload = useMemo(() => {
    return {
      name: form.name.trim(),
      category: form.category.trim(),
      features: form.features
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean),
      price: form.price.trim(),
      targetAudience: form.targetAudience.trim(),
      tone: form.tone
    };
  }, [form]);

  const canGenerate = payload.name.length >= 2 && payload.category.length >= 2 && payload.features.length > 0 && payload.targetAudience.length >= 2;

  const handleGenerate = async (type) => {
    if (!canGenerate) {
      setError("Add a product name, category, at least one feature, and target audience before generating.");
      return;
    }

    setLoadingType(type);
    setError("");

    try {
      const data = await generateAIContent(type, payload);
      setResults((current) => ({ ...current, [type]: data }));
      return true;
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      return false;
    } finally {
      setLoadingType("");
    }
  };

  const handleGenerateAll = async () => {
    if (!canGenerate) {
      setError("Add a product name, category, at least one feature, and target audience before generating.");
      return;
    }

    for (const [type] of contentTypes) {
      const generated = await handleGenerate(type);

      if (!generated) {
        break;
      }
    }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Phase 5"
        title="AI Content Generation"
        description="Generate concise product descriptions, SEO tags, captions, highlights, and summaries from verified product inputs."
        action={
          <GenerateButton loading={Boolean(loadingType)} active onClick={handleGenerateAll}>
            Generate all
          </GenerateButton>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <AIGeneratorForm form={form} onChange={setForm} />
        <PromptPreview form={form} />
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 shadow-soft">
        <div className="flex flex-wrap gap-3">
          {contentTypes.map(([type, label]) => (
            <GenerateButton key={type} loading={loadingType === type} active={loadingType === type} onClick={() => handleGenerate(type)}>
              {label}
            </GenerateButton>
          ))}
        </div>
      </div>

      {error && <p className="rounded-lg border border-rose-900 bg-rose-950/60 px-4 py-3 text-sm text-rose-200">{error}</p>}

      <motion.div className="grid gap-4 lg:grid-cols-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {contentTypes.map(([type]) => (
          <AIResultCard key={type} title={resultTitles[type]} result={results[type]} />
        ))}
      </motion.div>
    </section>
  );
};

export default AssistantPage;
