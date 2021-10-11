import { createRouter, createWebHistory } from 'vue-router' ;
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Manage from '@/views/Manage.vue'
import NotFound from '@/views/NotFound.vue'
import Song from '@/views/Song.vue'
import {projectAuth} from '@/firebase/config'
const routerAuth = (to,from,next) =>{
  let user = projectAuth.currentUser;
  if(!user){
    next({name:'Home'})
  }
  else{
    next()
  }

}



const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path:'/manage',
    alias: '/manage-music',
    name:'Manage',
    component: Manage,
    beforeEnter: routerAuth,
    meta:{
      requiresAuth:true,
    }
  },
  {
    path:'/:catchAll(.*)',
    name:'notfound',
    component: NotFound
  },
  {
    path:'/song/:id',
    name:'song',
    component: Song
  },

  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500'     //  it makes every active class to yellow
});
//another way for route guard
router.beforeEach((to,from,next)=>{
  
  next()

})

export default router;
