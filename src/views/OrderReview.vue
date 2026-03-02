<script setup>
import { useRouter } from 'vue-router'
import { useOrderStore } from '../stores/order.js'
import StepProgress from '../components/StepProgress.vue'
import StepNavigation from '../components/StepNavigation.vue'

const router = useRouter()
const store = useOrderStore()

function onSubmit() {
  store.completeStep(4)
  router.push('/payment')
}
</script>

<template>
  <StepProgress :current-step="4" />
  <h1>Review Your Order</h1>

  <div class="review-section" data-testid="review-contact">
    <div class="review-section__header">
      <span class="review-section__title">Contact Information</span>
      <a class="review-section__edit" data-testid="edit-contact" @click="router.push('/')">Edit</a>
    </div>
    <div class="review-row">
      <span class="review-row__label">Name</span>
      <span data-testid="review-name">{{ store.firstName }} {{ store.lastName }}</span>
    </div>
    <div class="review-row">
      <span class="review-row__label">Email</span>
      <span data-testid="review-email">{{ store.email }}</span>
    </div>
    <div class="review-row">
      <span class="review-row__label">Phone</span>
      <span data-testid="review-phone">{{ store.phone }}</span>
    </div>
  </div>

  <div class="review-section" data-testid="review-plan">
    <div class="review-section__header">
      <span class="review-section__title">Plan</span>
      <a class="review-section__edit" data-testid="edit-plan" @click="router.push('/plan')">Edit</a>
    </div>
    <div class="review-row">
      <span class="review-row__label">Plan</span>
      <span data-testid="review-plan-name">{{ store.selectedPlan?.name }}</span>
    </div>
    <div class="review-row">
      <span class="review-row__label">Price</span>
      <span data-testid="review-plan-price">${{ store.selectedPlan?.price }}</span>
    </div>
  </div>

  <div class="review-section" data-testid="review-company">
    <div class="review-section__header">
      <span class="review-section__title">Company</span>
      <a class="review-section__edit" data-testid="edit-company" @click="router.push('/company')">Edit</a>
    </div>
    <div class="review-row">
      <span class="review-row__label">Company Name</span>
      <span data-testid="review-companyName">{{ store.companyName }}</span>
    </div>
    <div class="review-row">
      <span class="review-row__label">Type</span>
      <span data-testid="review-companyType">{{ store.companyType }}</span>
    </div>
    <div class="review-row">
      <span class="review-row__label">State</span>
      <span data-testid="review-companyState">{{ store.companyState }}</span>
    </div>
  </div>

  <StepNavigation next-label="Proceed to Payment" @prev="router.push('/company')" @next="onSubmit" />
</template>
