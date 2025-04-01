<template>
  <div class="messages">
    <div
      v-for="(msg, i) in messages"
      :key="i"
      :class="['message', getClassName(msg.user.name)]"
    >
      <span class="user">{{ msg.user.name }}</span>
      <div class="text">{{ msg.message }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

defineProps({
  name: String,
});

const getClassName = (username) => {
  const normalizedName = name.trim().toLowerCase() || "";
  return username.trim().toLowerCase() === normalizedName ? "me" : "user";
};
</script>

<style scoped>
.messages {
  padding: 1rem;
}

.message {
  margin-bottom: 1rem;
}

.user {
  font-weight: bold;
}

.me {
  color: blue;
}

.user {
  color: green;
}

.text {
  margin-top: 0.5rem;
  font-size: 14px;
}
</style>
