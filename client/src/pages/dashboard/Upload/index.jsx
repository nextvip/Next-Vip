import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileVideo, Link2, Loader2, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { uploadVideo, createVideoLink } from "../../../services/videoServices";

const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime,video/x-msvideo";

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function VideoUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isFileFormValid = Boolean(file) && title.trim().length > 0;
  const isLinkFormValid = sourceUrl.trim().length > 0 && linkTitle.trim().length > 0;

  const pickFile = (selected) => {
    if (!selected) return;
    if (!selected.type.startsWith("video/")) {
      setError("Please choose a video file (MP4, WebM, or MOV)");
      return;
    }
    setError("");
    setFile(selected);
    if (!title.trim()) {
      const name = selected.name.replace(/\.[^.]+$/, "");
      setTitle(name);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!isFileFormValid) return;
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", title.trim());
      if (description.trim()) formData.append("description", description.trim());
      await uploadVideo(formData);
      navigate("/dashboard/videos");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    if (!isLinkFormValid) return;
    setError("");
    setLoading(true);
    try {
      await createVideoLink({
        title: linkTitle.trim(),
        source_url: sourceUrl.trim(),
        source_type: sourceUrl.includes("tiktok") ? "tiktok_link" : "url",
      });
      navigate("/dashboard/videos");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Upload video</h2>
        <p className="text-sm text-muted-foreground">
          Upload a file or import from a TikTok/URL link.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3">
          {error}
        </div>
      )}

      <Tabs defaultValue="file">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file">File upload</TabsTrigger>
          <TabsTrigger value="link">Link import</TabsTrigger>
        </TabsList>

        <TabsContent value="file">
          <Card>
            <CardHeader>
              <CardTitle>Upload from device</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFileUpload} className="space-y-5">
                <div className="space-y-2">
                  <Label>Video file</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={VIDEO_ACCEPT}
                    className="sr-only"
                    onChange={(e) => pickFile(e.target.files?.[0] || null)}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      pickFile(e.dataTransfer.files?.[0] || null);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-all",
                      dragOver && "border-violet-500 bg-violet-50",
                      file
                        ? "border-violet-400 bg-violet-50/40"
                        : "border-slate-200 bg-slate-50/50 hover:border-violet-300 hover:bg-violet-50/30"
                    )}
                  >
                    {file ? (
                      <>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
                          <FileVideo className="h-7 w-7 text-violet-600" />
                        </div>
                        <p className="mt-3 font-semibold text-slate-900 truncate max-w-full">
                          {file.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatFileSize(file.size)} · Click or drop to replace
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
                          <Upload className="h-7 w-7 text-violet-600" />
                        </div>
                        <p className="mt-3 font-semibold text-slate-900">
                          Click here to upload your video
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          or drag and drop your file into this area
                        </p>
                        <p className="text-xs text-muted-foreground mt-3">
                          Supports MP4, WebM, MOV
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4 border-violet-200 text-violet-700 hover:bg-violet-50 pointer-events-none"
                          tabIndex={-1}
                        >
                          Choose video file
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your video a title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional — add a caption or notes"
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500"
                  disabled={loading || !isFileFormValid}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload video
                </Button>

                {!isFileFormValid && !loading && (
                  <p className="text-xs text-muted-foreground">
                    Select a video file and enter a title to enable upload.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="link">
          <Card>
            <CardHeader>
              <CardTitle>Import from link</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLinkSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="sourceUrl">
                    Video URL <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="sourceUrl"
                    type="url"
                    placeholder="https://tiktok.com/..."
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkTitle">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="linkTitle"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder="Video title"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500"
                  disabled={loading || !isLinkFormValid}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Link2 className="h-4 w-4 mr-2" />
                  )}
                  Save video
                </Button>
                {!isLinkFormValid && !loading && (
                  <p className="text-xs text-muted-foreground">
                    Enter a URL and title to save the video.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
