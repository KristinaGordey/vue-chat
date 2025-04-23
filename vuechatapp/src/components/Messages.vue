<template>
  <div class="messages__area">
    <div
      v-for="(msg, index) in messages"
      :key="msg._id"
      :class="`message message--${
        msg.user === currentUser
          ? 'me'
          : msg.user === 'Admin'
          ? 'admin'
          : 'user'
      }`"
      @contextmenu.prevent="$emit('mesclick', msg._id)"
    >
      <div class="message__body">
        <p v-if="msg.user !== 'Admin'" class="message__user-name">
          {{ msg.user }}
        </p>
        <div class="message__text">{{ msg.message }}</div>
      </div>
      <p v-if="msg.user !== 'Admin'" class="message__time">
        {{
          new Date(msg.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        }}
      </p>
    </div>
  </div>
</template>

<script setup>
import "@/assets/style.css";

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
