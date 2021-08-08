<template>
            <!-- Login Form -->
         
            <vee-form v-show="tab === 'login'" :validation-schema='loginschema' @submit="login">
                 <div class="text-white text-center font-bold p-5 mb-4" v-if="log_show_alert"
                :class="log_alert_variant">
                {{log_alert_msg}}
            </div>
            <!-- Email -->
            <div class="mb-3">
              <label class="inline-block mb-2">Email</label>
              <vee-field type="email" name="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email" />
              <ErrorMessage class="text-red-600" name='email'/>
            </div>
            <!-- Password -->
            <div class="mb-3">
              <label class="inline-block mb-2">Password</label>
              <vee-field type="password" name="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Password" />
               <ErrorMessage class="text-red-600" name='password'/>
            </div>
            <button type="submit"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700">
              Submit
            </button>
          </vee-form>
</template>

<script>
import {projectFirestore,projectAuth} from '@/firebase/config.js'
export default {
    name:'Login',
    props:['tab'],
    data(){
        return{
        loginschema:{
        email:'required|min:3|max:100|email',
        password:'required|min:6|max:12',
         },
      log_alert_variant:'bg-blue-500',
      log_alert_msg:'please wait! we are loging you in',
      log_in_submission:false,
      log_show_alert:false,
        }
    },
    methods:{
      async login(values){
     
      this.log_show_alert = true
      this.log_in_submission=true
      this.log_alert_variant='bg-blue-500',
      this.log_alert_msg='please wait! Your account is creating'
      
      try {
          await this.$store.dispatch('login',values)
          // await projectAuth.signInWithEmailAndPassword(values.email,values.password)

      }catch(err){
            
              this.log_in_submission=false,
               this.log_alert_variant='bg-red-500',
               this.log_alert_msg='Invalid login details please check again'
               return
      }

      this.log_alert_variant = 'bg-green-500',
      this.log_alert_msg='Success! You Logged in',
      window.location.reload()

      console.log(values);
    },
    
    }

}
</script>

<style>

</style>