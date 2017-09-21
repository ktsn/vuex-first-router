import Router, { RouteConfig, Route, Location } from 'vue-router'
import { Store, Action, Mutation } from 'vuex'

const APPLIED_PREFIX = 'applied:'

export default function vuexRouterPlugin(router: Router, routes: RouteConfig[]) {
  return (store: Store<any>): void => {
    const routeNames = extractRouteNames(routes)

    store.registerModule('route', {
      state: cloneRoute(router.currentRoute),
      actions: routeNames.reduce((acc, name) => {
        acc[name] = createRequestAction(name, router)
        acc[APPLIED_PREFIX + name] = createApplyAction(name)
        return acc
      }, {} as any),

      mutations: routeNames.reduce((acc, name) => {
        acc[APPLIED_PREFIX + name] = createApplyMutation(store)
        return acc
      }, {} as any)
    })

    router.afterEach((to, from) => {
      if (!to.name || routeNames.indexOf(to.name) < 0) return

      store.dispatch(APPLIED_PREFIX + to.name, { to, from })
    })
  }
}

function createRequestAction(type: string, router: Router): Action<any, {}> {
  return ({ dispatch }, payload = {}) => {
    const resolved = router.resolve(Object.assign({}, payload, { name: type }))
    router.push(resolved.location)
  }
}

function createApplyAction(type: string): Action<any, {}> {
  return ({ commit }, payload) => {
    commit(APPLIED_PREFIX + type, payload)
  }
}

function createApplyMutation(store: Store<any>): Mutation<any> {
  return (state, payload) => {
    store.state.route = cloneRoute(payload.to, payload.from)
  }
}

function cloneRoute (to: Route, from?: Route) {
  const clone = {
    name: to.name,
    path: to.path,
    hash: to.hash,
    query: to.query,
    params: to.params,
    fullPath: to.fullPath,
    meta: to.meta
  } as any
  if (from) {
    clone.from = cloneRoute(from)
  }
  return Object.freeze(clone)
}

function extractRouteNames(routes: RouteConfig[]): string[] {
  function loop(acc: string[], routes: RouteConfig[]): string[] {
    if (routes.length === 0) {
      return acc
    }

    const childNames = filterMap(routes, route => route.name)
    const flatChildren = flatMap(routes, route => route.children || [])
    return loop(childNames, flatChildren)
  }
  return loop([], routes)
}

function filterMap<T, R>(list: T[], fn: (item: T) => R | null | undefined): R[] {
  return list.filter(fn).map(fn) as R[]
}

function flatMap<T, R>(list: T[], fn: (item: T) => R[]): R[] {
  return list.map(fn).reduce((acc, child) => {
    return acc.concat(child)
  }, [])
}

