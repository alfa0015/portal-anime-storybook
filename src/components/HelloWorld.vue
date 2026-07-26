<script setup>
import { Button } from '@/components/ui/button'

defineProps({
  msg: {
    type: String,
    default: 'Hello World!',
  },
})
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <h1 class="text-red-500 font-bold">{{ msg }}</h1>
    <Button variant="outline">Click me</Button>
  </div>
</template>

<style scoped></style>
