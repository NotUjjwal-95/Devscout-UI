export const routes = {
  overview: '/',
  pipeline: '/pipeline',
  plan: '/plan',
  sources: '/sources',
  explanation: '/explanation',
  conceptMap: '/concept-map',
  practice: '/practice',
} as const

export type RouteKey = keyof typeof routes
