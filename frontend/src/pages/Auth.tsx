import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { register, login, isAuthenticated } from "@/lib/auth";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

export default function Auth() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<Mode>(
    (params.get("mode") as Mode) || "login"
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) navigate("/editor", { replace: true });
  }, [navigate]);

  const helperText = useMemo(
    () =>
      mode === "login"
        ? "Welcome back. Pick up your drafts where you left off."
        : "Create a secure workspace for your drafts.",
    [mode]
  );

  const validate = () => {
    if (mode === "register" && name.trim().length < 2) {
      return "Name must be at least 2 characters.";
    }
    if (!email.includes("@")) return "Enter a valid email.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);

    const result = await (mode === "register"
      ? register(name.trim(), email.trim(), password)
      : login(email.trim(), password));

    setLoading(false);

    if (!result.success) {
      setError(result.error || "Something went wrong.");
      return;
    }
    navigate("/editor");
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center px-6">
      <div className="w-full max-w-4xl grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden md:flex flex-col justify-between rounded-3xl border border-ink/10 bg-card p-8 shadow-paper">
          <div>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-xs font-semibold text-ink-muted hover:text-ink transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to home
            </button>
            <h1 className="mt-8 text-3xl font-serif font-semibold">
              Your editor stays focused on writing.
            </h1>
            <p className="mt-3 text-sm text-ink-muted">
              Drafts are private, auto-saved, and ready for AI enhancements when you need them.
            </p>
          </div>
          <div className="text-xs text-ink-muted">
            Secure JWT sessions · Built for the SyncDraft assignment
          </div>
        </div>

        <div className="rounded-3xl border border-ink/10 bg-paper shadow-paper p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                {mode === "login" ? "Welcome" : "Get started"}
              </p>
              <h2 className="text-2xl font-serif font-semibold mt-2">
                {mode === "login" ? "Sign in" : "Create account"}
              </h2>
            </div>
            <div className="flex rounded-full border border-ink/10 bg-paper p-1">
              {(["login", "register"] as Mode[]).map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setMode(item);
                    setError("");
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold transition",
                    mode === item
                      ? "bg-ink text-paper"
                      : "text-ink-muted hover:text-ink"
                  )}
                >
                  {item === "login" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-ink-muted mb-6">{helperText}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Jane Writer"
                  className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-paper text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@syncdraft.ai"
                className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-paper text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-ink/10 bg-paper text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-ink text-paper text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Working..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-5 text-xs text-ink-muted">
            {mode === "login" ? "No account yet?" : "Already have an account?"} {" "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="font-semibold text-ink hover:underline"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
