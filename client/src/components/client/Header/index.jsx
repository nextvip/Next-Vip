import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "../../common/BrandLogo";
import { getUser } from "../../../store/auth/authSlice";

const navLinks = [
  { label: "Features", target: "features", scroll: true },
  { label: "How it works", target: "how-it-works", scroll: true },
  { label: "Pricing", target: "pricing", scroll: true },
  { label: "FAQ", target: "faq", scroll: true },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector(getUser);

  const scrollTo = (e, target) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (location.pathname === "/") {
      const el = document.getElementById(target);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollTo: target } });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <BrandLogo size="sm" />

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(({ label, target, scroll }) =>
              scroll ? (
                <a
                  key={label}
                  href={`/#${target}`}
                  onClick={(e) => scrollTo(e, target)}
                  className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  to={target}
                  className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
                >
                  {label}
                </Link>
              )
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <Button asChild className="bg-violet-600 hover:bg-violet-500">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-slate-600">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild className="bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-600/20">
                  <Link to="/register">Sign up free</Link>
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-600"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t space-y-1">
            {navLinks.map(({ label, target, scroll }) =>
              scroll ? (
                <a
                  key={label}
                  href={`/#${target}`}
                  onClick={(e) => scrollTo(e, target)}
                  className="block px-2 py-2 text-slate-600 font-medium"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  to={target}
                  className="block px-2 py-2 text-slate-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              )
            )}
            <div className="pt-4 flex flex-col gap-2 px-2">
              {isAuthenticated ? (
                <Button asChild className="w-full bg-violet-600">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button asChild className="w-full bg-violet-600">
                    <Link to="/register">Sign up free</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
