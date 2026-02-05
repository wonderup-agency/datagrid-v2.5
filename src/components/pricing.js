import * as noUiSlider from 'nouislider'
import '../styles/nouislider.css'
import 'nouislider/dist/nouislider.css'

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
        '10%': 3000,
        '19%': 10000,
        '29%': 25000,
        '38%': 50000,
        '48%': 75000,
        '57%': 100000,
        '71%': 200000,
        '86%': 300000,
        max: 400000,
      },
    })

    slider.noUiSlider.on('update', ([val]) => {
      const value = Number(val)
      creditsEl.textContent = value.toLocaleString('en-US')

      if (costPerMonth && costPerMonthEl) {
        costPerMonthEl.textContent = ((value * costPerMonth) / 1000).toLocaleString('en-US')
      }

      const overCap = value > 300000
      priceEl.style.display = overCap ? 'none' : 'block'
      salesEl.style.display = overCap ? 'block' : 'none'
      button.href = overCap ? 'https://book.avoma.com/toric/samuel/datagrid-demo-request/' : btnDefault.href
      button.parentElement.querySelector('span').textContent = overCap ? 'Talk to sales' : btnDefault.text
    })
  })
}
