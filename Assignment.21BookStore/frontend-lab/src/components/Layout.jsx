import { NavLink, Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Layout() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();

  return (
    <>
      <header className="border-b border-line bg-surface">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 p-4">
          <span className="mr-auto text-lg font-semibold">
            frontend-lab
          </span>

          <NavLink
            to="/users"
            className="text-muted hover:text-fg"
          >
            Users
          </NavLink>

          <button
            onClick={toggle}
            className="rounded border px-3 py-1"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>

          {user ? (
            <button
              onClick={logout}
              className="rounded border px-3 py-1"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="rounded border px-3 py-1"
            >
              Login
            </NavLink>
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl p-4 md:p-8">
        <Outlet />
      </main>
    </>
  );
}