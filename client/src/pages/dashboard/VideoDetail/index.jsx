import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, RefreshCw, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getVideo } from "../../../services/videoServices";
import {
  generateAiContent,
  getAiUsage,
  getVideoPlatformContents,
  saveVideoPlatformContent,
} from "../../../services/aiServices";
import VideoThumbnail from "../../../components/dashboard/VideoThumbnail";

const PLATFORMS = [
  { id: "tiktok", label: "TikTok" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "youtube", label: "YouTube Shorts" },
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "pt", label: "Portuguese" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
];

const AI_LANGUAGE_KEY = "nextvip-ai-language";

const getSavedLanguage = () => {
  try {
    const saved = localStorage.getItem(AI_LANGUAGE_KEY);
    if (saved && LANGUAGES.some((l) => l.code === saved)) return saved;
  } catch {
    // ignore
  }
  return "en";
};

const emptyPlatformState = () => ({
  title: "",
  description: "",
  hashtags: "",
  status: "draft",
});

export default function VideoDetailPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [platform, setPlatform] = useState("tiktok");
  const [platformData, setPlatformData] = useState({
    tiktok: emptyPlatformState(),
    instagram: emptyPlatformState(),
    facebook: emptyPlatformState(),
    youtube: emptyPlatformState(),
  });
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingType, setGeneratingType] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState(getSavedLanguage);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [videoRes, contentsRes, usageRes] = await Promise.all([
        getVideo(id),
        getVideoPlatformContents(id),
        getAiUsage(),
      ]);

      setVideo(videoRes.data.video);
      setUsage(usageRes.data.usage);

      const next = {
        tiktok: emptyPlatformState(),
        instagram: emptyPlatformState(),
        facebook: emptyPlatformState(),
        youtube: emptyPlatformState(),
      };

      (contentsRes.data.contents || []).forEach((c) => {
        next[c.platform] = {
          title: c.title || "",
          description: c.description || "",
          hashtags: (c.hashtags || []).join(" "),
          status: c.status || "draft",
        };
      });

      setPlatformData(next);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load video");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const current = platformData[platform];

  const updateField = (field, value) => {
    setPlatformData((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value },
    }));
  };

  const generating = Boolean(generatingType);

  const handleGenerate = async (generationType) => {
    setGeneratingType(generationType);
    try {
      const { data } = await generateAiContent({
        videoId: id,
        platform,
        generationType,
        language,
        saveToVideo: true,
      });

      const result = data.result || {};
      setPlatformData((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          title: result.title ?? prev[platform].title,
          description: result.description ?? prev[platform].description,
          hashtags: result.hashtags
            ? result.hashtags.join(" ")
            : prev[platform].hashtags,
        },
      }));

      if (data.usage) setUsage(data.usage);
      toast.success("AI content generated");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI generation failed");
    } finally {
      setGeneratingType(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const hashtags = current.hashtags
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => (t.startsWith("#") ? t : `#${t}`));

      await saveVideoPlatformContent(id, platform, {
        title: current.title,
        description: current.description,
        hashtags,
        status: current.status,
      });

      toast.success("Platform content saved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link to="/dashboard/videos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to videos
          </Link>
        </Button>
        <div className="rounded-md bg-destructive/10 text-destructive text-sm px-3 py-2">
          {error || "Video not found"}
        </div>
      </div>
    );
  }

  const handleLanguageChange = (code) => {
    setLanguage(code);
    try {
      localStorage.setItem(AI_LANGUAGE_KEY, code);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link to="/dashboard/videos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to videos
            </Link>
          </Button>
          <h2 className="text-2xl font-bold">{video.title || "Untitled video"}</h2>
          <p className="text-muted-foreground text-sm max-w-xl">
            {video.description || "Generate platform-specific titles, descriptions, and hashtags with AI."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <VideoThumbnail
            fileUrl={video.file_url}
            sourceUrl={video.source_url}
            thumbnailUrl={video.thumbnail_url}
            title={video.title}
            className="w-24 h-16 rounded-lg"
          />
          {usage && (
            <Badge variant="secondary">
              AI: {usage.used}/{usage.limit || "∞"} this month
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-600" />
            AI content by platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-6">
            <div className="space-y-2 sm:w-56">
              <Label htmlFor="ai-language">Generation language</Label>
              <Select value={language} onValueChange={handleLanguageChange} disabled={generating}>
                <SelectTrigger id="ai-language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground sm:pb-2.5">
              Title, description, and hashtags will be generated in this language.
            </p>
          </div>

          <Tabs value={platform} onValueChange={setPlatform}>
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
              {PLATFORMS.map((p) => (
                <TabsTrigger key={p.id} value={p.id}>
                  {p.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {PLATFORMS.map((p) => {
              const isActivePlatform = platform === p.id;
              const showFieldSkeleton =
                isActivePlatform &&
                generating &&
                (generatingType === "full_adaptation" ||
                  generatingType === "title" ||
                  generatingType === "description" ||
                  generatingType === "hashtags");

              const skeletonFor = (field) => {
                if (!showFieldSkeleton) return false;
                if (generatingType === "full_adaptation") return true;
                return generatingType === field;
              };

              return (
              <TabsContent key={p.id} value={p.id} className="space-y-4 mt-0">
                {isActivePlatform && generating && (
                  <div className="flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2.5 text-sm text-violet-800">
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-violet-600" />
                    <span>
                      {generatingType === "full_adaptation"
                        ? "Generating title, description, and hashtags…"
                        : generatingType === "title"
                          ? "Generating title…"
                          : generatingType === "description"
                            ? "Generating description…"
                            : "Generating hashtags…"}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={generating}
                    onClick={() => handleGenerate("full_adaptation")}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Generate all
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={generating}
                    onClick={() => handleGenerate("title")}
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Title
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={generating}
                    onClick={() => handleGenerate("description")}
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Description
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={generating}
                    onClick={() => handleGenerate("hashtags")}
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Hashtags
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${p.id}`}>Title</Label>
                    {skeletonFor("title") ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input
                        id={`title-${p.id}`}
                        value={platformData[p.id].title}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder={`${p.label} title`}
                        disabled={generating}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`desc-${p.id}`}>Description / caption</Label>
                    {skeletonFor("description") ? (
                      <Skeleton className="h-[120px] w-full" />
                    ) : (
                      <Textarea
                        id={`desc-${p.id}`}
                        rows={5}
                        value={platformData[p.id].description}
                        onChange={(e) => updateField("description", e.target.value)}
                        placeholder={`${p.label} description`}
                        disabled={generating}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`tags-${p.id}`}>Hashtags</Label>
                    {skeletonFor("hashtags") ? (
                      <Skeleton className="h-16 w-full" />
                    ) : (
                      <Textarea
                        id={`tags-${p.id}`}
                        rows={2}
                        value={platformData[p.id].hashtags}
                        onChange={(e) => updateField("hashtags", e.target.value)}
                        placeholder="#producto #viral #fyp"
                        disabled={generating}
                      />
                    )}
                  </div>
                </div>

                <Button onClick={handleSave} disabled={saving || generating}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save {p.label} content
                    </>
                  )}
                </Button>
              </TabsContent>
            );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
