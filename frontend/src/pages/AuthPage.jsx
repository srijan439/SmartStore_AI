import { useState } from "react";
import { LockKeyhole, LogIn, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "signup") {
        await auth.signup(form);
      } else {
        await auth.login({ email: form.email, password: form.password });
      }

      navigate(destination, { replace: true });
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.response?.data?.errors?.[0]?.msg ||
        "Authentication failed. Check your details and try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-50 text-ink lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden bg-ink px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-ink">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-lg font-bold">SmartStore AI</p>
            <p className="text-sm text-slate-300">Secure admin workspace</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-cyan-200">Authentication dashboard</p>
          <h1 className="mt-3 max-w-lg text-4xl font-bold leading-tight">Protect your commerce operations before the work begins.</h1>
          <div className="mt-8 grid gap-3">
            {["JWT session protection", "Password hashing with bcrypt", "Private dashboard routes"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-slate-200">
                <ShieldCheck size={18} className="text-mint" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="text-lg font-bold">SmartStore AI</p>
              <p className="text-sm text-slate-500">Secure admin workspace</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex rounded-lg bg-slate-100 p-1">
              {[
                ["login", "Sign in", LogIn],
                ["signup", "Create account", UserPlus]
              ].map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setMode(value);
                    setError("");
                  }}
                  className={[
                    "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md text-sm font-medium transition",
                    mode === value ? "bg-white text-ink shadow-sm" : "text-slate-500"
                  ].join(" ")}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold">{mode === "login" ? "Welcome back" : "Create your admin account"}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {mode === "login" ? "Sign in to access the SmartStore dashboard." : "Set up a protected dashboard user."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === "signup" && (
                <label className="block space-y-1 text-sm font-medium text-slate-600">
                  Name
                  <input
                    required
                    minLength={2}
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    className="h-11 w-full rounded-lg border border-slate-200 px-3 text-ink outline-none focus:border-mint"
                    placeholder="Store admin"
                  />
                </label>
              )}

              <label className="block space-y-1 text-sm font-medium text-slate-600">
                Email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-ink outline-none focus:border-mint"
                  placeholder="admin@smartstore.com"
                />
              </label>

              <label className="block space-y-1 text-sm font-medium text-slate-600">
                Password
                <input
                  required
                  minLength={mode === "signup" ? 8 : 1}
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-ink outline-none focus:border-mint"
                  placeholder={mode === "signup" ? "At least 8 characters" : "Enter your password"}
                />
              </label>

              {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                <LockKeyhole size={16} />
                {submitting ? "Securing session..." : mode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
