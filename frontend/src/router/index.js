import { createRouter, createWebHashHistory } from "vue-router";
import homeVue from "../views/home.vue";
import loginVue from "../views/login.vue";
import errorVue from "../views/error.vue";

const routes = [
    { path: "/", name: "home", component: homeVue, label: "홈화면", },
    { path: "/home", name: "home", component: homeVue, label: "홈화면", },
    { path: "/login", name: "login", component: loginVue, label: "로그인", },
    { path: "/error", name: "error", component: errorVue, label: "404", },

    { path: "/:pathMatch(.*)*", redirect: "/error" },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from) => {
    console.error(`from: ${from.fullPath}, to: ${to.fullPath}`);
});

export default router;