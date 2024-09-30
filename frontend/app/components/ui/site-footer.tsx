import {siteConfig} from "@/config/site";

export function SiteFooter() {
    return (
        <footer className="sticky bottom-0 w-full py-6 md:px-8 md:py-0 bg-transparent">
            <div className="container flex flex-col items-center justify-center md:h-8 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground">
                    Built by{" "}
                    <a
                        href='https://www.linkedin.com/in/mahfooz-alam-36b93023a/'
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                    >
                        Mahfooz
                    </a>
                </p>
            </div>
        </footer>
    );
}
