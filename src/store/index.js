import { createStore } from 'vuex';
import {projectFirestore,projectAuth} from '@/firebase/config.js'

// format time
import TimeFormat from '../plugins/TimeFormat';
// javascript audio library
import {Howl} from 'howler'


const store = createStore({
  state: {
    authModalShow: false,
    userLogedIn: false,
    currentSong:{},
    sound:{},
    seek: '00:00',
    duration: '00:00',
    playerProgress:'0%'
  },
  mutations: {
    toggleAuthModel: (state) => {
      state.authModalShow = !state.authModalShow
      console.log(state.authModalShow);
    },
    toggleAuth: (state) => {
      state.userLogedIn = !state.userLogedIn
      console.log(state.userLogedIn)
    },
    newSong: (state,payload)=>{
      state.currentSong = payload
      state.sound = new Howl({
        src: [payload.url],
        html5: true,

      })
    },

    //progress bar
    updatePosition(state){
      state.seek = TimeFormat.formatTime (state.sound.seek())
      state.duration = TimeFormat.formatTime(state.sound.duration())

      // calculation for song progress
      state.playerProgress = (state.sound.seek()/state.sound.duration())* 100 + '%'
    }
  },
  getters: {
    authModalShow: (state) => {
      return state.authModalShow
      
    },
    playing :(state) =>{
      if(state.sound.playing){
        return state.sound.playing()
      }
      return false
    }
  },
  // actions: {
    // async register({commit},values) {
    //  const userCred = await projectAuth.createUserWithEmailAndPassword(values.email, values.password)
    //  console.log(userCred);
       
    //   await projectFirestore.collection('users').doc(userCred.user.uid).set({

    //     name: values.name,
    //     email: values.email,
    //     age: values.age,
    //     country: values.country,


    //   })
      // await userCred.user.updateProfile({
      //   displayName:values.name

      // })
  //     commit('toggleAuth')
  //   },
  // },
  // async login({commit},values){
  //   await projectAuth.signInWithEmailAndPassword(values.email,values.password)
   
  //   commit('toggleAuth')

  // },
    // init_login({commit}){
    //   const user = projectAuth.currentUser
    //   if(user){
    //     commit('toggleAuth')
    //   },
  //   async signout({commit}){
  //       await projectAuth.signout()
  //       commit('toggleAuth')
  //   }
    
 
  
  // },
  actions:{
    async register({commit},values) {
      const userCred = await projectAuth.createUserWithEmailAndPassword(values.email, values.password)
      console.log(userCred);
        
       await projectFirestore.collection('users').doc(userCred.user.uid).set({
 
         name: values.name,
         email: values.email,
         age: values.age,
         country: values.country,
 
 
       })
       await userCred.user.updateProfile({
        displayName:values.name

      })
       commit('toggleAuth')
    },
    async login({commit},values){
      
      await projectAuth.signInWithEmailAndPassword(values.email,values.password)
     
     

      commit('toggleAuth')

    },
    init_login({commit}){
      const user = projectAuth.currentUser
      if(user){
        commit('toggleAuth')
      }
    },
    async signout({commit}){
      await projectAuth.signOut()
      commit('toggleAuth')
    },

    // new song 
    async newSong({commit,state,dispatch},payload){
      // not to play two audios at a time
      if(state.sound instanceof Howl){
        state.sound.unload()

      }
      

      // step 1
      commit('newSong',payload)
      state.sound.play()


      
      // progress bar
      state.sound.on('play',()=>{
        requestAnimationFrame(()=>{
          dispatch('progress')
        })
      })
    },
    async toggleAudio({state}){
      if(!state.sound.playing) {
        return
      }
      if(state.sound.playing()){
        state.sound.pause()
      }
      else{
        state.sound.play()
      }

    },
    progress({commit,state,dispatch}){
      commit('updatePosition')
      if(state.sound.playing()){
        requestAnimationFrame(()=>{
          dispatch('progress')
        })
      }

    },


    // updateSeek       from player.vue
    updateSeek({state,dispatch},payload){

      // if audio is playing click anywhere to stop or update
      if(state.sound.playing){
        return
      }
      const { x , width} = payload.currentTarget.getBoundingClientRect()
      // clientX is a property to move x coordinate
      const clickX = payload.clientX - x;
      const percentage = clickX / width;
      const seconds = state.sound.duration()*percentage
      state.sound.seek(seconds)

      state.sound.once('seek' , ()=>{
        dispatch('progress')
      })



    }
  }
 
});
export default store;