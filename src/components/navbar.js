/**
 *
 * @param {HTMLElement} component
 */
export default function (component) {
  const menuButton = component.querySelector("[data-navbar='menu-button']")
  menuButton.addEventListener('click', toggleScroll)
  let overlay
  const overlayInterval = setInterval(() => {
    overlay = component.querySelector('.w-nav-overlay')
    if (overlay) {
      clearInterval(overlayInterval)
      overlay.addEventListener('click', toggleScroll)
    }
  }, 100)

  function toggleScroll() {
    document.body.style.overflow = document.body.style.overflow === 'hidden' ? 'auto' : 'hidden'
  }

  if (window.scrollY > 0) {
    component.classList.add('is-scrolled')
  }
  window.addEventListener('scroll', () => {
    component.classList.toggle('is-scrolled', window.scrollY > 0)
  })
}
