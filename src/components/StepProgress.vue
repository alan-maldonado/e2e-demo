<script setup>
import { useOrderStore } from '../stores/order.js'

const props = defineProps({
  currentStep: Number,
})

const store = useOrderStore()

const steps = [
  { num: 1, label: 'Contact' },
  { num: 2, label: 'Plan' },
  { num: 3, label: 'Company' },
  { num: 4, label: 'Review' },
  { num: 5, label: 'Payment' },
  { num: 6, label: 'Done' },
]
</script>

<template>
  <div class="step-progress" data-testid="step-progress">
    <template v-for="(step, i) in steps" :key="step.num">
      <div class="step-progress__step">
        <div
          class="step-progress__dot"
          :class="{
            'step-progress__dot--active': step.num === currentStep,
            'step-progress__dot--completed': step.num < currentStep,
          }"
          :data-testid="`step-dot-${step.num}`"
        >
          <template v-if="step.num < currentStep">&#10003;</template>
          <template v-else>{{ step.num }}</template>
        </div>
      </div>
      <div
        v-if="i < steps.length - 1"
        class="step-progress__line"
        :class="{ 'step-progress__line--completed': step.num < currentStep }"
      />
    </template>
  </div>
</template>
