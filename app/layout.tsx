import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AppSidebar } from "@/components/AppSidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <title>StudyFocus</title>
      </head>
      <body
        className="flex min-h-screen
    bg-background text-foreground
    transition-colors duration-300 ease-in-out"
      >
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
