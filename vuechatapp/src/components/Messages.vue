<template>
  <div class="messages__area">
    <div
      v-for="(msg, index) in messages"
      :key="msg._id"
      :class="`message__body ${
        msg.user === currentUser
          ? 'me'
          : msg.user === 'Admin'
          ? 'admin'
          : 'user'
      }`"
      @contextmenu.prevent="$emit('mesclick', msg._id)"
    >
      <strong v-if="msg.user !== 'Admin'" class="message__user-name">{{
        msg.user
      }}</strong>
      <div class="message__text">{{ msg.message }}</div>
      <sup v-if="msg.user !== 'Admin'" class="time">
        {{
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        }}
      </sup>
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
