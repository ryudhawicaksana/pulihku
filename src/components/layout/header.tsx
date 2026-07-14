import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/layout/logo";

export function Header() {
  return (
    <header className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <Logo />
      </div>
      <Avatar className="w-8 h-8 border border-border">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </header>
  );
}
