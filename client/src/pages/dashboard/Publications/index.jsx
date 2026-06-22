import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getPublications, createPublication } from "../../../services/publicationServices";
import { getVideos } from "../../../services/videoServices";

const platforms = ["tiktok", "instagram", "facebook", "youtube"];

export default function PublicationsPage() {
  const [publications, setPublications] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    video_id: "",
    platform: "tiktok",
    title: "",
    post_url: "",
    status: "pending",
  });
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [pubRes, vidRes] = await Promise.all([getPublications(), getVideos()]);
      setPublications(pubRes.data.publications || []);
      setVideos(vidRes.data.videos || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load publications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createPublication(form);
      setOpen(false);
      setForm({ video_id: "", platform: "tiktok", title: "", post_url: "", status: "pending" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create publication");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Publication history</h2>
          <p className="text-muted-foreground">
            Track where your content was published across platforms.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={videos.length === 0}>Add record</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record a publication</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Video</Label>
                <Select
                  value={form.video_id}
                  onValueChange={(v) => setForm({ ...form, video_id: v })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select video" />
                  </SelectTrigger>
                  <SelectContent>
                    {videos.map((v) => (
                      <SelectItem key={v._id || v.id} value={v._id || v.id}>
                        {v.title || "Untitled"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select
                  value={form.platform}
                  onValueChange={(v) => setForm({ ...form, platform: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((p) => (
                      <SelectItem key={p} value={p} className="capitalize">
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Post URL (optional)</Label>
                <Input
                  type="url"
                  value={form.post_url}
                  onChange={(e) => setForm({ ...form, post_url: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                Save publication
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 text-destructive text-sm px-3 py-2">
          {error}
        </div>
      )}

      <div className="rounded-lg border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Video</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : publications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No publications yet. Auto-publishing arrives in a later milestone — you can
                  manually record posts using &quot;Add record&quot;.
                </TableCell>
              </TableRow>
            ) : (
              publications.map((pub) => (
                <TableRow key={pub._id || pub.id}>
                  <TableCell>{pub.video?.title || pub.title || "—"}</TableCell>
                  <TableCell className="capitalize">{pub.platform}</TableCell>
                  <TableCell>
                    <Badge variant={pub.status === "published" ? "default" : "secondary"}>
                      {pub.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {pub.createdAt
                      ? new Date(pub.createdAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {pub.post_url ? (
                      <a
                        href={pub.post_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        View
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
