import ReportClient from "./report-client";

export default async function ReportPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <ReportClient token={token} />;
}
