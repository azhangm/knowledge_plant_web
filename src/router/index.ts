import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EbookManager from '@/views/admin/EbookManager.vue'
import AboutMe from '@/views/AboutMe.vue'
import CategoryManager from "@/views/admin/CategoryManager.vue";
import DocManager from "@/views/admin/DocManager.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/admin/ebook',
    name: 'admin-ebook',
    component: EbookManager
  },
  {
    path: '/about',
    name: 'about',
    component: AboutMe
  },
  {
    path: '/admin/category/',
    name: 'admin-category',
    component: CategoryManager
  },
  {
    path: '/admin/doc/',
    name: 'admin-doc',
    component: DocManager
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].ts) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/admin/EbookManager.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
