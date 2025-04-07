<template>
  <div class="messages__area">
    <div
      v-for="(msg, index) in messages"
      :key="index"
      :class="`message__body ${msg.user === currentUser ? 'me' : 'user'}`"
    >
      <strong class="message__user-name">{{ msg.user }}</strong>
      <div class="message__text">{{ msg.message }}</div>
    </div>
  </div>
</template>

<script setup>
import "@/assets/main.css";

defineProps({
  messages: {
    type: Array,
    required: true,
  },
  currentUser: {
    type: String,
    required: true,
  },
});
</script>

<style scoped></style>
