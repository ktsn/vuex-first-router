import Vue from 'vue'
import Vuex from 'vuex'
import router, { routes } from './router'
import routerPlugin from '../src'

Vue.use(Vuex)

export default new Vuex.Store({
  actions: {
    // Actions for requesting route change
    home: logAction('home'),
    foo: logAction('foo'),
    bar: logAction('bar'),
    baz: logAction('baz'),
    withParams: logAction('withParams'),
    relativeRedirect: logAction('relativeRedirect'),

    // Actions to hook after route change
    'applied:home': logAction('applied:home'),
    'applied:foo': logAction('applied:foo'),
    'applied:bar': logAction('applied:bar'),
    'applied:baz': logAction('applied:baz'),
    'applied:withParams': logAction('applied:withParams'),
    'applied:relativeRedirect': logAction('applied:relativeRedirect')
  },
  plugins: [
    routerPlugin(router, routes)
  ]
})

function logAction(type: string): any {
  return (_: any, payload: any): void => {
    console.log('dispatched - ' + type, payload)
  }
}
