<template>
<!-- eslint-disable -->
   <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-3 px-24">
      <!-- App Name -->
     <router-link :to="{name : 'Home'}" class="text-white mr-4 uppercase text-2xl font-bold" exact-active-class="no-active">
        Music
     </router-link>
    
      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
            <li>
                <router-link class="px-2 text-white" :to="{name:'About'}">About</router-link>
              </li>
          <li v-if="!user"> 
            <a class="px-2 text-white" href="#" @click.prevent="authModalShow">Login / Register</a>
          </li>
         
          <template v-else>
              <li>
                <router-link class="px-2 text-white" :to="{name:'Manage'}">Manage</router-link>
              </li>
              <li >
                <a class="px-2 text-white" href="#" @click.prevent="logout">Logout</a>
              </li>
          </template>
          
            
        
             
        </ul>
      </div>
    </nav>
  </header>
</template>
<script>
import { ref } from '@vue/reactivity'
import {mapMutations,mapState} from 'vuex'
import { computed } from '@vue/runtime-core';
import {projectAuth} from '@/firebase/config'

// import {useStore} from 'vuex'
export default {
  name: 'Header',
  data() {
    return {
      // user: computed(()=>this.$store.state.userLogedIn)
      user: projectAuth.currentUser
    };
  },
  // computed:{
  //     ...mapState(['userLogedIn']),
  // },
  methods: {
      authModalShow() {
          // this.$store.state.authModalShow = !this.$store.state.authModalShow
          this.$store.commit('toggleAuthModel')
          console.log(this.$store.state.authModalShow)
          
          
      },
      async logout(){
        await this.$store.dispatch('signout')
        window.location.reload()
         
      }
     
      
  
    

      // ...mapMutations(['toggleAuhModal'])
  }
  
  
};
// setup(){
//   const store = useStore();

//   const authModalShow = ()=>{
//      store.commit('toggleAuthModel')
//   }
//   return{authModalShow}
    
// }
// }
</script>
<style scoped>

</style>
