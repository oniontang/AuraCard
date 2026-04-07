import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './views/HomePage.vue'
import CardPage from './views/CardPage.vue'
import CoverPage from './views/CoverPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/card', name: 'card', component: CardPage },
    { path: '/cover', name: 'cover', component: CoverPage }
  ]
})

export default router
