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
      @dblclick="startEditing(msg)"
    >
      <div class="message__body">
        <p v-if="msg.user !== 'Admin'" class="message__user-name">
          {{ msg.user }}
        </p>
        <div class="message__text">
          <template v-if="editingMessageId === msg._id">
            <input
              v-model="editedText"
              @keyup.enter="saveMessage(msg._id)"
              @blur="cancelEditing"
              class="message-input"
            />
          </template>
          <template v-else> {{ msg.message }} </template>
        </div>
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
import { ref } from "vue";
import "@/assets/style.css";
defineProps({
  messages: { type: Array, required: true },
  currentUser: { type: String, required: true },
});
const editingMessageId = ref(null);
const editedText = ref("");
const emit = defineEmits(["editMessage", "mesclick"]);
const startEditing = (msg) => {
  editingMessageId.value = msg._id;
  editedText.value = msg.message;
};
const saveMessage = (mesid) => {
  emit("editMessage", { mesid, newMessage: editedText.value });
  editingMessageId.value = null;
};
const cancelEditing = () => {
  editingMessageId.value = null;
};
</script>
<style scoped>
.message-input {
  width: 100%;
  padding: 5px;
}
</style>
