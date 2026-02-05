import * as noUiSlider from 'nouislider'
import '../styles/nouislider.css'
import 'nouislider/dist/nouislider.css'

const PRICING_TABLE = {
  1000: 90,
  3000: 270,
  5000: 450,
  10000: 720,
  25000: 1800,
  50000: 3600,
  75000: 4860,
  100000: 6480,
  125000: 8100,
  150000: 8748,
  200000: 11664,
  250000: 14580,
  300000: 16621,
  400000: 22162,
}

/**
 *
 * @param {HTMLElement} component
 */
export default function (component) {
  const cards = component.querySelectorAll("[data-pricing='card']")

  // --- utilities ---
  const matchCardHeights = () => {
    const blocks = [...component.querySelectorAll("[data-pricing='card'] .pricing_cards_block")]
    blocks.forEach((b) => (b.style.height = '')) // reset before measuring
    if (window.innerWidth > 767 && blocks.length) {
      const maxHeight = Math.max(...blocks.map((b) => b.offsetHeight))
      blocks.forEach((b) => (b.style.height = `${maxHeight}px`))
    }
  }

  const expandFeaturedCard = () => {
    if (window.innerWidth > 992) {
      cards[0].parentElement.style.height = '' // reset
      const cardsHeight = cards[0].offsetHeight
      cards[0].parentElement.style.height = cardsHeight + 'px'

      const featuredCard = component.querySelector(
        '[data-wf--nested-pricing-card-variant--variant="visible"]'
      )?.parentElement
      if (!featuredCard) return

      featuredCard.style.height = '' // reset
      const children = Array.from(component.children).slice(1)
      const totalHeight = children.reduce((sum, child) => sum + child.offsetHeight, 0)
      featuredCard.style.height = featuredCard.offsetHeight + totalHeight + 'px'
    } else {
      // cleanup if <992
      const featuredCard = component.querySelector(
        '[data-wf--nested-pricing-card-variant--variant="visible"]'
      )?.parentElement
      if (featuredCard) {
        featuredCard.style.height = ''
        featuredCard.parentElement.style.height = ''
      }
    }
  }

  // initial run
  matchCardHeights()
  expandFeaturedCard()

  // re-run on resize
  window.addEventListener('resize', () => {
    matchCardHeights()
    expandFeaturedCard()
  })

  // --- slider logic (unchanged) ---
  cards.forEach((card) => {
    const slider = card.querySelector("[data-pricing='range']")
    const creditsEl = card.querySelector("[data-pricing='credits']")
    const costPerMonth = parseFloat(card.dataset.price || '0')
    const costPerMonthEl = card.querySelector("[data-pricing='cost-per-month']")
    const priceEl = card.querySelector("[data-pricing='price-element']")
    const salesEl = card.querySelector("[data-pricing='talk-to-sales']")
    const button = card.querySelector('a')

    if (!slider || !creditsEl || !button) return

    const btnDefault = { text: button.parentElement.querySelector('span').textContent, href: button.href }
    console.log(btnDefault)

    if (costPerMonth && costPerMonthEl) {
      costPerMonthEl.textContent = costPerMonth
    }

    noUiSlider.create(slider, {
      start: [1000],
      connect: 'lower',
      snap: true,
      range: {
        min: 1000,
        '8%': 3000,
        '15%': 5000,
        '23%': 10000,
        '31%': 25000,
        '38%': 50000,
        '46%': 75000,
        '54%': 100000,
        '62%': 125000,
        '69%': 150000,
        '77%': 200000,
        '85%': 250000,
        '92%': 300000,
        max: 400000,
      },
    })

    slider.noUiSlider.on('update', ([val]) => {
      const value = Number(val)
      creditsEl.textContent = value.toLocaleString('en-US')

      if (costPerMonthEl && PRICING_TABLE[value] !== undefined) {
        costPerMonthEl.textContent = PRICING_TABLE[value].toLocaleString('en-US')
      }

      const overCap = value >= 400000
      priceEl.style.display = overCap ? 'none' : 'block'
      salesEl.style.display = overCap ? 'block' : 'none'
      button.href = overCap ? 'https://book.avoma.com/toric/samuel/datagrid-demo-request/' : btnDefault.href
      button.parentElement.querySelector('span').textContent = overCap ? 'Talk to sales' : btnDefault.text
    })
  })
}
