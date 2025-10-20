import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth-pages)/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth-pages)/login"!</div>
}
