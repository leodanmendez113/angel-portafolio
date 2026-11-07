import { imgMiniatura } from './datos.js'

// Reel aleatorio dentro del marco "REC" del inicio.
// Primero se ve la miniatura (carga al instante); el video de YouTube, mudo y en bucle,
// se carga cuando la página ya terminó de cargar, para no frenar la primera pantalla.
// Se pausa cuando el inicio sale de pantalla, así no gasta batería ni datos.
export function iniciarHeroVideo(datos) {
  const caja = document.querySelector('[data-hero-video]')
  const candidatos = datos.videos.filter((v) => !v.oculto && v.formato !== 'horizontal')
  if (!caja || !candidatos.length) return

  const v = candidatos[Math.floor(Math.random() * candidatos.length)]
  caja.innerHTML = imgMiniatura(v)

  // Sin video si la persona pidió reducir movimiento o ahorrar datos: queda la miniatura.
  const ahorro = navigator.connection?.saveData
  if (ahorro || matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const params = new URLSearchParams({
    autoplay: 1, mute: 1, loop: 1, playlist: v.id, controls: 0, playsinline: 1,
    modestbranding: 1, rel: 0, disablekb: 1, fs: 0, iv_load_policy: 3, enablejsapi: 1
  })
  const cargar = () => {
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.youtube-nocookie.com/embed/${v.id}?${params}`
    iframe.title = 'Reel de muestra'
    iframe.tabIndex = -1
    iframe.allow = 'autoplay; encrypted-media'
    caja.append(iframe)
    mostrarCuandoReproduzca(iframe, caja)
    pausarFueraDePantalla(iframe)
  }
  if (document.readyState === 'complete') setTimeout(cargar, 300)
  else addEventListener('load', () => setTimeout(cargar, 300), { once: true })
}

// El video se hace visible recién unos segundos después de empezar a reproducirse:
// así no se ven la pantalla negra de carga ni el título y los botones que YouTube muestra al inicio.
// Si el navegador bloquea la reproducción automática, queda la miniatura.
function mostrarCuandoReproduzca(iframe, caja) {
  const REPRODUCIENDO = 1
  let listo = false
  const escuchar = () =>
    iframe.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), '*')
  iframe.addEventListener('load', escuchar)

  addEventListener('message', function alMensaje(e) {
    if (e.source !== iframe.contentWindow || listo) return
    let datos
    try { datos = JSON.parse(e.data) } catch { return }
    const estado = datos.event === 'onStateChange' ? datos.info : datos.info?.playerState
    if (estado !== REPRODUCIENDO) return
    listo = true
    removeEventListener('message', alMensaje)
    setTimeout(() => caja.classList.add('reproduciendo'), 3000)
  })
}

function pausarFueraDePantalla(iframe) {
  const orden = (func) =>
    iframe.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*')
  new IntersectionObserver(([e]) => orden(e.isIntersecting ? 'playVideo' : 'pauseVideo'))
    .observe(document.querySelector('.hero'))
}
