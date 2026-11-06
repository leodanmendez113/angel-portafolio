import { embed, escapar } from './datos.js'

// Visor a pantalla completa. El reproductor de YouTube se carga solo al abrir,
// así la portada no descarga nada de YouTube hasta que alguien toca un video.
const visor = document.querySelector('[data-visor]')
const caja = document.querySelector('[data-visor-caja]')
const titulo = document.querySelector('[data-visor-titulo]')
let origen = null

export function abrirVisor(v) {
  origen = document.activeElement
  caja.className = `visor-caja ${v.formato === 'horizontal' ? 'ancha' : ''}`
  caja.innerHTML = `<iframe src="${embed(v.id)}" title="${escapar(v.titulo || 'Video')}"
    allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`
  titulo.textContent = v.titulo || ''
  visor.showModal()
  document.documentElement.classList.add('sin-scroll')
}

function cerrar() {
  if (visor.open) visor.close()
}

visor.addEventListener('close', () => {
  caja.innerHTML = '' // detiene el video
  document.documentElement.classList.remove('sin-scroll')
  origen?.focus()
})
visor.querySelector('[data-cerrar]').addEventListener('click', cerrar)
// Tocar fuera del video también cierra.
visor.addEventListener('click', (e) => { if (e.target === visor) cerrar() })
