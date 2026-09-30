import { shallowRef } from 'vue'

const experience = shallowRef(null)

export function useExperience() {
  const setExperience = (value) => {
    experience.value = value
  }

  return { experience, setExperience }
}
