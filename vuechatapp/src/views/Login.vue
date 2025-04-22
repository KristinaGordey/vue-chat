<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { io } from "socket.io-client";
import "../assets/style.css";

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
        <h1 class="header__title">Chat name</h1>
    </header>
    <main class="content">
        <section class="login">
            <h2 class="visually-hidden">Enter login and password form</h2>
            <div class="login__body contain">
                <form class="login-form" @submit.prevent="handleSubmit">
                    <div class="login-form__body">
                        <div class="login-form__field field">
                            <label class="field__label" htmlFor="login"
                                >Login</label
                            >
                            <input
                                id="name"
                                type="text"
                                v-model="name"
                                class="field__input input"
                                placeholder="Введите имя"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div class="login-form__field field">
                            <label class="field__label" htmlFor="password"
                                >Password</label
                            >
                            <input
                                id="pass"
                                type="text"
                                v-model="pass"
                                class="field__input input"
                                placeholder="Введите пароль"
                                autoComplete="off"
                                required
                            />
                            <p v-if="error" class="error-message">
                                {{ error }}
                            </p>
                        </div>
                        <button type="submit" class="login-form__button button">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </section>
    </main>
</template>
