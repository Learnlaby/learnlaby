import Layout from "@/components/layout";

export default function ClassroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
