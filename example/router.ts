import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'

Vue.use(Router)

const Home = { template: '<router-view></router-view>' }
const Default = { template: '<div>default</div>' }
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const Baz = { template: '<div>baz</div>' }
const WithParams = { template: '<div>{{ $route.params.id }}</div>' }
const Foobar = { template: '<div>foobar</div>' }
const FooBar = { template: '<div>FooBar</div>' }

export const routes: RouteConfig[] = [
  { path: '/', component: Home,
    children: [
      { path: '', name: 'home', component: Default },
      { path: 'foo', name: 'foo', component: Foo },
      { path: 'bar', name: 'bar', component: Bar },
      { path: 'baz', name: 'baz', component: Baz },
      { path: 'with-params/:id', name: 'withParams', component: WithParams },
      // relative redirect to a sibling route
      { path: 'relative-redirect', name: 'relativeRedirect', redirect: 'foo' }
    ]
  },
  // absolute redirect
  { path: '/absolute-redirect', redirect: '/bar' },
  // dynamic redirect, note that the target route `to` is available for the redirect function
  { path: '/dynamic-redirect/:id?',
    redirect: to => {
      const { hash, params, query } = to
      if (query.to === 'foo') {
        return { path: '/foo', query: null }
      }
      if (hash === '#baz') {
        return { name: 'baz', hash: '' }
      }
      if (params.id) {
        return '/with-params/:id'
      } else {
        return '/bar'
      }
    }
  },
  // named redirect
  { path: '/named-redirect', redirect: { name: 'baz' }},

  // redirect with params
  { path: '/redirect-with-params/:id', redirect: '/with-params/:id' },

  // redirect with caseSensitive
  { path: '/foobar', component: Foobar, caseSensitive: true },

  // redirect with pathToRegexpOptions
  { path: '/FooBar', component: FooBar, pathToRegexpOptions: { sensitive: true }},

  // catch all redirect
  { path: '*', redirect: '/' }
]

export default new Router({
  mode: 'history',
  routes
})

