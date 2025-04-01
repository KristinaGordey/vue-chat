<template>
  <div>
    <header class="header">
      <h2 class="header__title header__title-chat">
        <span>Chat Room: {{ params.pass }}</span>
        <div class="users">Messages: {{ messages.length }}</div>
      </h2>
    </header>
    <header class="header">
      <h2 class="header__title header__title-chat">
        <span>Chat name</span>

        <div class="{styles.users}">0 users in this room</div>
      </h2>
    </header>
    <main class="content">
      <h1 class="visually-hidden">Chat</h1>
      <section class="messages container">
        <h2 class="visually-hidden">Messages area</h2>
        <div class="messages__area">
          <ul class="messages__list">
            <li
              v-for="(msg, index) in messages"
              :key="index"
              :class="{
                'message--mine': msg.user === params.user,
                'message--others': msg.user !== params.user,
              }"
            >
              <strong>{{ msg.user }}</strong
              >: {{ msg.message }}
            </li>
          </ul>
        </div>
        <div class="message__enter contain">
          <form class="message__enter-form" @submit.prevent="handleSubmit">
            <label htmlFor="message-input" class="visually-hidden"
              >Message</label
            >
            <input
              type="text"
              id="message-input"
              class="message__enter-input input"
              placeholder="What do you want to say?"
              v-model="message"
            />
            <button title="input" class="message__enter-button" type="submit">
              <span class="visually-hidden">Send message</span>
            </button>
          </form>
        </div>
      </section>
    </main>
    <footer></footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { io } from "socket.io-client";
import { useRoute } from "vue-router";
import "/src/assets/main.css";

const socket = io("http://localhost:5000");
const params = reactive({ name: "", pass: "" });
const messages = ref([]);
const message = ref("");

const route = useRoute();
onMounted(() => {
  const searchParams = Object.fromEntries(new URLSearchParams(route.query));
  params.pass = searchParams.pass;
  params.user = searchParams.name;
  socket.emit("join", searchParams);
  console.log(searchParams);
  if (!searchParams.name || !searchParams.pass) {
    console.error("Ошибка: имя пользователя или пароль отсутствуют.");
    return;
  }

  socket.on("message", ({ data }) => {
    console.log("Получено сообщение: ", data);
    messages.value.push({ user: data.user.name, message: data.message });
  });
});

const handleSubmit = () => {
  if (!message.value) return;
  socket.emit("sendMessage", { message: message.value, params });
  message.value = "";
};
</script>

<style scoped></style>
