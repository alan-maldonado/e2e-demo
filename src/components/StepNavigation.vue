<script setup>
defineProps({
  showPrev: { type: Boolean, default: true },
  nextLabel: { type: String, default: 'Next' },
  loading: { type: Boolean, default: false },
})

defineEmits(['prev', 'next'])
</script>

<template>
  <div class="step-nav">
    <button
      v-if="showPrev"
      type="button"
      class="btn btn--secondary"
      data-testid="btn-prev"
      @click="$emit('prev')"
    >
      Back
    </button>
    <div v-else />
    <button
      type="submit"
      class="btn btn--primary"
      data-testid="btn-next"
      :disabled="loading"
      @click="$emit('next')"
    >
      {{ loading ? 'Processing...' : nextLabel }}
    </button>
  </div>
</template>
