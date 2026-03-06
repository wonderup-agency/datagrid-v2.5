/**
 *
 * @param {HTMLElement} component
 */
export default function (component) {
  const richTextEl = document.querySelector("[data-msa='rich-text']")
  const tablesJsonEl = document.querySelector("[data-msa='tables-json']")

  if (!richTextEl || !tablesJsonEl) return

  const raw = tablesJsonEl.textContent.trim().replace(/[\u0000-\u001F\u007F]/g, ' ') // strip control characters
  if (!raw) return

  let tables
  try {
    tables = JSON.parse(raw)
  } catch (e) {
    console.error('Failed to parse tables JSON:', e)
    return
  }

  tables.forEach(({ id, html }) => {
    richTextEl.innerHTML = richTextEl.innerHTML.replace(
      new RegExp(`<p[^>]*>%%${id}%%<\\/p>`),
      `<div class="table-wrapper">${html}</div>`
    )
  })
}
