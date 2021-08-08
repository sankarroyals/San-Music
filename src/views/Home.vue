<template>
 <main>
   
    <!-- Introduction -->
  <section class="mb-8 py-20 text-white text-center relative">
    <div
      class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"
    ></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
        <p class="w-full md:w-8/12 mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dolor mollis, congue augue non, venenatis elit. Nunc justo eros,
          suscipit ac aliquet imperdiet, venenatis et sapien. Duis sed magna
          pulvinar, fringilla lorem eget, ullamcorper urna.
        </p>
      </div>
    </div>

    <img
      class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="assets/img/introduction-music.png"
    />
  </section>

  <!-- Main Content -->
  <section class="container mx-auto">
    <div
      class="
        bg-white
        rounded
        border border-gray-200
        relative
        flex flex-col
        m-24
        mb-8
      "
    >
    
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200" v-icon.right.yellow="'headphones-alt'">      
        <span class="card-title">Songs</span>
        <!-- Icon -->
        
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <Songitem v-for="song in songs" :key="song.id" :song="song" />
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section>
 </main>
</template>

<script>
import { projectFirestore } from "@/firebase/config";

import Songitem from "../components/Songitem.vue";
import Button from '../components/base/button.vue';
export default {
  name: "Home",
  async created() {
    this.getSongs();

    // infinite scrolling step 1
    window.addEventListener("scroll", this.handleScroll);
  },
  components: {
    Songitem,
    Button,
  },
  data() {
    return {
      songs: [],
      maxPer: 25,
      pendingReq: false,
    };
  },

  // step 2 infinite scroll removing
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    async getSongs() {
      if (this.pendingReq) {
        return;
      }
      this.pendingReq = true;
      let snapshots;
      if (this.songs.length) {
        // get last elementid
        const lastDoc = await projectFirestore
          .collection("songs")
          .doc(this.songs[this.songs.length - 1].id).get();

        // limit() is used to get maximum for page
        snapshots = await projectFirestore
          .collection("songs")
          .orderBy("modified_name")
          .startAfter(lastDoc) // start After query
          .limit(this.maxPer)
          .get(); // limit query used to limit the value
       
      } else {
        snapshots = await projectFirestore
          .collection("songs")
          .orderBy("modified_name")
          .limit(this.maxPer)
          .get();
      }
       snapshots.forEach((doc) => {
          this.songs.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        this.pendingReq=false
    },

    // step 3 scrolling
    handleScroll() {
      // we need to destructure it just for readabilty
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomOfWindow =
        Math.round(scrollTop) + innerHeight === offsetHeight;
      if (bottomOfWindow) {
        this.getSongs();
      }
    },
  },
};
</script>

<style>
</style>
