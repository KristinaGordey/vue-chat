<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import { io } from "socket.io-client";
const socket = io("http://localhost:5000");

const dialogs = ref([]);
const router = useRouter();

onMounted(() => {
  // явно запрашиваю диалоги (повторно)
  const name = localStorage.getItem("username"); // имя из login
  if (name) {
    socket.emit("getDialogs", name); // сервер сам найдёт юзера и вернёт
  }

  socket.on("dialogList", ({ dialogs: serverDialogs }) => {
    console.log("Диалоги пришли:", serverDialogs);
    dialogs.value = serverDialogs;
  });
});

const goToDialog = (dialogId) => {
  const name = localStorage.getItem("username");
  const pass = localStorage.getItem("password");
  router.push({
    name: "Chat",
    params: { id: dialogId },
    query: {
      name,
      pass,
    },
  });
};
</script>

<template>
  <header class="header">
    <h1 class="header__title">Ваши диалоги</h1>
  </header>
  <div class="dialogs">
    <ul class="dialogs__list">
      <li
        class="dialogs__item"
        v-for="dialog in dialogs"
        :key="dialog.id"
        @click="goToDialog(dialog.id)"
      >
        <div class="dialog contain">
          <p class="dialog__name">
            {{ dialog.participants.join(", ") }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
