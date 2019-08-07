import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'resolver',
      component: require('@/views/ResolverForm').default
    },
    {
      path: '/resolver',
      name: 'resolver',
      component: require('@/views/ResolverForm').default
    },
    {
      path: '/createdid',
      name: 'createdid',
      component: require('@/views/CreateDID').default
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: require('@/views/Wallet').default
    }
  ]
})
