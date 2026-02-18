import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { register, login, isAuthenticated } from "@/lib/auth";
import { PenLine, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
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
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated()) navigate("/editor", { replace: true });
  }, [navigate]);

  // Animate in on mode switch
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.35s ease, transform 0.35s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, [mode]);

  const validate = () => {
    if (mode === "register" && name.trim().length < 2)
      return "Name must be at least 2 characters.";
    if (!email.includes("@")) return "Enter a valid email.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError("");
    setLoading(true);

    // Simulate network latency
    await new Promise((r) => setTimeout(r, 700));

    const result = await (
      mode === "register"
        ? register(name.trim(), email.trim(), password)
        : login(email.trim(), password)
    );

    setLoading(false);

    if (!result.success) {
      setError(result.error || "Something went wrong.");
      return;
    }
    navigate("/editor");
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div
        className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--accent) / 0.08), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.06), transparent 70%)",
        }}
      />

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 animate-fade-in">
        <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-ai">
          <PenLine className="w-5 h-5 text-accent-foreground" />
        </div>
        <span className="font-serif text-xl font-bold text-foreground">Writr</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm animate-fade-in">
        {/* Tabs */}
        <div className="flex rounded-xl border border-border bg-muted p-1 mb-6">
          {(["login", "register"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                mode === m
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div ref={formRef}>
          <div className="rounded-2xl border border-border bg-card shadow-md p-7">
            <h1 className="font-serif text-xl font-bold text-foreground mb-1">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-xs text-muted-foreground mb-6">
              {mode === "login"
                ? "Sign in to access your drafts and editor."
                : "Join Writr and start crafting beautiful posts."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm
                      text-foreground placeholder:text-muted-foreground focus:outline-none
                      focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus={mode === "login"}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm
                    text-foreground placeholder:text-muted-foreground focus:outline-none
                    focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-input bg-background text-sm
                      text-foreground placeholder:text-muted-foreground focus:outline-none
                      focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPw ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="text-xs text-destructive bg-destructive/8 border border-destructive/20 rounded-lg px-3 py-2 animate-fade-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold
                  hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>

            {/* JWT info badge */}
            <div className="mt-5 pt-4 border-t border-border/50 flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">
                JWT
              </span>
              <span className="text-[10px] text-muted-foreground">
                Token stored securely · 7-day session
              </span>
            </div>
          </div>

          {/* Demo credentials hint */}
          <p className="text-center text-xs text-muted-foreground mt-4">
            {mode === "login" ? (
              <>
                No account?{" "}
                <button
                  onClick={() => switchMode("register")}
                  className="text-accent hover:underline font-medium"
                >
                  Sign up for free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => switchMode("login")}
                  className="text-accent hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
