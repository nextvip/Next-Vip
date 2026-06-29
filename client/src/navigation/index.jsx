import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import ScrollToTop from "../utils/scroll-top";
import PreLoader from "../components/common/PreLoader";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const Home = lazy(() => import("../pages/client/Home"));
const NotFound = lazy(() => import("../pages/common/NotFound"));

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const Activate = lazy(() => import("../pages/auth/Activate"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

const DashboardLayout = lazy(() => import("../pages/dashboard/DashboardLayout"));
const DashboardOverview = lazy(() => import("../pages/dashboard/Overview"));
const VideosPage = lazy(() => import("../pages/dashboard/Videos"));
const VideoDetailPage = lazy(() => import("../pages/dashboard/VideoDetail"));
const VideoUploadPage = lazy(() => import("../pages/dashboard/Upload"));
const PublicationsPage = lazy(() => import("../pages/dashboard/Publications"));
const AutomationPage = lazy(() => import("../pages/dashboard/Automation"));
const SettingsPage = lazy(() => import("../pages/dashboard/Settings"));

import Header from "../components/client/Header";
import Footer from "../components/client/Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const isAuthRoute = ["/login", "/register", "/activate", "/forgot-password", "/reset-password"].some(
    (path) => location.pathname.startsWith(path)
  );

  return (
    <>
      {!isDashboardRoute && !isAuthRoute && <Header />}
      {children}
      {!isDashboardRoute && !isAuthRoute && <Footer />}
    </>
  );
};

export default function Navigation() {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <Suspense fallback={<PreLoader />}>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/activate" element={<Activate />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardOverview />} />
                <Route path="videos" element={<VideosPage />} />
                <Route path="videos/:id" element={<VideoDetailPage />} />
                <Route path="upload" element={<VideoUploadPage />} />
                <Route path="publications" element={<PublicationsPage />} />
                <Route path="automation" element={<AutomationPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              <Route path="/*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Suspense>
      </ScrollToTop>
    </BrowserRouter>
  );
}
