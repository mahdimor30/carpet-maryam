import { config } from '@/server/config'

type SeoOptions = {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

export function createSeo({
  title,
  description,
  path = '/',
  image = config.defaultOgImage,
  type = 'website',
  noIndex = false,
}: SeoOptions) {
  const fullTitle = path === '/' ? title : `${title} | ${config.siteName}`

  const url = new URL(path, config.siteUrl).toString()
  const imageUrl = new URL(image, config.siteUrl).toString()

  return {
    meta: [
      {
        title: fullTitle,
      },
      {
        name: 'description',
        content: description,
      },
      {
        name: 'robots',
        content: noIndex ? 'noindex, nofollow' : 'index, follow',
      },

      // Open Graph
      {
        property: 'og:title',
        content: fullTitle,
      },
      {
        property: 'og:description',
        content: description,
      },
      {
        property: 'og:type',
        content: type,
      },
      {
        property: 'og:url',
        content: url,
      },
      {
        property: 'og:image',
        content: imageUrl,
      },
      {
        property: 'og:locale',
        content: config.locale,
      },
      {
        property: 'og:site_name',
        content: config.siteName,
      },

      // Twitter
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: fullTitle,
      },
      {
        name: 'twitter:description',
        content: description,
      },
      {
        name: 'twitter:image',
        content: imageUrl,
      },
    ],

    links: [
      {
        rel: 'canonical',
        href: url,
      },
    ],
  }
}
