import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from "./store";
import config from "../package.json";
import { createI18n } from 'vue-i18n';
import messages from './i18n';
import { Quasar, Loading, Notify, Dialog } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'
import axios from 'axios';
import { loadScript } from "vue-plugin-load-script";
import '../public/css/common.css';

loadScript("https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=lirsakpzs5&submodules=geocoder")
.then(() => {
  console.info("Script is loaded, do something");
  axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    let token = $c.getCookie('token');
    config.headers["Authorization"] = token;
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
  axios.interceptors.response.use((res) => {
    let data = res.data;
    console.log("axios.interceptors.response data:", data);
    if(data.success == 0 && Object.prototype.hasOwnProperty.call(data, "isLogged")) {
      alert(data.message);
      window.location = "/#/login";
    } else if (data.success == 0 && Object.prototype.hasOwnProperty.call(data, "code")) {
      if(data.code == "COUPLE_EMPTY_ERROR") {
        alert(data.message);
        window.location = "/#/login";
      }
    }
    return res;
  }, function (error) {
    return Promise.reject(error);
  });
  const i18n = createI18n({
      locale: 'ko',
      fallbackLocale: 'en',
      messages
  });
  const app = createApp(App);
  const $c = {
    formatDate: function(date, type, format) {
      date = new Date(date);
      let month = date.getMonth() + 1;
      month = month >= 10 ? month : `0${month}`;
      let day = date.getDate();
      day = day >= 10 ? day : `0${day}`;
  
      let hours = date.getHours();
      hours = hours >= 10 ? hours : `0${hours}`;
      let min = date.getMinutes();
      min = min >= 10 ? min : `0${min}`;
      let sec = date.getSeconds();
      sec = sec >= 10 ? sec : `0${sec}`;
      if(type == 'date') {
        return `${date.getFullYear()}-${month}-${day}`; 
      } else if (type == 'date_ko') {
        return `${date.getFullYear()}년 ${month}월 ${day}일`; 
      } else if (type == 'date_2') {
        return `${month}.${day}`; 
      } else if (type == 'date_3') {
        return `${date.getFullYear()}-${month}-${day} ${hours}:${min}`; 
      } else {
        return `${date.getFullYear()}-${month}-${day} ${hours}:${min}:${sec}`; 
      }
    },
    setError(form, error) {
      for(var k in error) {
        if(Object.prototype.hasOwnProperty.call(form, k)) {
          form[k] = error[k];
        }
      }
    },
    tempObj(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    getCookie: function (name) {
      let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
      return value? value[2] : null;
    },
  }
  app.config.globalProperties.$store = store;
  app.config.globalProperties.$c = $c;
  app.config.globalProperties.$config = config;
  app.config.globalProperties.$axios = axios;
  console.error(`ybr version: ${config.version}`);
  app.use(Quasar, {
    plugins: {
      Loading, Notify, Dialog
    },
    config: {
      loading: { /* look at QuasarConfOptions from the API card */ }
    }
  });
  app.use(router);
  app.use(store);
  app.use(i18n);
  app.mount('#app');
})
.catch((err) => {
  console.log(err);
});




