export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-4 flex items-center justify-between px-6 text-sm text-muted-foreground">
      <div className="flex items-center gap-4">
        <span>© {new Date().getFullYear()} Next.js App Template</span>
        <span className="text-xs opacity-60 px-2 py-0.5 rounded border">v1.0.0</span>
      </div>
      <div className="text-xs">
        Ready for upcoming projects
      </div>
    </footer>
  );
}
