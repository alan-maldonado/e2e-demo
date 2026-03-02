<script setup>
import { useRouter } from 'vue-router'
import { useOrderStore } from '../stores/order.js'
import StepProgress from '../components/StepProgress.vue'

const router = useRouter()
const store = useOrderStore()

function startOver() {
  store.$reset()
  router.push('/')
}
</script>

<template>
  <StepProgress :current-step="6" />

  <div class="confirmation" data-testid="confirmation">
    <div class="confirmation__icon">&#10003;</div>
    <h1 class="confirmation__title">Order Confirmed!</h1>
    <p class="confirmation__order-id" data-testid="order-id">
      Order ID: {{ store.orderId }}
    </p>

    <div class="review-section" style="text-align: left; margin-bottom: 24px;">
      <div class="review-row">
        <span class="review-row__label">Name</span>
        <span>{{ store.firstName }} {{ store.lastName }}</span>
      </div>
      <div class="review-row">
        <span class="review-row__label">Email</span>
        <span>{{ store.email }}</span>
      </div>
      <div class="review-row">
        <span class="review-row__label">Company</span>
        <span>{{ store.companyName }} ({{ store.companyType }})</span>
      </div>
      <div class="review-row">
        <span class="review-row__label">State</span>
        <span>{{ store.companyState }}</span>
      </div>
      <div class="review-row">
        <span class="review-row__label">Plan</span>
        <span>{{ store.selectedPlan?.name }} — ${{ store.selectedPlan?.price }}</span>
      </div>
    </div>

    <button class="btn btn--primary" data-testid="btn-start-over" @click="startOver">
      Start New Order
    </button>
  </div>
</template>
