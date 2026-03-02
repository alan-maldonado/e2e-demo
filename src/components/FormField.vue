<script setup>
defineProps({
  label: String,
  error: String,
  testId: String,
})
</script>

<template>
  <div class="form-field">
    <label class="form-field__label">{{ label }}</label>
    <slot :error="error" />
    <p v-if="error" class="form-field__error" role="alert" :data-testid="`error-${testId}`">
      {{ error }}
    </p>
  </div>
</template>
