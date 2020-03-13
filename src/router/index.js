// import Vue from 'vue'
// import Router from 'vue-router'

// import Betting from '../components/Betting'

// import store from '../store' // your vuex store 

// const ifNotAuthenticated = (to, from, next) => {
//   if (!store.getters.isAuthenticated) {
//     next()
//     return
//   }
//   next('/')
// }

// const ifAuthenticated = (to, from, next) => {
//   if (store.getters.isAuthenticated) {
//     next()
//     return
//   }
//   next('/login')
// }



// Vue.use(Router)

// export default new Router({
//   mode: 'history', // https://blog.csdn.net/tom_wong666/article/details/82670582
//   routes: [
//     {
//         path: '/Betting',
//         name: 'Betting',
//         component: Betting,
//     }
//   ]
// })