/**
 *
 * @param {HTMLElement} component
 */
export default function (component) {
  const list = component.querySelector("[fs-list-element='list']")
  if (!list) return

  const urlPrefix = 'https://docs.datagrid.com/connectors/'
  list.childNodes.forEach((item) => {
    const link = item.querySelector('a')
    const href = link.getAttribute('href') || ''
    const slug = href.replace(/^\/+|\/+$/g, '')
    if (slug) link.setAttribute('href', `${urlPrefix}${slug}`)
  })
}
