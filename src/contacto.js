import { WHATSAPP, WHATSAPP_MENSAJE, SITIO } from './config.js'

// Datos de contacto que maneja el admin (/datos/contacto.json): WhatsApp, email, redes y el
// mensaje de WhatsApp de esta web. Si el archivo no se puede leer, quedan los de config.js.
// (Este archivo es igual en portafolio, cotizador y comercial; solo cambia SITIO en config.js.)
export const CONTACTO = { whatsapp: WHATSAPP, email: '', instagram: '', tiktok: '', youtube: '', mensaje: WHATSAPP_MENSAJE }

export async function cargarContacto() {
  try {
    const r = await fetch('/datos/contacto.json', { cache: 'no-cache' })
    if (!r.ok || !r.headers.get('content-type')?.includes('json')) return
    const d = await r.json()
    if (/^\d{8,15}$/.test(d.whatsapp)) CONTACTO.whatsapp = d.whatsapp
    for (const campo of ['email', 'instagram', 'tiktok', 'youtube']) {
      if (typeof d[campo] === 'string') CONTACTO[campo] = d[campo]
    }
    if (d.mensajes?.[SITIO]) CONTACTO.mensaje = d.mensajes[SITIO]
  } catch {}
}

export const linkWhatsApp = (texto = CONTACTO.mensaje) =>
  `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`

const escapar = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

const trazo = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'
const ICONOS = {
  email: `<path ${trazo} d="M4 6h16v12H4z"/><path ${trazo} d="m4 7 8 6 8-6"/>`,
  instagram: `<rect ${trazo} x="3.5" y="3.5" width="17" height="17" rx="5"/><circle ${trazo} cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor"/>`,
  tiktok: `<path ${trazo} d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5"/><path ${trazo} d="M14 4c.5 2.6 2.3 4.2 5 4.4"/>`,
  youtube: `<rect ${trazo} x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9.2 5 2.8-5 2.8z" fill="currentColor"/>`
}

// Pone el WhatsApp en todos los [data-whatsapp] y dibuja email y redes en [data-redes].
// Las redes vacías no se muestran.
export function aplicarContacto() {
  document.querySelectorAll('[data-whatsapp]').forEach((a) => (a.href = linkWhatsApp()))
  const nav = document.querySelector('[data-redes]')
  if (!nav) return
  const enlaces = [
    CONTACTO.email && ['email', `mailto:${CONTACTO.email}`, `Escribir a ${CONTACTO.email}`],
    CONTACTO.instagram && ['instagram', `https://instagram.com/${CONTACTO.instagram}`, 'Instagram'],
    CONTACTO.tiktok && ['tiktok', `https://www.tiktok.com/@${CONTACTO.tiktok}`, 'TikTok'],
    CONTACTO.youtube && ['youtube', CONTACTO.youtube, 'YouTube']
  ].filter(Boolean)
  nav.hidden = !enlaces.length
  nav.innerHTML = enlaces.map(([icono, href, etiqueta]) => `
    <a href="${escapar(href)}" ${icono === 'email' ? '' : 'target="_blank" rel="noopener"'} aria-label="${escapar(etiqueta)}">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">${ICONOS[icono]}</svg>
    </a>`).join('')
}
