import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "./components/ui/theme-provider";
import {SiteFooter} from "./components/ui/site-footer";
import {SiteHeader} from "./components/ui/site-header";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Programmer's Board",
    description: "Generated using shadcn/ui",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="zinc"
            enableSystem
            disableTransitionOnChange
        >
            <SiteHeader/>
            {children}
            <SiteFooter/>
        </ThemeProvider>
        </body>
        </html>
    );
}

