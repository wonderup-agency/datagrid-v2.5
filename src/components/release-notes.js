import gsap from 'gsap'

const BREAKPOINT = 991

/**
 *
 * @param {HTMLElement} component
 */
export default function (component) {
  initAccordions(component)
  initToggleFilters(component)
}

function initAccordions(component) {
  const accordions = component.querySelectorAll('[data-release-notes="accordion"]')

  accordions.forEach((accordion) => {
    const trigger = accordion.querySelector('[data-release-notes="accordion-trigger"]')
    const dropdown = accordion.querySelector('[data-release-notes="accordion-dropdown"]')
    const icon = accordion.querySelector('[data-release-notes="accordion-icon"]')

    if (!trigger || !dropdown) return

    let isOpen = true
    const naturalHeight = dropdown.scrollHeight

    trigger.addEventListener('click', () => {
      if (isOpen) {
        gsap.to(dropdown, {
          duration: 0.3,
          height: 0,
          ease: 'power2.inOut',
        })
        gsap.to(icon, {
          duration: 0.3,
          rotation: 180,
          ease: 'power2.inOut',
        })
      } else {
        gsap.to(dropdown, {
          duration: 0.3,
          height: naturalHeight,
          ease: 'power2.inOut',
          onComplete: () => {
            dropdown.style.height = 'auto'
          },
        })
        gsap.to(icon, {
          duration: 0.3,
          rotation: 0,
          ease: 'power2.inOut',
        })
      }
      isOpen = !isOpen
    })
  })
}

function initToggleFilters(component) {
  const toggleBtn = component.querySelector('[data-release-notes="toggle-filters"]')
  const filters = component.querySelector('[data-release-notes="filters"]')

  if (!toggleBtn || !filters) return

  let filtersOpen = false
  const mm = window.matchMedia(`(max-width: ${BREAKPOINT}px)`)

  function closeFilters() {
    if (!filtersOpen) return
    gsap.to(filters, {
      duration: 0.3,
      height: 0,
      ease: 'power2.inOut',
      onComplete: () => {
        filters.style.display = 'none'
        filters.style.overflow = ''
      },
    })
    filtersOpen = false
  }

  function openFilters() {
    filters.style.display = 'block'
    filters.style.overflow = 'hidden'
    const naturalHeight = filters.scrollHeight
    gsap.fromTo(
      filters,
      { height: 0 },
      {
        duration: 0.3,
        height: naturalHeight,
        ease: 'power2.inOut',
        onComplete: () => {
          filters.style.height = 'auto'
          filters.style.overflow = ''
        },
      }
    )
    filtersOpen = true
  }

  toggleBtn.addEventListener('click', () => {
    if (!mm.matches) return
    filtersOpen ? closeFilters() : openFilters()
  })

  document.addEventListener('click', (e) => {
    if (!mm.matches || !filtersOpen) return
    if (filters.contains(e.target) || toggleBtn.contains(e.target)) return
    closeFilters()
  })

  mm.addEventListener('change', () => {
    gsap.killTweensOf(filters)
    filters.style.display = ''
    filters.style.height = ''
    filters.style.overflow = ''
    filtersOpen = false
  })
}
