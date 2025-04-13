<script setup>
import { onMounted, ref } from "vue";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
const dialogs = ref([]);

onMounted(() => {
  socket.on("dialogList", ({ dialogs: serverDialogs }) => {
    dialogs.value = serverDialogs;
  });
});
</script>

<template>
  <div class="dialogs-page">
    <h2>Ваши диалоги</h2>
    <ul>
      <li v-for="dialog in dialogs" :key="dialog.id" class="dialog-item">
        <router-link :to="{ name: 'Chat', query: { dialogId: dialog.id } }">
          {{ dialog.participants.join(", ") }}
        </router-link>
      </li>
    </ul>
  </div>
</template>
