<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import "../assets/main.css";

const name = ref("");
const pass = ref("");
const router = useRouter();

const handleSubmit = () => {
  if (name.value && pass.value) {
    router.push({
      name: "Chat",
      query: {
        name: name.value,
        pass: pass.value,
      },
    });
  }
};
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
            </div>
            <button type="submit" class="enter-form-button">Login</button>
          </div>
        </form>
      </div>
    </section>
  </main>
  <footer></footer>
</template>
