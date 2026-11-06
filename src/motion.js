import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const conMovimiento = () => matchMedia('(prefers-reduced-motion: no-preference)').matches

// Animaciones por scroll de la portada. Con "reducir movimiento" no se anima nada.
export function iniciarMotion() {
  const mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Entrada del título, fila por fila.
    gsap.from('.hero-titulo .fila', { yPercent: 100, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1 })
    gsap.from('.hero .ceja, .hero-sub, .hero-pie', { y: 24, opacity: 0, duration: 0.9, delay: 0.35, stagger: 0.1, ease: 'power3.out' })

    // Al bajar, las filas del título se separan hacia los lados y el marco de cámara se agranda.
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 } })
      .to('.f1', { xPercent: -18 }, 0)
      .to('.f2', { xPercent: 10 }, 0)
      .to('.f3', { xPercent: -8 }, 0)
      .to('.marco', { scale: 1.25, opacity: 0 }, 0)
      .to('.hero-sub, .hero-pie', { opacity: 0, y: -30 }, 0)

    // Código de tiempo que avanza con el scroll, como en una línea de tiempo de edición.
    const tc = document.querySelector('[data-timecode]')
    const dos = (n) => String(Math.floor(n)).padStart(2, '0')
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        const s = self.progress * 90
        tc.textContent = `00:${dos(s / 60)}:${dos(s % 60)}:${dos((s * 24) % 24)}`
      }
    })

    // Cinta que corre sola y acelera según la velocidad del scroll.
    const cinta = gsap.to('.cinta-pista', { xPercent: -50, duration: 22, ease: 'none', repeat: -1 })
    ScrollTrigger.create({
      onUpdate: (self) => {
        const v = Math.min(Math.abs(self.getVelocity()) / 400, 4)
        gsap.to(cinta, { timeScale: 1 + v, duration: 0.2, overwrite: true })
        gsap.to(cinta, { timeScale: 1, duration: 0.8, delay: 0.2 })
      }
    })

    gsap.from('.trab-cabecera > *', {
      y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.trabajos', start: 'top 80%' }
    })

    gsap.fromTo('.cierre-titulo span', { xPercent: -12, opacity: 0.2 }, {
      xPercent: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: '.cierre', start: 'top bottom', end: 'center center', scrub: true }
    })
    gsap.fromTo('.cierre-titulo em', { xPercent: 12, opacity: 0.2 }, {
      xPercent: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: '.cierre', start: 'top bottom', end: 'center center', scrub: true }
    })
  })
}

// Las tarjetas entran en grupos a medida que aparecen. Se llama cada vez que cambia el filtro.
// Usa transiciones CSS (más livianas que GSAP para muchas tarjetas) y nunca deja una tarjeta oculta
// si el navegador no soporta IntersectionObserver.
let observador = null
export function animarTarjetas() {
  observador?.disconnect()
  ScrollTrigger.refresh()
  if (!conMovimiento() || !('IntersectionObserver' in window)) return
  observador = new IntersectionObserver((entradas) => {
    entradas.filter((e) => e.isIntersecting).forEach((e, i) => {
      e.target.style.transitionDelay = `${i * 70}ms`
      e.target.classList.add('revelada')
      observador.unobserve(e.target)
    })
  }, { rootMargin: '0px 0px -6% 0px' })
  document.querySelectorAll('.tarjeta').forEach((t) => {
    t.classList.add('por-revelar')
    observador.observe(t)
  })
}
