import AnalyticsDetailClient from "@/components/analytics/AnalyticsDetailClient";

export default function AnalyticsDetailPage({
  params
}: {
  params: { type: "player" | "team" | "tournament"; slug: string };
}) {
  return <AnalyticsDetailClient type={params.type} slug={params.slug} />;
}
