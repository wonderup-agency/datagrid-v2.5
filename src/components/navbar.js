import gsap from 'gsap'

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

  /* ---------------- Banner logic ---------------- */

  const BANNER_KEY = 'navbarBannerClosed'
  const RESET_MS = 60 * 60 * 1000 // 1 hour

  const banner = component.querySelector("[data-navbar='banner']")
  if (!banner) return

  const closeButton = banner.querySelector("[data-navbar='close-banner']")

  function isBannerClosed() {
    const raw = localStorage.getItem(BANNER_KEY)
    if (!raw) return false
    try {
      const { ts } = JSON.parse(raw)
      return Date.now() - ts < RESET_MS
    } catch {
      return false
    }
  }

  function setBannerClosed() {
    localStorage.setItem(BANNER_KEY, JSON.stringify({ ts: Date.now() }))
  }

  function removeBanner() {
    banner.remove()
  }

  if (isBannerClosed()) {
    removeBanner()
    return
  }

  // show banner
  gsap.set(banner, { autoAlpha: 0 })
  banner.style.visibility = 'visible'
  gsap.to(banner, {
    autoAlpha: 1,
    duration: 0.25,
    ease: 'power1.out',
  })

  closeButton.addEventListener('click', () => {
    setBannerClosed()
    gsap.to(banner, {
      autoAlpha: 0,
      duration: 0.2,
      ease: 'power1.in',
      onComplete: removeBanner,
    })
  })
}
