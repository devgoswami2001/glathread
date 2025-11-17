import { cn } from "@/lib/utils";
import { type LucideProps, MoveRight } from "lucide-react";

export function Logo({ className, ...props }: LucideProps) {
  return (
    <div className={cn("flex items-center gap-2.5 text-foreground", className)}>
      <div className="rounded-lg bg-primary p-2 text-primary-foreground">
        <MoveRight className="h-5 w-5" />
      </div>
      <span className="font-headline text-2xl font-bold tracking-tight">TransitPro</span>
    </div>
  );
}
