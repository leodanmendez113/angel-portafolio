import { miniatura, escapar } from './datos.js'
import { abrirVisor } from './visor.js'

const TODOS = '__todos'

// Pinta los filtros y la cuadrícula. Devuelve una función que se llama al cambiar de filtro.
export function iniciarGrilla(datos, alPintar) {
  const videos = datos.videos.filter((v) => !v.oculto)
  const grilla = document.querySelector('[data-grilla]')
  const filtros = document.querySelector('[data-filtros]')
  const vacio = document.querySelector('[data-vacio]')

  document.querySelector('[data-total]').textContent = videos.length

  if (!videos.length) {
    vacio.hidden = false
    filtros.hidden = true
    return
  }

  // Solo se muestran las categorías que tienen al menos un video visible.
  const usadas = datos.categorias.filter((c) => videos.some((v) => v.categoria === c))
  filtros.hidden = usadas.length < 2
  filtros.innerHTML = [[TODOS, 'Todos'], ...usadas.map((c) => [c, c])]
    .map(([valor, texto]) => `<button type="button" data-cat="${escapar(valor)}">${escapar(texto)}</button>`)
    .join('')

  let actual = TODOS
  const pintar = () => {
    const lista = actual === TODOS ? videos : videos.filter((v) => v.categoria === actual)
    grilla.innerHTML = lista.map(tarjeta).join('')
    filtros.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.cat === actual))
    alPintar?.()
  }

  filtros.addEventListener('click', (e) => {
    const b = e.target.closest('button')
    if (!b || b.dataset.cat === actual) return
    actual = b.dataset.cat
    pintar()
  })

  grilla.addEventListener('click', (e) => {
    const t = e.target.closest('[data-id]')
    if (!t) return
    const v = videos.find((x) => x.id === t.dataset.id)
    abrirVisor(v)
  })

  pintar()
}

function tarjeta(v, i) {
  const titulo = escapar(v.titulo || 'Video sin título')
  return `
    <button type="button" class="tarjeta ${v.formato === 'horizontal' ? 'ancha' : ''}" data-id="${escapar(v.id)}" aria-label="Reproducir: ${titulo}">
      <img src="${miniatura(v.id)}" alt="" loading="${i < 4 ? 'eager' : 'lazy'}" decoding="async" width="480" height="360" />
      <span class="tarjeta-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M8 5.5v13l10.5-6.5z"/></svg></span>
      <span class="tarjeta-info">
        ${v.categoria ? `<small>${escapar(v.categoria)}</small>` : ''}
        <strong>${titulo}</strong>
      </span>
    </button>`
}
