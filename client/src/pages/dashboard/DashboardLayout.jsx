import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Video,
  Upload,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  Bot,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { clearUser, getUser } from "../../store/auth/authSlice";
import { logoutUser } from "../../services/authServices";
import BrandLogo from "../../components/common/BrandLogo";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/videos", label: "Videos", icon: Video },
  { to: "/dashboard/upload", label: "Upload", icon: Upload },
  { to: "/dashboard/publications", label: "Publications", icon: History },
  { to: "/dashboard/automation", label: "Automation", icon: Bot },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { userData } = useSelector(getUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // clear local session even if API fails
    }
    dispatch(clearUser());
    navigate("/login");
  };

  const NavItems = ({ onNavigate }) => (
    <>
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-white z-50">
          <div className="p-6 border-b">
            <BrandLogo variant="image" size="default" to="/dashboard" />
            <p className="text-xs text-muted-foreground mt-3 truncate">
              {userData?.email}
            </p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <NavItems />
          </nav>
          <div className="p-4 border-t">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </aside>

        <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
          <header className="sticky top-0 z-40 flex items-center gap-3 border-b bg-white px-4 h-14 lg:px-8">
            <button
              type="button"
              className="lg:hidden p-2 -ml-2"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <BrandLogo
              variant="image"
              size="sm"
              to="/dashboard"
              className="lg:hidden"
            />
          </header>

          <main className="flex-1 p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <BrandLogo variant="image" size="sm" to="/dashboard" />
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <NavItems onNavigate={() => setMobileOpen(false)} />
            </nav>
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
