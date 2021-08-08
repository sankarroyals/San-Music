/* eslint-disable linebreak-style */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/tailwind.css';
import {projectAuth} from '@/firebase/config'
import './assets/main.css';
import VeeValidatePlugin from './plugins/validation';
import icon from './directives/icon'
import i18n from './plugins/i18n'
import GlobalComponents from './plugins/_globals'
import './registerServiceWorker'


let app;
projectAuth.onAuthStateChanged(()=>{
    if(!app){
        const app = createApp(App).use(i18n);

        app.use(store);
        app.use(router);
        app.use(VeeValidatePlugin)
        app.use(GlobalComponents)

        app.directive('icon',icon)

    
        app.mount('#app');
    }
  

})

