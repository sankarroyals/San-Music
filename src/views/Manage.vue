<template>
<main>
     <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <Upload ref='upload'/>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <Compositionitem v-for="(song , i) in songs" :key="song.docId" 
            :updateUnsavedFlag ="updateUnsavedFlag"
            :song="song" :updateSong="updateSong" :removeSong="removeSong"/>
            
         
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
</template>

<script>
import Upload from '@/components/Upload'
import Compositionitem from '@/components/Compositionitem'

import {projectFirestore , projectAuth} from '@/firebase/config'
export default {
  name: 'manage',
  components:{
    Compositionitem,
    Upload,

  },
  
  // it runs when user created login
  async created(){
   const snapshot = await projectFirestore.collection('songs').where("uid","==",projectAuth.currentUser.uid).get();
  snapshot.forEach(doc =>{
    const song = {
      ...doc.data(),docId:doc.id
    }
    this.songs.push(song)
  })

  },
  data(){
    return{
      // to store the entire songs
      songs: [],

      // to track saved and unsaved

      unSavedFlag: false
    }
  },
  methods:{
    updateSong(i,values){
      this.songs[i].modified_name = values.modified_name
      this.songs[i].genre = values.genre
    },
    removeSong(i){
    this.songs.splice(i,1)
  },
  updateUnsavedFlag(value){
    this.unSavedFlag = value
  }
  },


  // to manage the save and unsaved details if we want to edit song name without save if you try to toggle to other page it show confirm on top

  beforeRouteLeave(to,from,next){
   if(!this.unSavedFlag){
     next()
   }
   else{
     const leave = confirm('You have Unsaved Changes are you sure to exit')
     next(leave)
   }

  }
 

 
}
</script>

<style>

</style>