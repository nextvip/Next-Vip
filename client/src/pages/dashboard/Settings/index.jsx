import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, Crown, Loader2, Shield, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMe, updateProfile, updatePassword } from "../../../services/authServices";
import { getPlans } from "../../../services/subscriptionServices";
import { setUser, getUser } from "../../../store/auth/authSlice";

export default function SettingsPage() {
  const { userData, token } = useSelector(getUser);
  const dispatch = useDispatch();
  const [name, setName] = useState(userData?.name || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [plan, setPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, plansRes] = await Promise.all([getMe(), getPlans()]);
        setPlan(meRes.data.plan);
        setPlans(plansRes.data.plans || []);
        if (meRes.data.user?.name) setName(meRes.data.user.name);
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setProfileLoading(true);
    try {
      const { data } = await updateProfile({ name });
      dispatch(setUser({ user: data.user, token, tokenExpire: null }));
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setPasswordLoading(true);
    try {
      await updatePassword({ oldPassword, newPassword });
      setMessage("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Password update failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  const initials = (name || userData?.email || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isPasswordValid = oldPassword.length > 0 && newPassword.length > 0;

  return (
    <div className="w-full space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your profile, security, and subscription plan.
        </p>
      </div>

      {message && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm px-4 py-3 max-w-3xl">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 max-w-3xl">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white">
                {initials}
              </div>
              <div>
                <CardTitle className="text-lg">Profile</CardTitle>
                <CardDescription className="truncate max-w-[240px] sm:max-w-none">
                  {userData?.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="max-w-md"
                />
              </div>
              <Button
                type="submit"
                className="bg-violet-600 hover:bg-violet-500"
                disabled={profileLoading || !name.trim()}
              >
                {profileLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <User className="h-4 w-4 mr-2" />
                )}
                Save profile
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
                <Shield className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">Current password</Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="bg-violet-600 hover:bg-violet-500"
                disabled={passwordLoading || !isPasswordValid}
              >
                {passwordLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Shield className="h-4 w-4 mr-2" />
                )}
                Update password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
                <Crown className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Subscription</CardTitle>
                <CardDescription>
                  Current plan:{" "}
                  <Badge className="ml-1 bg-violet-600 hover:bg-violet-600">
                    {plan?.name || "Free"}
                  </Badge>
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((p) => {
              const isCurrent = plan?.slug === p.slug;
              const isPopular = p.slug === "pro";
              return (
                <div
                  key={p._id || p.id}
                  className={`relative rounded-xl border p-5 flex flex-col transition-all ${
                    isCurrent
                      ? "border-violet-500 bg-violet-50/50 ring-1 ring-violet-500 shadow-md shadow-violet-500/10"
                      : "border-slate-200 bg-white hover:border-violet-200 hover:shadow-sm"
                  }`}
                >
                  {isPopular && !isCurrent && (
                    <Badge className="absolute -top-2.5 right-4 bg-violet-600 text-[10px]">
                      Popular
                    </Badge>
                  )}
                  {isCurrent && (
                    <Badge className="absolute -top-2.5 right-4 bg-emerald-600 text-[10px]">
                      Current
                    </Badge>
                  )}
                  <p className="font-bold text-lg">{p.name}</p>
                  <p className="text-sm text-muted-foreground mt-1 min-h-[40px]">{p.description}</p>
                  <p className="text-2xl font-bold mt-3">
                    ${p.price_monthly}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                  <ul className="text-sm text-muted-foreground mt-4 space-y-2 flex-1">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-violet-600 shrink-0" />
                      {p.max_videos || "∞"} videos
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-violet-600 shrink-0" />
                      {p.max_automations || "∞"} automations
                    </li>
                  </ul>
                  <Button
                    type="button"
                    variant={isCurrent ? "secondary" : "outline"}
                    className={`mt-5 w-full ${!isCurrent && "border-violet-200 text-violet-700 hover:bg-violet-50"}`}
                    disabled={isCurrent}
                  >
                    {isCurrent ? "Active plan" : "Upgrade"}
                  </Button>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Stripe checkout will be available in Milestone 5.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
