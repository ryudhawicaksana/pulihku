import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity } from "lucide-react";

export function Header() {
  return (
    <header className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary-foreground" />
        </div>
        <h1 className="font-bold text-lg tracking-tight text-foreground">Pulihku</h1>
      </div>
      <Avatar className="w-8 h-8 border border-border">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </header>
  );
}
