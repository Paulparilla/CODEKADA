export default function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Class Detail</h1>
      <p className="text-muted-foreground mt-2">Coming soon.</p>
    </div>
  );
}
