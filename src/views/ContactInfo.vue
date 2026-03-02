<script setup>
import { useRouter } from 'vue-router'
import { useOrderStore } from '../stores/order.js'
import { useValidation, required, isEmail, isPhone } from '../composables/useValidation.js'
import StepProgress from '../components/StepProgress.vue'
import StepNavigation from '../components/StepNavigation.vue'
import FormField from '../components/FormField.vue'

const router = useRouter()
const store = useOrderStore()

const { errors, validate } = useValidation({
  firstName: [required('First name')],
  lastName: [required('Last name')],
  email: [required('Email'), isEmail()],
  phone: [required('Phone'), isPhone()],
})

function onSubmit() {
  const valid = validate({
    firstName: store.firstName,
    lastName: store.lastName,
    email: store.email,
    phone: store.phone,
  })

  if (valid) {
    store.completeStep(1)
    router.push('/plan')
  }
}
</script>

<template>
  <StepProgress :current-step="1" />
  <h1>Contact Information</h1>

  <form @submit.prevent="onSubmit" data-testid="form-contact">
    <FormField label="First Name" :error="errors.firstName" test-id="firstName">
      <input
        v-model="store.firstName"
        type="text"
        class="form-field__input"
        :class="{ 'form-field__input--error': errors.firstName }"
        data-testid="input-firstName"
        autocomplete="given-name"
      />
    </FormField>

    <FormField label="Last Name" :error="errors.lastName" test-id="lastName">
      <input
        v-model="store.lastName"
        type="text"
        class="form-field__input"
        :class="{ 'form-field__input--error': errors.lastName }"
        data-testid="input-lastName"
        autocomplete="family-name"
      />
    </FormField>

    <FormField label="Email" :error="errors.email" test-id="email">
      <input
        v-model="store.email"
        type="email"
        class="form-field__input"
        :class="{ 'form-field__input--error': errors.email }"
        data-testid="input-email"
        autocomplete="email"
      />
    </FormField>

    <FormField label="Phone" :error="errors.phone" test-id="phone">
      <input
        v-model="store.phone"
        type="tel"
        class="form-field__input"
        :class="{ 'form-field__input--error': errors.phone }"
        data-testid="input-phone"
        autocomplete="tel"
      />
    </FormField>

    <StepNavigation :show-prev="false" @next="onSubmit" />
  </form>
</template>
