export function RouteLoading() {
  return (
    <div
      aria-label="Loading"
      aria-busy="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden"
    >
      <div className="h-full w-full animate-[route-progress_1.8s_ease-in-out_infinite] bg-accent" />
    </div>
  )
}
