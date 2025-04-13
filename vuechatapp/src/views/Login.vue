<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { io } from "socket.io-client";
import "../assets/main.css";

const socket = io("http://localhost:5000");

const name = ref("");
const pass = ref("");
const error = ref("");

const router = useRouter();
const route = useRoute();

const handleSubmit = () => {
  console.log("Отправка формы", name.value, pass.value);
  if (name.value && pass.value) {
    socket.emit("join", {
      name: name.value,
      pass: pass.value,
    });
  }
};

socket.on("authorized", () => {
  localStorage.setItem("username", name.value);
  localStorage.setItem("password", pass.value);

  router.push({
    name: "AllChats",
  });
});

socket.on("error", ({ message }) => {
  error.value = message;
});
</script>

<template>
  <header class="header">
    <h2 class="header-title">Chat name</h2>
  </header>
  <main class="content">
    <h1 class="visually-hidden">Chat</h1>
    <section class="enter-container">
      <h2 class="visually-hidden">Enter login and password form</h2>
      <div class="enter-body container">
        <form class="enter-form" @submit.prevent="handleSubmit">
          <div class="enter-form-body">
            <div class="enter-form-field">
              <label class="enter-form-title" htmlFor="login">Login</label>
              <input
                id="name"
                type="text"
                v-model="name"
                class="enter-form-input input"
                placeholder="Введите имя"
                autoComplete="off"
                required
              />
            </div>
            <div class="enter-form-field">
              <label class="enter-form-title" htmlFor="password"
                >Password</label
              >
              <input
                id="pass"
                type="text"
                v-model="pass"
                class="enter-form-input input"
                placeholder="Введите пароль"
                autoComplete="off"
                required
              />
              <h6 v-if="error" class="error">{{ error }}</h6>
            </div>
            <button type="submit" class="enter-form-button">Login</button>
          </div>
        </form>
      </div>
    </section>
  </main>
  <footer></footer>
</template>
<style>
.error {
  color: red;
}
</style>
