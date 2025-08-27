import gsap from 'gsap'

/**
 *
 * @param {HTMLElement} component
 */
export default function (component) {
  component.querySelector('[role="list"]').removeAttribute('role')
  component.querySelectorAll('[role="listitem"]').forEach((item) => {
    item.removeAttribute('role')
  })

  const items = component.querySelectorAll('.w-dyn-item')

  items.forEach((item, i) => {
    const controls = item.querySelector('button')
    const panel = item.querySelector("[role='region']")

    controls.setAttribute('id', `accordion${i}`)
    controls.setAttribute('aria-controls', `panel${i}`)
    panel.setAttribute('aria-labelledby', `accordion${i}`)
    panel.setAttribute('id', `panel${i}`)

    a11yToggle(controls, panel, false)

    controls.addEventListener('click', () => handleTrigger(controls, panel))
  })
}

function handleTrigger(controls, panel) {
  if (panel.scrollHeight === 0) {
    a11yToggle(controls, panel, true)
    const height = panel.scrollHeight
    gsap.to(panel, {
      duration: 0.3,
      height: panel.scrollHeight,
      ease: 'power2.inOut',
    })
  } else {
    gsap.to(panel, {
      duration: 0.3,
      height: 0,
      ease: 'power2.inOut',
      onComplete: () => a11yToggle(controls, panel, false),
    })
  }
}

function a11yToggle(controls, panel, open) {
  controls.setAttribute('aria-expanded', open)
  panel.toggleAttribute('hidden', !open)
}
