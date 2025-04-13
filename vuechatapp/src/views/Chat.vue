<template>
  <div>
    <header class="header">
      <h2 class="header__title header__title-chat">
        <span>Chat name</span>
        <div class="visually-hidden">0 users in this room</div>
      </h2>
    </header>
    <main class="content">
      <h1 class="visually-hidden">Chat</h1>
      <section class="messages contain">
        <h2 class="visually-hidden">Messages area</h2>

        <Messages
          :messages="messages"
          :currentUser="params.name"
          @mesclick="mesclick"
        />

        <div class="message__enter">
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
              autocomplete="off"
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
import Messages from "@/components/Messages.vue";
import "/src/assets/main.css";

const socket = io("http://localhost:5000");

const route = useRoute();
const dialogId = route.params.id;

const messages = ref([]);
const message = ref("");
const params = reactive({
  name: localStorage.getItem("username"),
  pass: localStorage.getItem("password"),
});

onMounted(() => {
  if (!params.name || !params.pass) {
    console.error("Нет логина или пароля");
    return;
  }
  console.log("Отправляем join с:", {
    name: params.name,
    pass: params.pass,
    dialogId,
  });

  socket.emit("join", {
    name: params.name,
    pass: params.pass,
    dialogId,
  });

  socket.on("previousMessages", (previousMessages) => {
    messages.value = previousMessages.map((msg) => ({
      _id: msg._id,
      user: msg.user,
      message: msg.message,
      time: msg.time,
    }));
  });

  socket.on("message", ({ data }) => {
    messages.value.push({
      _id: data.id,
      user: data.user.name,
      message: data.message,
    });
  });

  socket.on("messageDeleted", ({ messageId }) => {
    messages.value = messages.value.filter((msg) => msg._id !== messageId);
  });
});

const handleSubmit = () => {
  if (!message.value) return;

  socket.emit("sendMessage", {
    message: message.value,
    params,
    dialogId,
  });

  message.value = "";
};

const mesclick = (mesid) => {
  socket.emit("delete", { mesid, dialogId });
};
</script>
