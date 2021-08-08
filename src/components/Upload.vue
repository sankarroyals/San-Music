<template>
  <div class="col-span-1">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">Upload</span>
            <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Upload Dropbox -->
            <div
              class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
                border-gray-400 text-gray-400 transition duration-500 hover:text-white
                hover:bg-green-400 hover:border-green-400 hover:border-solid"
                :class="{'bg-green-400 border-green-400 border-solid': is_dragover}"
                @drag.prevent.stop=""
                @dragstart.prevent.stop=""
                @dragend.prevent.stop="is_dragover = false"
                @dragenter.prevent.stop="is_dragover = true"
                @dragleave.prevent.stop="is_dragover = false"
                @dragover.prevent.stop="is_dragover = true"
                @drop.prevent.stop="upload($event)"
                >
              <h5>Drop your files here</h5>
            </div>
            <input type="file" multiple @change="upload($event)" />
            <hr class="my-6" />
            <!-- Progess Bars -->
            <div class="mb-4" v-for="upload in uploads" :key="upload.name">
              <!-- File Name -->
              <div class="font-bold text-sm" :class="upload.text_class">
                <i :class="upload.icon"></i>{{upload.name}}</div>
              <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                <!-- Inner Progress Bar -->
                <div class="transition-all progress-bar " 
                :class="upload.variant"
                :style="{width: upload.current_progress + '%'}"></div>
              </div>
            </div>
           
          </div>
        </div>
      </div>
</template>

<script>
import {projectStorage} from '../firebase/config'
import {projectAuth,projectFirestore} from '@/firebase/config'
// import { ref } from "@vue/reactivity";

export default {
    data(){
        return{
            is_dragover: false,
            uploads: []
        }
    },
    // upload easily 
    methods:{

       // upload a file
        upload($event){
            this.is_dragover = false
            
            // const {files} = $event.dataTransfer
            // const files = [...$event.dataTransfer.files] // to catch the dropped file



             // both drop and input file storing in projectStorage 

            const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files] 
            files.forEach((file)=>{
                if(file.type !== 'audio/mpeg'){
                    return ;
                }

                // unable to upload in offline
                
                if(!navigator.onLine) {
                    this.uploads.push({
                      task:{},
                      current_progress:100,
                      name: file.name,
                      variant: 'bg-red-400',
                      icon: 'fas fa-times',
                      text_class: 'text-red-400'
                    })
                }


                const storageRef = projectStorage.ref()    // step 1 for storage
                const songsRef = storageRef.child(`songs/${file.name}`);    // step 2  define path
                const task = songsRef.put(file)     // step 3 for upload


                // here task(any name assigned to songsref.put()) is running so we can activate progress bar 

                // to push uploading details in array and retreive values
               
               
               const uploadIndex= this.uploads.push({     
                  task,
                  current_progress: 0,
                  name:file.name,
                  variant: 'bg-blue-400',
                  icon: 'fas fa-spinner fa-spin',
                  text_class: ''
                }) -1;


                // to get the current data info like process and snapshot is used to get updates and progress

                task.on('state_changed', (snapshot)=>{
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
                  this.uploads[uploadIndex].current_progress = progress;
                }, (error) =>{
                  this.uploads[uploadIndex].variant ='bg-red-400'
                  this.uploads[uploadIndex].icon='fas fa-times'
                  this.uploads[uploadIndex].text_class ='text-red-400'
                 
                 
                },async ()=>{
                  const song ={
                    uid: projectAuth.currentUser.uid,
                    displayName: projectAuth.currentUser.displayName,
                    original_name: task.snapshot.ref.name,
                    modified_name: task.snapshot.ref.name,
                    genre: '',
                    comment_count: 0,
                    

                  }
                  song.url = await task.snapshot.ref.getDownloadURL()   // to get the current audio url
                   await projectFirestore.collection('songs').add(song)
                   window.location.reload()
                
                  this.uploads[uploadIndex].variant ='bg-green-400'
                  this.uploads[uploadIndex].icon='fas fa-check'
                  this.uploads[uploadIndex].text_class ='text-green-400'
                 

                

                })

            })
          
            console.log(files);
        },
        cancelUploads(){
          this.uploads.forEach((upload) =>{
          upload.task.cancel()
          })
        }
    },
    beforeUnmount(){
      this.uploads.forEach((upload)=>{
          upload.task.cancel()
      })
    }

   
}
</script>

<style>

</style>