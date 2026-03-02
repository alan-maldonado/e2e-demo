<script setup>
import { useRouter } from 'vue-router'
import { useOrderStore } from '../stores/order.js'
import { useValidation, required } from '../composables/useValidation.js'
import StepProgress from '../components/StepProgress.vue'
import StepNavigation from '../components/StepNavigation.vue'

const router = useRouter()
const store = useOrderStore()

const { errors, validate } = useValidation({
  plan: [required('Plan selection')],
})

const planOptions = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$0',
    features: 'State filing, registered agent (1st year)',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$199',
    features: 'Basic + EIN, operating agreement, banking resolution',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$349',
    features: 'Pro + expedited filing, compliance alerts, business website',
  },
]

function selectPlan(id) {
  store.plan = id
}

function onSubmit() {
  if (validate({ plan: store.plan })) {
    store.completeStep(2)
    router.push('/company')
  }
}
</script>

<template>
  <StepProgress :current-step="2" />
  <h1>Choose Your Plan</h1>

  <form @submit.prevent="onSubmit" data-testid="form-plan">
    <div class="plan-cards">
      <div
        v-for="p in planOptions"
        :key="p.id"
        class="plan-card"
        :class="{ 'plan-card--selected': store.plan === p.id }"
        :data-testid="`plan-${p.id}`"
        role="radio"
        :aria-checked="store.plan === p.id"
        tabindex="0"
        @click="selectPlan(p.id)"
        @keydown.enter.prevent="selectPlan(p.id)"
        @keydown.space.prevent="selectPlan(p.id)"
      >
        <div class="plan-card__name">{{ p.name }}</div>
        <div class="plan-card__price">{{ p.price }}</div>
        <div class="plan-card__features">{{ p.features }}</div>
      </div>
    </div>

    <p v-if="errors.plan" class="form-field__error" role="alert" data-testid="error-plan" style="margin-top: 12px">
      {{ errors.plan }}
    </p>

    <StepNavigation @prev="router.push('/')" @next="onSubmit" />
  </form>
</template>
