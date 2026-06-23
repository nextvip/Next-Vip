import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  Sparkles,
  Share2,
  MessageCircle,
  Link2,
  BarChart3,
  Zap,
  Upload,
  Bot,
  Calendar,
  Check,
  CheckCircle2,
  Star,
  Quote,
  Play,
  Send,
  Crown,
  Flame,
} from "lucide-react";
import SEO from "../../../components/common/SEO";
import TypewriterText from "../../../components/common/TypewriterText";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getUser } from "../../../store/auth/authSlice";

const platforms = ["TikTok", "Instagram", "Facebook", "YouTube"];

const heroTypeWords = ["multiplied", "automated", "repurposed", "distributed", "scaled"];

const stats = [
  {
    icon: Upload,
    label: "Upload once",
    sub: "One video, every platform",
    metric: "4 networks",
  },
  {
    icon: BarChart3,
    label: "Track performance",
    sub: "Publications & history",
    metric: "Real-time logs",
  },
  {
    icon: Calendar,
    label: "Schedule posts",
    sub: "Pick date, time & networks",
    metric: "Set & forget",
  },
];

const steps = [
  {
    num: "01",
    title: "Connect your platforms",
    desc: "Link TikTok, Instagram, Facebook, and YouTube.",
  },
  {
    num: "02",
    title: "Import & republish",
    desc: "NextVIP pulls your TikTok videos and publishes them to Facebook, Instagram, and YouTube Shorts. You can also upload a file or import from a link — titles and captions are adapted per platform.",
  },
  {
    num: "03",
    title: "Automate & monetize",
    desc: "Auto-publish, reply to comments, send DMs with affiliate links — on autopilot.",
  },
];

