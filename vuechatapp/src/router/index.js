import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Chat from "@/views/Chat.vue";
import AllChats from "@/views/AllChats.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
  },
  {
    path: "/allchats",
    name: "AllChats",
    component: AllChats,
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
