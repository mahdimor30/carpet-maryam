import { createFileRoute } from '@tanstack/react-router'
import { createRouteHandler } from 'uploadthing/server'
import { uploadRouter } from '../../server/uploadthing'

const utHandler = createRouteHandler({
  router: uploadRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  },
})

export const Route = createFileRoute('/api/uploadthing')({
  server: {
    handlers: {
      GET: ({ request }) => utHandler(request),
      POST: ({ request }) => utHandler(request),
    },
  },
})