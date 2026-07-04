import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function Breadcrumbs({
  items,
  className,
}: {
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex flex-wrap items-center gap-1.5 text-sm", className)}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 ? (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-primary-200/70" aria-hidden />
            ) : null}
            {last || !item.href ? (
              <span className={last ? "font-medium text-white" : "text-primary-100/80"}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-primary-100/80 transition hover:text-white"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
