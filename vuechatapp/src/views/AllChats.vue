<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

//import { io } from "socket.io-client";
import Dialog from "@/components/Dialog.vue";
import socket from "@/socket";
//const socket = io("http://localhost:5000");

const dialogs = ref([]);
const router = useRouter();

onMounted(() => {
  // явно запрашиваю диалоги (повторно)
  const name = sessionStorage.getItem("username"); // имя из login
  if (name) {
    socket.emit("getDialogs", name); // сервер сам найдёт юзера и вернёт
  }

  socket.on("dialogList", ({ dialogs: serverDialogs }) => {
    console.log("Диалоги пришли:", serverDialogs);
    dialogs.value = serverDialogs;
  });
});

const goToDialog = (dialogId) => {
  const name = sessionStorage.getItem("username");
  const pass = sessionStorage.getItem("password");
  router
    .push({
      name: "Chat",
      params: { id: dialogId },
      query: {
        name,
        pass,
      },
    })
    .then(() => router.go(0));
  //принудительно обновляю страницу потому что push не хочет
};
</script>

<template>
  <header class="header">
    <h1 class="header__title">Ваши диалоги</h1>
  </header>
  <div class="dialogs">
    <ul class="dialogs__list">
      <Dialog
        v-for="dialog in dialogs"
        :key="dialog.id"
        :dialog="dialog"
        @select="goToDialog"
      />
    </ul>
  </div>
</template>

<style scoped></style>
