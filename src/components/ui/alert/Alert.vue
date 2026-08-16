<script setup>
import { cn } from '@/lib/utils'
import { alertVariants } from '.'

const props = defineProps({
  variant: { type: String, required: false, default: 'default' },
  class: { type: null, required: false },
})
</script>

<template>
  <div data-slot="alert" role="alert" :class="cn(alertVariants({ variant }), props.class)">
    <slot />
  </div>
</template>
