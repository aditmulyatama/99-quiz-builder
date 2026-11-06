export function SiteHeader() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-extrabold text-primary-foreground"
          >
            99
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold">99 Group</span>
            <span className="text-xs text-muted-foreground">Quiz Builder</span>
          </div>
        </div>
        <p className="hidden text-xs font-medium text-muted-foreground sm:block">
          Rumah123 · 99.co
        </p>
      </div>
    </header>
  )
}
