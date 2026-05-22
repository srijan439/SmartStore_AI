import { useEffect, useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";

import { askAssistant, getAssistantInsights } from "../api/commerceApi.js";
import StatusBadge from "../components/ui/StatusBadge.jsx";

const AssistantPage = () => {
  const [insights, setInsights] = useState([]);
  const [prompt, setPrompt] = useState("What should I focus on today?");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    getAssistantInsights().then(setInsights).catch(() => setInsights([]));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await askAssistant(prompt);
    setAnswer(data.answer);
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">AI Assistant</h2>
        <p className="mt-1 text-sm text-slate-600">Operational recommendations generated from catalog, sales, and inventory signals.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {insights.map((insight) => (
          <article key={insight.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <Sparkles size={20} className="text-mint" />
              <StatusBadge tone={insight.impact === "High" ? "warning" : "success"}>{insight.impact}</StatusBadge>
            </div>
            <h3 className="mt-4 font-semibold">{insight.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{insight.detail}</p>
          </article>
        ))}
      </div>

      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-white">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-semibold">Ask SmartStore AI</h3>
            <p className="text-sm text-slate-500">Get a concise operating recommendation.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="h-11 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-mint"
          />
          <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-medium text-white">
            <Send size={16} />
            Ask
          </button>
        </form>

        {answer && <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">{answer}</p>}
      </article>
    </section>
  );
};

export default AssistantPage;
