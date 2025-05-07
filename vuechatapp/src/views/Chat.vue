<template>
  <div>
    <header class="header">
      <h1 v-if="companionName !== 'Chat name'" class="header__title">
        {{ companionName }}
      </h1>
    </header>
    <main class="content">
      <section class="messages contain">
        <Messages
          :messages="messages"
          :currentUser="params.name"
          @mesclick="mesclick"
        />
        <div class="messages__form-wrapper">
          <form class="message-form" @submit.prevent="handleSubmit">
            <textarea
              type="text"
              id="message-input"
              class="message-form__input input input--dark"
              placeholder="What do you want to say?"
              v-model="message"
              autocomplete="off"
            ></textarea>
            <button
              title="input"
              class="message-form__button button"
              type="submit"
            ></button>
          </form>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
//import { io } from "socket.io-client";
import { useRoute } from "vue-router";
import Messages from "@/components/Messages.vue";
import "/src/assets/style.css";
import socket from "@/socket";

//const socket = io("http://localhost:5000");

const route = useRoute();
const dialogId = route.params.id;

const messages = ref([]);
const message = ref("");
const params = reactive({
  name: localStorage.getItem("username"),
  pass: localStorage.getItem("password"),
});
const companionName = ref("Chat name");

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

  socket.on(
    "previousMessages",
    ({ messages: previousMessages, companionName: name }) => {
      messages.value = previousMessages.map((msg) => ({
        _id: msg._id,
        user: msg.user,
        message: msg.message,
        time: msg.time,
      }));
      companionName.value = name;
    }
  );

  socket.on("message", ({ data }) => {
    messages.value.push({
      _id: data.id,
      user: data.user.name,
      message: data.message,
      time: data.time,
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
