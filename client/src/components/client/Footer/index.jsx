import { Link, useNavigate, useLocation } from "react-router-dom";
import BrandLogo from "../../common/BrandLogo";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const year = new Date().getFullYear();
  const tagline =
    import.meta.env.VITE_REACT_APP_PROJECT_TAGLINE ||
    "Automate your content from upload to monetization.";

  const scrollTo = (e, id) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  };

  const productLinks = [
    { label: "Features", id: "features" },
    { label: "How it works", id: "how-it-works" },
    { label: "Pricing", id: "pricing" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-4">
            <BrandLogo size="default" variant="light" />
            <p className="text-sm leading-relaxed max-w-sm text-slate-500">{tagline}</p>
            <p className="text-xs text-slate-600">
              AI-powered SaaS for creators, affiliates, and businesses — TikTok, Instagram,
              Facebook & YouTube.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              {productLinks.map(({ label, id }) => (
                <li key={label}>
                  <a
                    href={`/#${id}`}
                    onClick={(e) => scrollTo(e, id)}
                    className="hover:text-violet-400 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/login" className="hover:text-violet-400 transition-colors">
                  Log in
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Account</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/register" className="hover:text-violet-400 transition-colors">
                  Sign up free
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-violet-400 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-600">
          <p>© {year} NextVIP. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
