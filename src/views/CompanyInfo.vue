<script setup>
import { useRouter } from 'vue-router'
import { useOrderStore } from '../stores/order.js'
import { useValidation, required } from '../composables/useValidation.js'
import StepProgress from '../components/StepProgress.vue'
import StepNavigation from '../components/StepNavigation.vue'
import FormField from '../components/FormField.vue'

const router = useRouter()
const store = useOrderStore()

const { errors, validate } = useValidation({
  companyName: [required('Company name')],
  companyType: [required('Company type')],
  companyState: [required('State')],
})

const companyTypes = ['LLC', 'Corporation', 'S-Corporation', 'Nonprofit']

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
]

function onSubmit() {
  const valid = validate({
    companyName: store.companyName,
    companyType: store.companyType,
    companyState: store.companyState,
  })

  if (valid) {
    store.completeStep(3)
    router.push('/review')
  }
}
</script>

<template>
  <StepProgress :current-step="3" />
  <h1>Company Information</h1>

  <form @submit.prevent="onSubmit" data-testid="form-company">
    <FormField label="Company Name" :error="errors.companyName" test-id="companyName">
      <input
        v-model="store.companyName"
        type="text"
        class="form-field__input"
        :class="{ 'form-field__input--error': errors.companyName }"
        data-testid="input-companyName"
      />
    </FormField>

    <FormField label="Company Type" :error="errors.companyType" test-id="companyType">
      <select
        v-model="store.companyType"
        class="form-field__input"
        :class="{ 'form-field__input--error': errors.companyType }"
        data-testid="input-companyType"
      >
        <option value="" disabled>Select a type...</option>
        <option v-for="t in companyTypes" :key="t" :value="t">{{ t }}</option>
      </select>
    </FormField>

    <FormField label="State of Formation" :error="errors.companyState" test-id="companyState">
      <select
        v-model="store.companyState"
        class="form-field__input"
        :class="{ 'form-field__input--error': errors.companyState }"
        data-testid="input-companyState"
      >
        <option value="" disabled>Select a state...</option>
        <option v-for="s in states" :key="s" :value="s">{{ s }}</option>
      </select>
    </FormField>

    <StepNavigation @prev="router.push('/plan')" @next="onSubmit" />
  </form>
</template>
