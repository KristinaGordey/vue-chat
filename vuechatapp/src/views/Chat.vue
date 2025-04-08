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
          :currentUser="params.user || 'Guest'"
          @mesclick="mesclick"
        ></Messages>

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
            <!-- <VueChatEmojiComponent />-->
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
import { VueChatEmojiComponent } from "@nguyenvanlong/vue3-chat-emoji";
import "@nguyenvanlong/vue3-chat-emoji/dist/index.mjs.css";

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

  if (!searchParams.name || !searchParams.pass) {
    console.error("Ошибка: имя пользователя или пароль отсутствуют.");
    return;
  }

  socket.on("previousMessages", (previousMessages) => {
    messages.value = previousMessages.map((msg) => ({
      _id: msg._id,
      user: msg.user,
      message: msg.message,
      time: msg.time,
    }));
  });

  socket.on("message", ({ data }) => {
    console.log("Получено сообщение: ", data);
    messages.value.push({
      _id: data.message.id,
      user: data.user.name,
      message: data.message,
    });
  });

  socket.on("messageDeleted", ({ messageId }) => {
    console.log("Удалено сообщение с ID:", messageId);
    messages.value = messages.value.filter((msg) => msg._id !== messageId);
    //обновить, иначе не видит id
  });
});

const mesclick = (mesid) => {
  console.log(mesid);
  socket.emit("delete", { mesid });
};

const handleSubmit = () => {
  if (!message.value) return;
  socket.emit("sendMessage", { message: message.value, params });
  message.value = "";
};

const emojiClick = () => {};
</script>
