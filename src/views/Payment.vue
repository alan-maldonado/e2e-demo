<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '../stores/order.js'
import { useValidation, required, minLength } from '../composables/useValidation.js'
import StepProgress from '../components/StepProgress.vue'
import StepNavigation from '../components/StepNavigation.vue'
import FormField from '../components/FormField.vue'

const router = useRouter()
const store = useOrderStore()

const cardName = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')
const cardZip = ref('')
const processing = ref(false)

const { errors, validate } = useValidation({
  cardName: [required('Name on card')],
  cardNumber: [required('Card number'), minLength(16, 'Card number')],
  cardExpiry: [required('Expiry date')],
  cardCvv: [required('CVV'), minLength(3, 'CVV')],
  cardZip: [required('Billing ZIP'), minLength(5, 'ZIP code')],
})

async function onSubmit() {
  const valid = validate({
    cardName: cardName.value,
    cardNumber: cardNumber.value,
    cardExpiry: cardExpiry.value,
    cardCvv: cardCvv.value,
    cardZip: cardZip.value,
  })

  if (!valid) return

  processing.value = true

  // Simulate payment processing delay (1 second)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  processing.value = false
  store.paymentCompleted = true
  store.completeStep(5)
  store.generateOrderId()
  router.push('/confirmation')
}
</script>

<template>
  <StepProgress :current-step="5" />
  <h1>Payment</h1>

  <div v-if="processing" class="processing" data-testid="payment-processing">
    <div class="spinner" />
    <p>Processing your payment...</p>
  </div>

  <form v-else @submit.prevent="onSubmit" data-testid="form-payment">
    <FormField label="Name on Card" :error="errors.cardName" test-id="cardName">
      <input
        v-model="cardName"
        type="text"
        class="form-field__input"
        :class="{ 'form-field__input--error': errors.cardName }"
        data-testid="input-cardName"
        autocomplete="cc-name"
      />
    </FormField>

    <FormField label="Card Number" :error="errors.cardNumber" test-id="cardNumber">
      <input
        v-model="cardNumber"
        type="text"
        class="form-field__input"
        :class="{ 'form-field__input--error': errors.cardNumber }"
        data-testid="input-cardNumber"
        placeholder="1234 5678 9012 3456"
        autocomplete="cc-number"
      />
    </FormField>

    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
      <FormField label="Expiry" :error="errors.cardExpiry" test-id="cardExpiry">
        <input
          v-model="cardExpiry"
          type="text"
          class="form-field__input"
          :class="{ 'form-field__input--error': errors.cardExpiry }"
          data-testid="input-cardExpiry"
          placeholder="MM/YY"
          autocomplete="cc-exp"
        />
      </FormField>

      <FormField label="CVV" :error="errors.cardCvv" test-id="cardCvv">
        <input
          v-model="cardCvv"
          type="text"
          class="form-field__input"
          :class="{ 'form-field__input--error': errors.cardCvv }"
          data-testid="input-cardCvv"
          placeholder="123"
          autocomplete="cc-csc"
        />
      </FormField>

      <FormField label="Billing ZIP" :error="errors.cardZip" test-id="cardZip">
        <input
          v-model="cardZip"
          type="text"
          class="form-field__input"
          :class="{ 'form-field__input--error': errors.cardZip }"
          data-testid="input-cardZip"
          autocomplete="postal-code"
        />
      </FormField>
    </div>

    <StepNavigation next-label="Pay Now" @prev="router.push('/review')" @next="onSubmit" />
  </form>
</template>
