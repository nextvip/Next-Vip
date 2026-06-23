import { Link } from "react-router-dom";
import { Sparkles, Zap, Link2, Share2, Upload, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BrandLogo from "@/components/common/BrandLogo";
import TypewriterText from "@/components/common/TypewriterText";

const authTypeWords = ["multiplied", "automated", "repurposed", "scaled"];

const workflowSteps = [
  { icon: Upload, label: "Upload once" },
  { icon: Share2, label: "Publish everywhere" },
  { icon: Zap, label: "Automate & earn" },
];

const featureGrid = [
  { icon: Share2, title: "4 platforms", desc: "TikTok, IG, FB & YouTube" },
  { icon: Sparkles, title: "AI captions", desc: "Titles, tags & descriptions" },
  { icon: MessageCircle, title: "Smart replies", desc: "Comments → DMs with {link}" },
  { icon: Link2, title: "Affiliate links", desc: "Monetize every interaction" },
];

export default function AuthLayout({ title, description, children, footer, minimal = false }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col bg-[#030712] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(139,92,246,0.28),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_90%_70%,rgba(99,102,241,0.15),transparent)]" />
        <div className="absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="absolute top-20 -left-24 h-80 w-80 rounded-full bg-fuchsia-600/10 blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)",
          }}
        />

        <div className="relative z-20 shrink-0 p-10 xl:p-12">
          <BrandLogo size="lg" variant="light" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-10 xl:px-12 pb-12">
          <div className="max-w-[440px] w-full mx-auto space-y-9 text-center">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3.5 py-1 text-xs font-medium text-violet-200">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                AI-powered content automation
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-[2.1rem] xl:text-[2.6rem] font-bold leading-[1.15] tracking-tight">
                <span className="flex flex-nowrap items-baseline justify-center gap-x-1">
                  <span className="text-white shrink-0">Your content,</span>
                  <TypewriterText
                    words={authTypeWords}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-400"
                    cursorClassName="bg-violet-300"
                  />
                </span>
                <span className="block mt-1 text-center text-white">and monetized</span>
              </h2>
              <p className="text-slate-400 text-[15px] leading-relaxed max-w-sm mx-auto">
                One upload. Every platform. Affiliate links in every reply — built for creators
                who scale.
              </p>
            </div>

            {/* Workflow strip */}
            <div className="flex items-start justify-between gap-1 pt-1">
              {workflowSteps.map(({ icon: Icon, label }, i) => (
                <div key={label} className="flex flex-1 flex-col items-center text-center relative">
                  {i < workflowSteps.length - 1 && (
                    <div className="absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-px bg-gradient-to-r from-violet-500/50 to-violet-500/10 hidden sm:block" />
                  )}
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15 ring-1 ring-violet-400/25 mb-2">
                    <Icon className="h-4 w-4 text-violet-300" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 leading-tight max-w-[88px]">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-2.5 text-left">
              {featureGrid.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5 transition-colors hover:border-violet-500/25 hover:bg-violet-500/[0.06]"
                >
                  <Icon className="h-4 w-4 text-violet-400 mb-2" />
                  <p className="text-sm font-semibold text-slate-200 leading-none mb-1">{title}</p>
                  <p className="text-[11px] text-slate-500 leading-snug">{desc}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-violet-400" />
                Free plan
              </span>
              <span className="h-3 w-px bg-white/10" />
              <span className="flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5 text-violet-400" />
                Official APIs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/50 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-indigo-100/50 blur-3xl" />

        <div className="relative flex flex-1 flex-col justify-center px-6 sm:px-10 lg:px-14 py-10">
          <div className="w-full max-w-[420px] mx-auto space-y-6">
            {minimal ? (
              <>
                <div>{children}</div>
                {footer && (
                  <p className="text-center text-sm text-slate-500 pt-2">{footer}</p>
                )}
              </>
            ) : (
              <>
                <div className="lg:hidden flex justify-center mb-4">
                  <BrandLogo />
                </div>
                <Card className="border border-slate-200/80 shadow-xl shadow-slate-200/40 rounded-2xl overflow-hidden">
                  <CardHeader className="space-y-1.5 px-7 pt-8 pb-0 sm:px-8">
                    <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
                    {description && (
                      <CardDescription className="text-sm text-slate-500 leading-relaxed">
                        {description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="px-7 pb-8 pt-6 sm:px-8 space-y-5">
                    {children}
                  </CardContent>
                </Card>
                {footer && (
                  <p className="text-center text-sm text-muted-foreground">{footer}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthError({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-full bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3">
      {message}
    </div>
  );
}

export function AuthSuccess({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm px-4 py-3">
      {message}
    </div>
  );
}

export { Button, Link };
