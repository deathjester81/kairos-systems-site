import ReportClient from "./report-client";

export default async function ReportPage({ params }: { params: { token: string } }) {
  return <ReportClient token={params.token} />;
}
