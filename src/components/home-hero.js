import * as rive from '@rive-app/webgl2'
import grained from '../utils/grained.js'
import gsap from 'gsap'

/**
 *
 * @param {HTMLElement} component
 */
export default function (component) {
  // GRID BG
  const bgGrid = document.querySelector("[data-home-hero='bg-grid']")
  if (bgGrid) {
    const sections = document.querySelectorAll('section')
    const firstSection = sections[0] || null
    const secondSection = sections[1] || null
    let totalHeight = 0
    if (firstSection) totalHeight += firstSection.offsetHeight
    if (secondSection) totalHeight += secondSection.offsetHeight
    gsap.set(bgGrid, {
      height: `${totalHeight}px`,
    })
    gsap.to(bgGrid, {
      opacity: 1,
      duration: 2,
      ease: 'power1.in',
    })
  }

  // RIVE
  const canvas = document.querySelector("[data-component='home-hero-rive']")

  if (canvas && rive) {
    const src = canvas.dataset.src.trim()
    const artboard = canvas.dataset.artboard.trim()
    const stateMachines = canvas.dataset.stateMachines.trim()

    if (src && artboard && stateMachines) {
      const layout = new rive.Layout({
        fit: rive.Fit.Cover,
        alignment: rive.Alignment.TopCenter,
      })

      const r = new rive.Rive({
        src: src,
        canvas: canvas,
        layout: layout,
        autoplay: true,
        artboard: artboard,
        stateMachines: stateMachines,
        onLoad: () => {
          r.resizeDrawingSurfaceToCanvas()
          canvas.style.opacity = 1
          gsap.from(canvas, {
            yPercent: 100,
            opacity: 0,
            duration: 4,
            ease: 'power1.out',
          })
        },
      })
    }

    // GRAIN
    const grainElement = document.querySelector('[data-home-hero="grain"]')
    var options = {
      animate: true,
      patternWidth: 500,
      patternHeight: 500,
      grainOpacity: 0.125,
      grainDensity: 2,
      grainWidth: 1,
      grainHeight: 1,
    }
    grained(grainElement, options)
    grainElement.style.opacity = 1
    grainElement.parentElement.style.height = canvas.offsetHeight + 'px'
  }

  // FORM
  const formWrapper = document.querySelector("[data-component='demo-form']")
  if (formWrapper) {
    const form = formWrapper.querySelector('form')
    const textArea = form.querySelector('textarea')
    const placeholderText = formWrapper.dataset.placeholder.trim()
    let targetUrl = formWrapper.dataset.targetUrl.trim()

    let currentIndex = 0
    const typewriterEffect = () => {
      if (currentIndex < placeholderText.length) {
        textArea.setAttribute(
          'placeholder',
          placeholderText.substring(0, currentIndex + 1)
        )
        currentIndex++
        setTimeout(typewriterEffect, 20)
      }
    }
    typewriterEffect()

    textArea.addEventListener('input', () => {
      textArea.style.height = 'auto'
      textArea.style.height = `${textArea.scrollHeight}px`
    })

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      e.stopPropagation()
      const formData = new FormData(form)
      const params = new URLSearchParams()
      for (let [key, value] of formData) {
        if (value) {
          params.append(key, value)
        }
      }
      targetUrl += `?${params.toString()}`
      window.open(targetUrl, '_blank')
    })
  }

  // AI TASKS
  const aiTasksWrapper = document.querySelector("[data-component='ai-tasks']")
  if (aiTasksWrapper) {
    const items = aiTasksWrapper.querySelectorAll("[data-ai-tasks='item']")
    const spawnPoints = aiTasksWrapper.querySelectorAll(
      "[data-ai-tasks='spawnpoint']"
    )

    const itemsJson = Array.from(items).map((item) => {
      const icon = item.querySelector('img')
      const text = item.querySelector('p')
      return {
        class: item.classList || '',
        img: {
          src: icon?.src || '',
          class: icon?.className || '',
        },
        p: {
          text: text?.textContent || '',
          class: text?.className || '',
        },
      }
    })
    items[0].parentElement.parentElement.remove()

    spawnPoints.forEach((spawnPoint) => appendRandomTask(spawnPoint))

    function appendRandomTask(spawnPoint) {
      const randomIndex = Math.floor(Math.random() * itemsJson.length)
      const randomItem = itemsJson[randomIndex]
      const taskElement = document.createElement('div')
      taskElement.className = randomItem.class
      const imgElement = document.createElement('img')
      imgElement.src = randomItem.img.src
      imgElement.className = randomItem.img.class
      const pElement = document.createElement('p')
      pElement.textContent = randomItem.p.text
      pElement.className = randomItem.p.class
      taskElement.appendChild(imgElement)
      taskElement.appendChild(pElement)
      taskElement.style.opacity = 0
      spawnPoint.append(taskElement)

      const inDelay = getRandomBetween(0, 3)
      const inOutDuration = getRandomBetween(3, 5)
      const stayDuration = getRandomBetween(3, 8)

      // 30% chance for item to be further behind
      const depth =
        getRandomBetween(0, 1) > 0.7
          ? { from: 0.6, to: 0.75, opacity: 0.5 }
          : { from: 0.9, to: 1, opacity: 1 }

      const tl = gsap.timeline()
      tl.fromTo(
        taskElement,
        {
          opacity: 0,
          scale: depth.from,
        },
        {
          opacity: depth.opacity,
          scale: depth.to,
          duration: inOutDuration,
          delay: inDelay,
          ease: 'power1.inOut',
        }
      )
      tl.to(taskElement, {
        y: '1rem',
        opacity: 0,
        scale: depth.from,
        duration: inOutDuration,
        delay: stayDuration,
        ease: 'power1.in',
        onComplete: () => {
          taskElement.remove()
          appendRandomTask(spawnPoint)
        },
      })
    }

    function getRandomBetween(min, max) {
      return Math.random() * (max - min) + min
    }
  }
}
