import dynamic from "next/dynamic";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const BackgroundShape = dynamic(
  () =>
    import("@/components/sections/background-shape").then((m) => ({
      default: m.BackgroundShape,
    })),
  { ssr: false }
);

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <BackgroundShape />
      <Header />
      <main className="flex-1 pt-16 lg:pt-20">{children}</main>
      <Footer />
    </div>
  );
}
