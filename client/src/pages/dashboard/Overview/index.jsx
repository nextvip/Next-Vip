import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Video, Upload, History, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingDots } from "../../../components/common/LoadingState";
import { getMySubscription } from "../../../services/subscriptionServices";
import { getVideos } from "../../../services/videoServices";
import { getPublications } from "../../../services/publicationServices";

export default function DashboardOverview() {
  const [stats, setStats] = useState({ videos: 0, publications: 0, plan: null, maxVideos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [subRes, videosRes, pubsRes] = await Promise.all([
          getMySubscription(),
          getVideos(),
          getPublications(),
        ]);
        setStats({
          videos: videosRes.data.videos?.length || 0,
          publications: pubsRes.data.publications?.length || 0,
          plan: subRes.data.plan,
          maxVideos: subRes.data.plan?.max_videos || 0,
        });
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    {
      title: "Videos",
      value: stats.maxVideos ? `${stats.videos} / ${stats.maxVideos}` : stats.videos,
      icon: Video,
      link: "/dashboard/videos",
    },
    {
      title: "Publications",
      value: stats.publications,
      icon: History,
      link: "/dashboard/publications",
    },
    {
      title: "Current plan",
      value: stats.plan?.name || "Free",
      icon: Crown,
      link: "/dashboard/settings",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Manage your videos, track publications, and grow your content automation.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ title, value, icon: Icon, link }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold min-h-[2rem] flex items-center">
                {loading ? <LoadingDots size="md" /> : value}
              </div>
              <Link to={link} className="text-xs text-primary hover:underline mt-2 inline-block">
                View details →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/dashboard/upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload video
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard/videos">Manage videos</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard/publications">View publications</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
