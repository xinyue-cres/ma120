import { ref } from 'vue'

const STORAGE_KEY = 'ma120_favorites'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const favorites = ref(load())

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
}

export function useFavorites() {
  function add(fund) {
    if (!favorites.value.find(f => f.code === fund.code)) {
      favorites.value.push(fund)
      save()
    }
  }

  function remove(code) {
    favorites.value = favorites.value.filter(f => f.code !== code)
    save()
  }

  function isFavorite(code) {
    return favorites.value.some(f => f.code === code)
  }

  return { favorites, add, remove, isFavorite }
}
