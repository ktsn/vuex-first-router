import Vue from 'vue'
import router from './router'
import store from './store'

new Vue({
  store,
  router,
  methods: {
    go (type: string, payload: any) {
      this.$store.dispatch(type, payload)
    }
  }
}).$mount('#app')
