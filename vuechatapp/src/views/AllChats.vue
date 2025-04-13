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
  <div class="dialog-list-container">
    <h2 class="title">Ваши диалоги</h2>
    <ul class="dialog-list">
      <li
        class="dialog-item"
        v-for="dialog in dialogs"
        :key="dialog.id"
        @click="goToDialog(dialog.id)"
      >
        <div class="dialog-card">
          <p class="dialog-name">{{ dialog.participants.join(", ") }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dialog-list-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.dialog-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.dialog-item {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dialog-item:hover {
  transform: translateY(-2px);
}

.dialog-card {
  background-color: #f8f8f8;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.dialog-name {
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
}
</style>
