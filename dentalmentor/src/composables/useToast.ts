import { ref } from 'vue'

const open = ref(false)
const message = ref('')
const type = ref<'success' | 'error'>('success')

export function useToast() {
  function showToast(nextMessage: string, nextType: 'success' | 'error' = 'success') {
    message.value = nextMessage
    type.value = nextType
    open.value = true

    setTimeout(() => {
      open.value = false
    }, 3000)
  }

  return {
    open,
    message,
    type,
    showToast,
  }
}
