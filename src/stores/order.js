import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOrderStore = defineStore('order', () => {
  // Step 1: Contact Info
  const firstName = ref('')
  const lastName = ref('')
  const email = ref('')
  const phone = ref('')

  // Step 2: Plan
  const plan = ref(null) // 'basic' | 'pro' | 'premium'

  const plans = {
    basic: { name: 'Basic', price: 0 },
    pro: { name: 'Pro', price: 199 },
    premium: { name: 'Premium', price: 349 },
  }

  // Step 3: Company Info
  const companyName = ref('')
  const companyType = ref('')
  const companyState = ref('')

  // Step 5: Payment
  const paymentCompleted = ref(false)

  // Step 6: Confirmation
  const orderId = ref(null)

  // Track completed steps for navigation guard
  const completedSteps = ref(new Set())

  const selectedPlan = computed(() => {
    return plan.value ? plans[plan.value] : null
  })

  function completeStep(step) {
    completedSteps.value.add(step)
  }

  function isStepCompleted(step) {
    return completedSteps.value.has(step)
  }

  function generateOrderId() {
    orderId.value = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    return orderId.value
  }

  function $reset() {
    firstName.value = ''
    lastName.value = ''
    email.value = ''
    phone.value = ''
    plan.value = null
    companyName.value = ''
    companyType.value = ''
    companyState.value = ''
    paymentCompleted.value = false
    orderId.value = null
    completedSteps.value = new Set()
  }

  return {
    firstName,
    lastName,
    email,
    phone,
    plan,
    plans,
    companyName,
    companyType,
    companyState,
    paymentCompleted,
    orderId,
    completedSteps,
    selectedPlan,
    completeStep,
    isStepCompleted,
    generateOrderId,
    $reset,
  }
})