const features = [
  {
    id: "distribution",
    badge: "Multi-platform",
    title: "Automate your content distribution",
    desc: "Stop wasting hours manually reposting. Upload your video once and let NextVIP prepare it for every platform — optimized captions, hashtags, and scheduling included.",
    icon: Share2,
    bullets: [
      "One upload → TikTok, IG, Facebook & YouTube",
      "AI-generated captions per platform",
      "Schedule or publish instantly",
    ],
    mock: (
      <div className="relative">
        <div className="absolute -inset-4 bg-violet-500/10 rounded-3xl blur-2xl" />
        <div className="relative rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-2xl shadow-violet-500/10 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/80">
            <span className="text-xs font-medium text-slate-500">Upload queue</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Complete
            </span>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex gap-3">
              <div className="relative h-16 w-24 shrink-0 rounded-lg bg-gradient-to-br from-violet-600/20 to-indigo-600/30 border border-violet-200/50 flex items-center justify-center">
                <Play className="h-6 w-6 text-violet-600 fill-violet-600/20" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">Summer product review.mp4</p>
                <p className="text-xs text-slate-500 mt-0.5">Ready for 4 platforms</p>
                <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {platforms.map((p, i) => (
                <div
                  key={p}
                  className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-100 px-3 py-2"
                >
                  <span className="text-xs font-medium text-slate-700">{p}</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" style={{ opacity: 1 - i * 0.05 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "monetize",
    badge: "Affiliate system",
    title: "Monetize every view with automation",
    desc: "Never lose a commission again. Embed Amazon, TikTok Shop, or custom affiliate links into captions, comment replies, and auto-DMs — so every interaction can convert.",
    icon: Link2,
    reverse: true,
    bullets: [
      "Amazon, TikTok Shop & custom links",
      "Auto-DM on comment keywords",
      "Track clicks from every interaction",
    ],
    mock: (
      <div className="relative">
        <div className="absolute -inset-4 bg-indigo-500/15 rounded-3xl blur-2xl" />
        <div className="relative rounded-2xl bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 p-1 shadow-2xl shadow-violet-600/25">
          <div className="rounded-[14px] bg-slate-950/40 backdrop-blur-sm p-5 space-y-4">
            <div className="rounded-xl bg-white/10 border border-white/10 p-3">
              <p className="text-[10px] uppercase tracking-wider text-violet-300 mb-1">Comment trigger</p>
              <p className="text-sm font-semibold text-white">Keyword: INFO</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-8 w-8 rounded-full bg-violet-400/30 flex items-center justify-center shrink-0">
                <MessageCircle className="h-4 w-4 text-violet-200" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-white/15 border border-white/10 px-3 py-2 text-sm text-violet-100">
                Thanks! Check your DMs for the link 👇
              </div>
            </div>
            <div className="rounded-xl bg-emerald-500/15 border border-emerald-400/30 p-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-emerald-300">Auto-reply sent</p>
                <p className="text-[11px] text-violet-200/80 mt-0.5">
                  DM: Here&apos;s your link → <span className="underline">{"{link}"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "automation",
    badge: "IF/THEN rules",
    title: "Smart comment & DM automation",
    desc: "When someone comments a keyword like INFO, NextVIP replies publicly and sends a personalized DM with your product link. Fully editable templates with variables like {link} and {product}.",
    icon: MessageCircle,
    bullets: [
      "Custom triggers like INFO, LINK, SHOP",
      "Public reply + private DM in one flow",
      "Templates with {link} & {product}",
    ],
    mock: (
      <div className="relative">
        <div className="absolute -inset-4 bg-violet-500/10 rounded-3xl blur-2xl" />
        <div className="relative rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-2xl shadow-violet-500/10 p-5 space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bot className="h-5 w-5 text-violet-600" />
            <span className="text-sm font-semibold text-slate-900">Automation rules</span>
            <span className="ml-auto text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">3 active</span>
          </div>
          {[
            { trigger: "INFO", action: "Reply + Send DM", icon: Send, active: true },
            { trigger: "Upload", action: "Auto-publish all", icon: Upload, active: true },
            { trigger: "TikTok", action: "Adapt for Instagram", icon: Share2, active: false },
          ].map(({ trigger, action, icon: RuleIcon, active }) => (
            <div
              key={trigger}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-colors ${
                active
                  ? "bg-violet-50/80 border-violet-100"
                  : "bg-slate-50 border-slate-100"
              }`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                active ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-500"
              }`}>
                <RuleIcon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500">IF {trigger}</p>
                <p className="text-sm font-medium text-slate-800 truncate">{action}</p>
              </div>
              {active && <CheckCircle2 className="h-4 w-4 text-violet-600 shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "7 days",
    desc: "Try NextVIP free on every platform",
    videosPerDay: 10,
    popular: false,
    icon: Sparkles,
    tag: "No card required",
  },
  {
    name: "Standard",
    price: "$40",
    period: "15 days",
    desc: "Great for consistent publishing",
    videosPerDay: 10,
    popular: false,
    icon: Zap,
    tag: "Best for starters",
  },
  {
    name: "Popular",
    price: "$59",
    period: "30 days",
    desc: "Best value for scaling creators",
    videosPerDay: 30,
    popular: true,
    icon: Crown,
    tag: "Most chosen",
  },
];

const planFeatures = [
  "TikTok, Instagram, Facebook & YouTube",
  "Comment automation",
  "Affiliate links",
];

const faqs = [
  {
    q: "What is NextVIP?",
    a: "NextVIP is an AI-powered SaaS for content creators and affiliates. Upload a video once, distribute it across social platforms, and automate comment replies and DMs with affiliate links.",
  },
  {
    q: "Which platforms are supported?",
    a: "TikTok, Instagram, Facebook, and YouTube via their official APIs. You connect your own accounts through OAuth from the dashboard.",
  },
  {
    q: "How does comment automation work?",
    a: "You set trigger keywords (e.g. INFO). When a comment matches, NextVIP sends a public reply and a private DM with your customizable message and affiliate link.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. Start with a 7-day free trial — publish up to 10 videos per day on all platforms. Upgrade to Standard ($40/15 days) or Popular ($59/30 days) when you're ready to scale.",
  },
];

const testimonials = [
  {
    quote:
      "I upload once and my content goes everywhere. Comment automation alone paid for the subscription in week one.",
    name: "Jordan M.",
    role: "Affiliate marketer",
    initials: "JM",
    highlight: "3× reach in 30 days",
    avatarClass: "from-violet-500 to-indigo-600",
  },
  {
    quote:
      "The IF/THEN rules save me hours every day. My DMs go out instantly with the right product link.",
    name: "Alex R.",
    role: "TikTok Shop creator",
    initials: "AR",
    highlight: "12 hrs saved weekly",
    avatarClass: "from-fuchsia-500 to-violet-600",
  },
  {
    quote:
      "Scheduling to four platforms from one dashboard changed how I run my content business. Clean and fast.",
    name: "Sam K.",
    role: "Multi-platform creator",
    initials: "SK",
    highlight: "4 platforms, 1 upload",
    avatarClass: "from-indigo-500 to-violet-600",
  },
  {
    quote:
      "My affiliate links in auto-DMs convert better than anything I did manually. NextVIP just works.",
    name: "Taylor P.",
    role: "Instagram creator",
    initials: "TP",
    highlight: "2× DM conversions",
    avatarClass: "from-violet-600 to-purple-600",
  },
];

export default function Home() {
  const location = useLocation();
  const { isAuthenticated } = useSelector(getUser);
  const ctaTo = isAuthenticated ? "/dashboard" : "/register";
  const ctaLabel = isAuthenticated ? "Open dashboard" : "Start automation for free";

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <Fragment>
      <SEO title="Home" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#030712] text-white">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_50%,rgba(99,102,241,0.12),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent)",
          }}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[720px] h-[320px] bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="container relative mx-auto px-4 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-200 backdrop-blur-sm mb-8">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              AI-Powered Content Automation
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[4.25rem] font-bold tracking-tight leading-[1.08] mb-6">
              Your content,{" "}
              <TypewriterText
                words={heroTypeWords}
                className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-400"
                cursorClassName="bg-violet-300"
              />
              <br className="hidden sm:block" />
              <span className="sm:ml-0"> and monetized</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Repurpose your videos across TikTok, Instagram, Facebook, and YouTube — with
              affiliate links automatically embedded so you scale faster than ever.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white h-12 px-8 text-base font-semibold shadow-xl shadow-violet-600/25 border-0"
              >
                <Link to={ctaTo}>
                  {ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                asChild
                className="w-full sm:w-auto rounded-full h-12 px-8 text-base font-medium text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white backdrop-blur-sm"
              >
                <a href="#how-it-works">See how it works</a>
              </Button>
            </div>

    

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {platforms.map((p) => (
                <span
                  key={p}
                  className="text-xs font-medium text-slate-400 border border-white/10 bg-white/[0.04] rounded-full px-4 py-1.5 backdrop-blur-sm"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Product preview */}
          <div className="relative max-w-5xl mx-auto mt-16 lg:mt-20">
            <div className="absolute -inset-4 bg-gradient-to-b from-violet-600/20 via-transparent to-transparent rounded-3xl blur-2xl pointer-events-none" />
            <div className="relative rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-slate-900/90">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs text-slate-500 ml-2">NextVIP Dashboard</span>
              </div>
              <div className="p-6 sm:p-8 grid sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <Upload className="h-4 w-4 text-violet-400" />
                    <span className="text-xs font-medium text-slate-300">1 video uploaded</span>
                  </div>
                  <div className="h-16 rounded-lg bg-gradient-to-br from-violet-600/30 to-indigo-600/20 border border-violet-500/20" />
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <Share2 className="h-4 w-4 text-violet-400" />
                    <span className="text-xs font-medium text-slate-300">4 platforms</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {platforms.map((p) => (
                      <span key={p} className="text-[10px] px-2 py-0.5 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/20">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 text-left sm:col-span-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-medium text-emerald-400">Automation live</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Comment &quot;INFO&quot; → auto-reply + DM with{" "}
                    <span className="text-violet-300">{"{link}"}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing — second section, above features */}
      <section id="pricing" className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/40 to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-300/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-200/25 rounded-full blur-[100px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)",
          }}
        />

        <div className="container relative mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-violet-700 shadow-sm mb-6">
              <Flame className="h-3.5 w-3.5 text-violet-500" />
              Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight mb-4">
              Simple, transparent{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                pricing
              </span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Start with 7 days free. Upgrade when you&apos;re ready to scale.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6 max-w-6xl mx-auto items-stretch">
            {plans.map(({ name, price, period, desc, videosPerDay, popular, icon: PlanIcon, tag }) => (
              <div
                key={name}
                className={`group relative flex flex-col ${
                  popular ? "md:-mt-2 md:mb-2 z-10" : ""
                }`}
              >
                <div
                  className={`relative flex flex-col h-full rounded-2xl p-8 transition-all duration-300 bg-white/90 backdrop-blur-xl group-hover:-translate-y-1 ${
                    popular
                      ? "border-2 border-violet-500 shadow-xl shadow-violet-500/15 ring-1 ring-violet-500/30 group-hover:shadow-violet-500/25"
                      : "border border-slate-200/80 shadow-lg shadow-slate-200/50 group-hover:border-violet-200 group-hover:shadow-xl group-hover:shadow-violet-500/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 shadow-sm shadow-violet-500/10">
                      <PlanIcon className="h-5 w-5 text-violet-600" />
                    </div>
                    {popular ? (
                      <Badge className="bg-violet-600 hover:bg-violet-600 border-0 text-white">
                        Most popular
                      </Badge>
                    ) : (
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        {tag}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{name}</h3>
                  <p className="text-sm mt-1.5 mb-6 leading-relaxed text-muted-foreground">{desc}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-5xl font-bold tracking-tight text-slate-900">{price}</span>
                      <span className="text-sm font-medium text-muted-foreground">/ {period}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 mb-6 bg-gradient-to-br from-violet-50 to-indigo-50/80 border border-violet-100/80">
                    <p className="text-2xl font-bold text-violet-700">
                      {videosPerDay}
                      <span className="text-sm font-medium ml-1.5 text-violet-600/80">videos/day</span>
                    </p>
                    <p className="text-xs mt-1 text-muted-foreground">All platforms included</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {planFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="text-slate-600">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    size="lg"
                    className={
                      popular
                        ? "w-full rounded-full h-12 bg-violet-600 hover:bg-violet-500 text-white border-0 shadow-lg shadow-violet-600/25 font-semibold"
                        : "w-full rounded-full h-12 border-violet-200 text-violet-700 bg-white hover:bg-violet-50 hover:border-violet-300 font-semibold shadow-sm"
                    }
                    variant={popular ? "default" : "outline"}
                  >
                    <Link to="/register">
                      Get started
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-12 max-w-lg mx-auto">
            All plans include multi-platform publishing. No hidden fees — cancel anytime.
          </p>
        </div>
      </section>

      {/* Feature sections */}
      <section id="features" className="relative overflow-hidden">
        <div className="relative py-16 lg:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[320px] bg-violet-200/20 rounded-full blur-[100px] pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)",
            }}
          />

          <div className="container relative mx-auto px-4">
            <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-200/80 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-violet-700 shadow-sm mb-6">
                <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                Platform features
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight mb-4 text-center">
                Everything you need to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                  scale content
                </span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
                Upload once, publish everywhere, and turn engagement into revenue — automatically.
              </p>
            </div>
          </div>
        </div>

        {features.map(({ id, badge, title, desc, icon: Icon, bullets, mock, reverse }, index) => (
          <div
            key={id}
            id={id === "distribution" ? undefined : id}
            className={`relative py-16 lg:py-24 overflow-hidden ${
              index % 2 === 0
                ? "bg-white"
                : "bg-gradient-to-br from-violet-50/60 via-white to-indigo-50/40"
            }`}
          >
            {index % 2 === 1 && (
              <div className="absolute top-1/2 right-0 w-72 h-72 bg-violet-200/20 rounded-full blur-[80px] pointer-events-none" />
            )}
            <div className="container relative mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
                <div className={`space-y-6 ${reverse ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="inline-flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <Badge variant="outline" className="border-violet-200 bg-white/80 text-violet-700">
                      {badge}
                    </Badge>
                  </div>
                  <h3 className="text-3xl lg:text-[2rem] font-bold tracking-tight leading-tight">
                    {title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{desc}</p>
                  <ul className="space-y-3">
                    {bullets.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                        <CheckCircle2 className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="rounded-full bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-600/20"
                  >
                    <Link to={ctaTo}>
                      Try it now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className={`lg:px-4 ${reverse ? "lg:order-1" : "lg:order-2"}`}>{mock}</div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Stats strip */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_100%,rgba(139,92,246,0.15),transparent)]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="container relative mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-4 lg:gap-6 max-w-5xl mx-auto">
            {stats.map(({ icon: Icon, label, sub, metric }, index) => (
              <div
                key={label}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 lg:p-8 text-center transition-all duration-300 hover:border-violet-400/40 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-0.5"
              >
                {index < stats.length - 1 && (
                  <span className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 h-8 w-px bg-gradient-to-b from-transparent via-violet-500/40 to-transparent z-10" />
                )}
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-600/30 ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="inline-block mb-3 text-[11px] font-semibold uppercase tracking-wider text-violet-300/90">
                  {metric}
                </span>
                <p className="text-lg font-bold text-white mb-1">{label}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground text-lg">Set up once. Automate from there.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="relative rounded-2xl border p-8 hover:border-violet-200 hover:shadow-lg transition-all">
                <span className="text-5xl font-bold text-violet-100">{num}</span>
                <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-white via-violet-50/40 to-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-200/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="container relative mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge
              variant="outline"
              className="mb-4 border-violet-200 bg-violet-50 text-violet-700 px-3 py-1"
            >
              Creator stories
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Built for creators who scale
            </h2>
            <p className="text-muted-foreground text-lg">
              See how affiliates and creators use NextVIP to publish faster and monetize every interaction.
            </p>
          </div>

          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full max-w-6xl mx-auto px-10 sm:px-14"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map(({ quote, name, role, initials, highlight, avatarClass }) => (
                <CarouselItem
                  key={name}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <blockquote className="group relative flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/10">
                    <Quote className="absolute top-5 right-5 h-8 w-8 text-violet-100 transition-colors group-hover:text-violet-200" />
                    <div className="flex gap-0.5 mb-5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-slate-700 leading-relaxed mb-6 flex-1 text-[15px]">
                      &ldquo;{quote}&rdquo;
                    </p>
                    <span className="inline-flex w-fit items-center rounded-full bg-violet-50 border border-violet-100 px-3 py-1 text-xs font-medium text-violet-700 mb-5">
                      {highlight}
                    </span>
                    <footer className="flex items-center gap-3 pt-5 border-t border-slate-100">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarClass} text-sm font-bold text-white shadow-md`}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="font-semibold text-slate-900 truncate">{name}</p>
                        <p className="text-sm text-muted-foreground truncate">{role}</p>
                      </div>
                    </footer>
                  </blockquote>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 sm:-left-4 top-1/2 -translate-y-1/2 h-10 w-10 border-violet-200 bg-white shadow-md hover:bg-violet-50 disabled:opacity-40" />
            <CarouselNext className="right-0 sm:-right-4 top-1/2 -translate-y-1/2 h-10 w-10 border-violet-200 bg-white shadow-md hover:bg-violet-50 disabled:opacity-40" />
          </Carousel>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 lg:py-28 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-10">FAQs</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map(({ q, a }, i) => (
              <AccordionItem key={q} value={`item-${i}`} className="bg-white rounded-xl border px-4">
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-28 bg-slate-950 text-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <Zap className="h-10 w-10 text-violet-400 mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Time to turn every post into revenue
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Let NextVIP handle distribution and monetization while you focus on creating.
          </p>
          <Button
            size="lg"
            asChild
            className="bg-violet-600 hover:bg-violet-500 h-12 px-10 text-base shadow-lg shadow-violet-600/30"
          >
            <Link to={ctaTo}>
              {ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Fragment>
  );
}
