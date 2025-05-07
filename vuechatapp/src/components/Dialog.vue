<script setup>
const props = defineProps({
  dialog: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["select"]); //обьявляю массив кастомных событий, которые компонент будет этимировать
</script>

<template>
  <!--отправка кастомного события родителю AllChats-->
  <li class="dialogs__item" @click="emit('select', dialog.id)">
    <div class="dialog contain">
      <p class="dialog__name">
        {{ dialog.participants.join(", ") }}
      </p>
    </div>
  </li>
</template>
