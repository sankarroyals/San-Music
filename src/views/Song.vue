<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          class="
            z-50
            h-24
            w-24
            text-3xl
            bg-white
            text-black
            rounded-full
            focus:outline-none
          "
          @click.prevent="newSong(song)"
        >
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">Comments {{ song.comment_count }}</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-if="comment_show_alert"
            :class="comment_alert_variant"
          >
            {{ comment_alert_message }}
          </div>
          <vee-form
            :validation-schema="schema"
            @submit="addComment"
            v-if="user"
          >
            <vee-field
              as="textarea"
              name="comment"
              class="
                block
                w-full
                py-1.5
                px-3
                text-gray-800
                border border-gray-300
                transition
                duration-500
                focus:outline-none
                focus:border-black
                rounded
                mb-4
                z-0
              "
              placeholder="Your comment here..."
              v-model="com"
            ></vee-field>
            <!-- <ErrorMessage class="text-red-600" name="comment"/> -->
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="comment_in_submission"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            v-model="sort"
            class="
              block
              mt-4
              py-1.5
              px-3
              text-gray-800
              border border-gray-300
              transition
              duration-500
              focus:outline-none
              focus:border-black
              rounded
            "
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.id"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { projectFirestore, projectAuth } from "@/firebase/config";
import { mapState, mapActions } from "vuex";
// import { timestamp } from '../firebase/config'
export default {
  name: "Song",
  // to get sorting comments new and old
  computed: {
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === "1") {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },

  async created() {
    // this.$route.params.id is used to get certain id
    const docSnapshot = await projectFirestore
      .collection("songs")
      .doc(this.$route.params.id)
      .get();
    if (!docSnapshot.exists) {
      this.$router.push({
        name: "Home",
      });
      return;
    }
    // after watch
    const { sort } = this.$route.query;
    this.sort = sort === "1" || sort === "2" ? sort : "1";

    this.song = docSnapshot.data();
    this.getComments();
  },
  data() {
    return {
      song: {},
      user: projectAuth.currentUser,
      schema: {
        comment: "min:1",
      },
      sort: 1,
      comments: [],
      com: "",
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: "bg-blue-500",
      comment_alert_message: "Please wait! comment subbmission is in progress",
    };
  },

  methods: {
    //playing song only ...mapActions
    ...mapActions(["newSong"]),

    async addComment(values) {
      (this.comment_in_submission = true),
        (this.comment_show_alert = true),
        (this.comment_alert_variant = "bg-blue-500"),
        (this.comment_alert_message =
          "Please wait! comment subbmission is in progress");
      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: projectAuth.currentUser.displayName,
        uid: projectAuth.currentUser.uid,
      };
      await projectFirestore.collection("comments").add(comment);
      this.song.comment_count += 1; // incrementing comment

      // adding comment into songs firestore
      await projectFirestore
        .collection("songs")
        .doc(this.$route.params.id)
        .update({
          comment_count: this.song.comment_count,
        });

      (this.comment_show_alert = true),
        (this.comment_in_submission = false),
        (this.comment_alert_variant = "bg-green-500");
      this.comment_alert_message = "comment is posted";
      this.com = "";
    },
    async getComments() {
      const snapshots = await projectFirestore
        .collection("comments")
        .where("sid", "==", this.$route.params.id)
        .get();
      this.comments = [];
      snapshots.forEach((doc) => {
        this.comments.push({
          ...doc.data(),
          id: doc.id,
        });
      });
    },
  },

  // query parameter watch is used to update and detect
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }
      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
};
</script>

<style>
</style>