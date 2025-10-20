import type { ReactNode } from 'react'
import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Newsify',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({
    children
}: Readonly<{
    children: ReactNode
}>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackRouterDevtools
          position='bottom-right'
        />
        <Scripts />
      </body>
    </html>
  )
}