const loading = document.createElement('div')
loading.id = 'loading'
loading.textContent = 'Loading...'
document.body.append(loading)

export const showLoading = () => {
  loading.style.display = 'block'
}

export const hideLoading = () => {
  loading.style.display = 'none'
}
