import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { CartProvider } from '@/feature/home/components/cart-provider'

interface MyRouterContext {
  queryClient: QueryClient
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://farshmaryam.ir/#organization',
      name: 'فرش مریم',
      url: 'https://farshmaryam.ir/',
      logo: 'https://farshmaryam.ir/logo.png',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://farshmaryam.ir/#website',
      name: 'فرش مریم',
      url: 'https://farshmaryam.ir/',
      publisher: { '@id': 'https://farshmaryam.ir/#organization' },
      inLanguage: 'fa-IR',
    },
  ],
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
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
        title: 'فرش مریم | فروشگاه تخصصی فرش و قالی',
      },
      {
        name: 'description',
        content:
          'فروشگاه تخصصی فرش و قالی دستباف و ماشینی با بهترین کیفیت و قیمت در ایران',
      },
      {
        name: 'keywords',
        content: 'فرش, قالی, فرش دستباف, فرش ماشینی, فروشگاه فرش',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <HeadContent />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
