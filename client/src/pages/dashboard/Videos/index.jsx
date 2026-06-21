import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getVideos, deleteVideo } from "../../../services/videoServices";

const statusColors = {
  draft: "secondary",
  ready: "default",
  processing: "outline",
  published: "default",
  failed: "destructive",
};

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVideos = async () => {
    setLoading(true);
    try {
      const { data } = await getVideos();
      setVideos(data.videos || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this video?")) return;
    try {
      await deleteVideo(id);
      setVideos((prev) => prev.filter((v) => v._id !== id && v.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Videos</h2>
          <p className="text-muted-foreground">Upload and manage your content library.</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/upload">Upload video</Link>
        </Button>
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
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : videos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No videos yet.{" "}
                  <Link to="/dashboard/upload" className="text-primary hover:underline">
                    Upload your first video
                  </Link>
                </TableCell>
              </TableRow>
            ) : (
              videos.map((video) => (
                <TableRow key={video._id || video.id}>
                  <TableCell className="font-medium">{video.title || "Untitled"}</TableCell>
                  <TableCell className="capitalize">{video.source_type}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[video.status] || "secondary"}>
                      {video.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {video.createdAt
                      ? new Date(video.createdAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {(video.file_url || video.source_url) && (
                      <Button variant="ghost" size="icon" asChild>
                        <a
                          href={video.file_url || video.source_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(video._id || video.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
