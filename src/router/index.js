import { createRouter, createWebHistory } from 'vue-router'
import { useOrderStore } from '../stores/order.js'

import ContactInfo from '../views/ContactInfo.vue'
import PlanSelection from '../views/PlanSelection.vue'
import CompanyInfo from '../views/CompanyInfo.vue'
import OrderReview from '../views/OrderReview.vue'
import Payment from '../views/Payment.vue'
import Confirmation from '../views/Confirmation.vue'

const routes = [
  { path: '/', component: ContactInfo, meta: { step: 1 } },
  { path: '/plan', component: PlanSelection, meta: { step: 2, requiredStep: 1 } },
  { path: '/company', component: CompanyInfo, meta: { step: 3, requiredStep: 2 } },
  { path: '/review', component: OrderReview, meta: { step: 4, requiredStep: 3 } },
  { path: '/payment', component: Payment, meta: { step: 5, requiredStep: 4 } },
  { path: '/confirmation', component: Confirmation, meta: { step: 6, requiredStep: 5 } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard: prevent skipping steps
router.beforeEach((to) => {
  const store = useOrderStore()
  const requiredStep = to.meta.requiredStep

  if (requiredStep && !store.isStepCompleted(requiredStep)) {
    // Redirect to the first incomplete step
    return '/'
  }
})

export default router
