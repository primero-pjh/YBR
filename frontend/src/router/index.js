import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import homeVue from "../views/home.vue";
import loginVue from "../views/login.vue";
import waitingVue from "../views/login/waiting.vue";
import signupVue from "../views/login/signup.vue";
import chatVue from "../views/chat.vue";
import calendarVue from "../views/calendar.vue";
import communityVue from "../views/community.vue";
import profileVue from "../views/profile.vue";
import errorVue from "../views/error.vue";

/* admin */
import _homeVue from "../views/admin/home.vue";
import _dbVue from "../views/admin/db.vue";
import _personVue from "../views/admin/user/person.vue";
import _coupleVue from "../views/admin/user/couple.vue";

import store from "../store";

const routes = [
    /* default-user */
    { path: "/", name: "home", component: homeVue, label: "홈화면", },
    { path: "/home", name: "home", component: homeVue, label: "홈화면", },
    { path: "/login", name: "login", component: loginVue, label: "로그인", },
    { path: "/login/waiting", name: "waiting", component: waitingVue, label: "대기", },
    { path: "/login/signup", name: "signup", component: signupVue, label: "회원가입", },
    { path: "/chat", name: "chat", component: chatVue, label: "채팅", },
    { path: "/calendar", name: "calendar", component: calendarVue, label: "캘린더", },
    { path: "/community", name: "community", component: communityVue, label: "커뮤니티", },
    { path: "/profile", name: "profile", component: profileVue, label: "커뮤니티", },

    /* admin */
    { path: "/admin/home", name: "admin_home", component: _homeVue, label: "홈화면", },
    { path: "/admin/db", name: "admin_db", component: _dbVue, label: "DATABASE", },
    { path: "/admin/user/person", name: "admin_person", component: _personVue, label: "DATABASE", },
    { path: "/admin/user/couple", name: "admin_couple", component: _coupleVue, label: "DATABASE", },

    /*error*/
    { path: "/error", name: "error", component: errorVue, label: "404", },
    { path: "/:pathMatch(.*)*", redirect: "/error" },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    console.error(`from: ${from.fullPath}, to: ${to.fullPath}`);
    if(!store.state.UID) {
        // console.log("to.path:",to.path);
        if(!to.path.includes('/login')) {
            router.push('/login');
            // window.location.href = "/#/login";
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;