import * as rive from '@rive-app/webgl2'
import grained from '../utils/grained.js'
import gsap from 'gsap'

/**
 *
 * @param {HTMLElement} component
 */
export default function (component) {
  // HERO EFFECTS
  const bgGrid = document.querySelector("[data-home-hero='bg-grid']")
  const bgVideo = document.querySelector("[data-home-hero='bg-video']")
  const grainElement = document.querySelector('[data-home-hero="grain"]')
  const sections = document.querySelectorAll('section')
  const firstSection = sections[0] || null
  const secondSection = sections[1] || null
  let totalHeight = 0

  if (grainElement) {
    const options = {
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
  }

  if (bgVideo) {
    gsap.fromTo(bgVideo, { opacity: 0 }, { opacity: 1, duration: 4, ease: 'power1.out' })
  }

  if (bgGrid) {
    gsap.to(bgGrid, {
      opacity: 0.5,
      duration: 2,
      ease: 'power1.in',
    })
  }

  updateEffectsHeight()
  window.addEventListener('resize', updateEffectsHeight)
  function updateEffectsHeight() {
    totalHeight = 0
    if (firstSection) totalHeight += firstSection.offsetHeight
    if (secondSection) totalHeight += secondSection.offsetHeight

    if (bgGrid) gsap.set(bgGrid, { height: `${firstSection.offsetHeight}px` })

    if (bgVideo) gsap.set(bgVideo, { height: `${totalHeight + 100}px` })

    if (grainElement?.parentElement) gsap.set(grainElement.parentElement, { height: `${totalHeight + 100}px` })
  }

  // RIVE (removed, replaced with video)
  // const canvas = document.querySelector("[data-component='home-hero-rive']")
  // if (canvas && rive) {
  if (false) {
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
    const placeholder = form.querySelector('[data-demo-form="placeholder"]')
    const placeholderText = formWrapper.dataset.placeholder
    const placeholderArray = placeholderText ? placeholderText.split(',').map((str) => str.trim()) : []

    let targetUrl = formWrapper.dataset.targetUrl.trim()

    // --- Typewriter Logic ---
    let typewriterActive = false
    let stopTypewriter = false
    let typewriterTimeouts = []
    let currentPlaceholderIndex = 0

    function clearTypewriterTimeouts() {
      typewriterTimeouts.forEach((t) => clearTimeout(t))
      typewriterTimeouts = []
    }

    function setPlaceholderDisplay(show) {
      placeholder.style.display = show ? 'block' : 'none'
    }

    function typewriterEffect(str, callback) {
      // Remove characters one by one
      let removeDelay = 20
      let writeDelay = 40
      let current = placeholder.textContent.replace('|', '')
      let removeStep = () => {
        if (current.length > 0) {
          current = current.slice(0, -1)
          placeholder.textContent = current
          typewriterTimeouts.push(setTimeout(removeStep, removeDelay))
        } else {
          // Start writing new string
          writeStep(0)
        }
      }
      let writeStep = (i) => {
        if (i === 0) {
          typewriterTimeouts.push(setTimeout(() => writeStep(i + 1), 500))
          return
        }
        if (i <= str.length) {
          placeholder.textContent = str.slice(0, i) + '|'
          typewriterTimeouts.push(setTimeout(() => writeStep(i + 1), writeDelay))
        } else {
          // Blinking cursor
          blinkCursor(str)
          if (callback) callback()
        }
      }
      let blink = true
      function blinkCursor(baseStr) {
        if (!typewriterActive) return
        placeholder.textContent = baseStr + (blink ? '|' : '')
        typewriterTimeouts.push(
          setTimeout(() => {
            blink = !blink
            blinkCursor(baseStr)
          }, 500)
        )
      }
      removeStep()
    }

    function startTypewriterLoop() {
      if (typewriterActive) return
      typewriterActive = true
      stopTypewriter = false
      setPlaceholderDisplay(true)
      function loop() {
        if (!typewriterActive || stopTypewriter) return
        clearTypewriterTimeouts()
        let str = placeholderArray[currentPlaceholderIndex]
        typewriterEffect(str, () => {
          typewriterTimeouts.push(
            setTimeout(() => {
              if (!typewriterActive || stopTypewriter) return
              currentPlaceholderIndex = (currentPlaceholderIndex + 1) % placeholderArray.length
              loop()
            }, 3000)
          )
        })
      }
      loop()
    }

    function stopTypewriterLoop() {
      typewriterActive = false
      stopTypewriter = true
      clearTypewriterTimeouts()
      placeholder.textContent = ''
      setPlaceholderDisplay(false)
    }

    // Listen for textarea input
    textArea.addEventListener('input', () => {
      textArea.style.height = 'auto'
      textArea.style.height = `${textArea.scrollHeight}px`
      if (textArea.value.length > 0) {
        stopTypewriterLoop()
      } else {
        if (!typewriterActive) {
          currentPlaceholderIndex = 0
          startTypewriterLoop()
        }
      }
    })

    // Start typewriter if textarea is empty
    if (textArea.value.length === 0 && placeholderArray.length > 0) {
      startTypewriterLoop()
    }

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
      window.open(`${targetUrl}?${params.toString()}`, '_blank')
    })
  }

  // AI TASKS
  const aiTasksWrapper = document.querySelector("[data-component='ai-tasks']")
  if (aiTasksWrapper) {
    const items = aiTasksWrapper.querySelectorAll("[data-ai-tasks='item']")
    const spawnPoints = document.querySelectorAll("[data-ai-tasks='spawnpoint']")

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

    // Track which items are currently displayed
    const usedItems = new Set()

    spawnPoints.forEach((spawnPoint) => appendRandomTask(spawnPoint))

    function appendRandomTask(spawnPoint) {
      // Filter out items that are already in use
      const availableItems = itemsJson.filter((item) => !usedItems.has(item.p.text))

      // If all items are used, reset the usedItems set
      if (availableItems.length === 0) {
        usedItems.clear()
        return appendRandomTask(spawnPoint)
      }

      const randomIndex = Math.floor(Math.random() * availableItems.length)
      const randomItem = availableItems[randomIndex]
      usedItems.add(randomItem.p.text)

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

      // If screen width < 992px, use normal scale. Otherwise, 30% chance for item to be further behind
      const depth =
        window.innerWidth < 992
          ? { from: 0.9, to: 1, opacity: 1 }
          : getRandomBetween(0, 1) > 0.7
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
          // Remove the item from used set when it's removed from display
          usedItems.delete(randomItem.p.text)
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
