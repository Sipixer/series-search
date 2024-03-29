/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const RecommendationsLazyImport = createFileRoute('/recommendations')()
const DejaVuLazyImport = createFileRoute('/deja-vu')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const RecommendationsLazyRoute = RecommendationsLazyImport.update({
  path: '/recommendations',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/recommendations.lazy').then((d) => d.Route),
)

const DejaVuLazyRoute = DejaVuLazyImport.update({
  path: '/deja-vu',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/deja-vu.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/deja-vu': {
      preLoaderRoute: typeof DejaVuLazyImport
      parentRoute: typeof rootRoute
    }
    '/recommendations': {
      preLoaderRoute: typeof RecommendationsLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  DejaVuLazyRoute,
  RecommendationsLazyRoute,
])

/* prettier-ignore-end */
