"use client"

import * as React from "react"
import Link from "next/link"
import {usePathname} from "next/navigation"

import {siteConfig} from "@/config/site"
import {cn} from "@/lib/utils"

export function MainNav() {
    const pathname = usePathname();
    return (
        <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm lg:gap-6">
                <Link
                    href="/archive"
                    className={cn(
                        "transition-colors hover:text-foreground/80",
                        pathname?.startsWith("/themes")
                            ? "text-foreground"
                            : "text-foreground/60"
                    )}
                >
                    Archive
                </Link>
                <Link
                    href="/whiteboard"
                    className={cn(
                        "transition-colors hover:text-foreground/80",
                        pathname?.startsWith("/themes")
                            ? "text-foreground"
                            : "text-foreground/60"
                    )}
                >
                    WhiteBoard
                </Link>
                <Link
                    href="https://discord.com/invite/asJbTym54w"
                    className={cn(
                        "transition-colors hover:text-foreground/80",
                        pathname?.startsWith("/themes")
                            ? "text-foreground"
                            : "text-foreground/60"
                    )}
                >
                    Discussions
                </Link>
            </nav>
        </div>
    )
}
