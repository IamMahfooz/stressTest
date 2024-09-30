import {MainNavItem, SidebarNavItem} from "@/types/nav"

//
interface DocsConfig {
    mainNav: MainNavItem[]
    sidebarNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
    mainNav: [
        {
            title: "Problems",
            // href: "#",
        },
    ],
    sidebarNav: [
        {
            title: "Getting Started",
            // href: "#",
            items: [],
        },
        {
            title: "Components",
            items: [],
            // href: "#",
        },
    ],
}
