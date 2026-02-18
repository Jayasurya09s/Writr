import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">404</p>
      <h1 className="mt-4 text-3xl font-serif font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-ink-muted max-w-sm">
        The page you are looking for does not exist. Let us get you back to your drafts.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-4 py-2 rounded-lg bg-ink text-paper text-sm font-semibold"
      >
        Return home
      </button>
    </div>
  );
}
