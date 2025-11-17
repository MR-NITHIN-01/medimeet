// app/layout.jsx
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "../components/header";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "../components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Doctors Appointment App",
  description: "Connect with doctors anytime, anywhere",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Header */}
            <Header />

            {/* Main content */}
            <main className="min-h-screen">{children}</main>

            {/* Toasts */}
            <Toaster richColors />

            {/* ✅ Compact Colorful Footer */}
            <footer className="relative overflow-hidden mt-16">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-500 to-indigo-500 animate-gradient-x opacity-80 blur-2xl" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_60%)]" />

              <div className="relative z-10 container mx-auto px-6 py-8 text-center text-white space-y-5">
                <h2 className="text-xl sm:text-2xl font-bold drop-shadow">
                  Ready to take control of your healthcare?
                </h2>
                <p className="max-w-xl mx-auto text-gray-100/90 text-sm">
                  Join thousands of users who’ve simplified their healthcare journey with our
                  platform. Your health, our priority 💚
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                  <a
                    href="mailto:gugulothnithin1010@gmail.com?subject=Medimeet%20-%20Feature%20Request"
                    className="inline-flex items-center rounded-lg px-4 py-1.5 bg-white/90 text-gray-900 font-semibold shadow hover:shadow-md hover:bg-white transition"
                  >
                    ✉️ Request a Feature
                  </a>
                  <a
                    href="/pricing"
                    className="inline-flex items-center rounded-lg px-4 py-1.5 bg-black/30 ring-1 ring-white/30 text-white hover:bg-black/40 transition"
                  >
                    View Pricing
                  </a>
                </div>

                {/* Links */}
                <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-white/90">
                  <a
                    href="mailto:gugulothnithin1010@gmail.com"
                    className="hover:text-yellow-300 transition-colors"
                  >
                    📧 Contact: gugulothnithin1010@gmail.com
                  </a>
                  <a href="https://www.linkedin.com/in/nithin-guguloth-051092333/" target="_blank" className="hover:text-blue-200">
                    🔗 LinkedIn
                  </a>
                  <a href="https://github.com/MR-NITHIN-01" target="_blank" className="hover:text-gray-200">
                    💻 GitHub
                  </a>
                  <a href="/terms" className="hover:text-emerald-200">
                    Terms
                  </a>
                  <a href="/privacy" className="hover:text-emerald-200">
                    Privacy
                  </a>
                </div>

                {/* Divider */}
                <div className="mx-auto w-2/3 max-w-sm border-t border-white/25" />

                {/* Credits */}
                <div className="text-xs text-white/90 space-y-1">
                  <p>
                    Made with <span className="text-rose-300">DEDICATION</span> by{" "}
                    <span className="font-semibold text-yellow-300">NITHIN GUGULOTH</span>
                  </p>
                  <p>
                    © {new Date().getFullYear()}{" "}
                    <span className="font-semibold">Medimeet</span>. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
