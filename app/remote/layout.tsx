export const metadata = {
  title: "Utility Scripts - Arkz",
  description:
    "A collection of utility scripts for Nikke: Goddess of Victory. These scripts are designed for windows users.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
