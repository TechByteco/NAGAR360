import type { Metadata } from 'next';
import './globals.css';
import { TopNavbar } from '../components/layout/TopNavbar';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { Footer } from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Nagar360 — AI-Powered Civic Social Network & Complaint Platform',
  description: 'Turn civic problems into civic action. Report potholes, garbage, streetlights, and drainage issues to municipal authorities in Indian cities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#17212B]">
        <TopNavbar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
