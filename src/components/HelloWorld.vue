<script setup>
defineProps({
  msg: {
    type: String,
    default: 'Hello World!',
  },
})
</script>

<template>
  <h1 class="text-red-500 font-bold">{{ msg }}</h1>
</template>

<style scoped>
h1 {
  font-weight: 600;
}
</style>
