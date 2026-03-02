import { reactive } from 'vue'

export function useValidation(rules) {
  const errors = reactive({})

  function validate(fields) {
    // Clear previous errors
    for (const key in errors) {
      delete errors[key]
    }

    let valid = true

    for (const [field, fieldRules] of Object.entries(rules)) {
      const value = typeof fields[field] === 'string' ? fields[field].trim() : fields[field]

      for (const rule of fieldRules) {
        const error = rule(value)
        if (error) {
          errors[field] = error
          valid = false
          break
        }
      }
    }

    return valid
  }

  function clearErrors() {
    for (const key in errors) {
      delete errors[key]
    }
  }

  return { errors, validate, clearErrors }
}

// Common validators
export const required = (label) => (v) =>
  !v ? `${label} is required` : null

export const isEmail = () => (v) =>
  v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email address' : null

export const isPhone = () => (v) =>
  v && !/^[\d\s()+-]{7,}$/.test(v) ? 'Enter a valid phone number' : null

export const minLength = (n, label) => (v) =>
  v && v.length < n ? `${label} must be at least ${n} characters` : null
