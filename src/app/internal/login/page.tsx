import InternalLoginClient from "@/components/internal/InternalLoginClient";

export default async function InternalLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = params.redirect ?? "/internal/system-check";
  return <InternalLoginClient redirectTo={redirectTo} />;
}
