// Utilidades compartidas entre la portada y el admin.

// Saca el ID de un link de YouTube: Shorts, watch?v=, youtu.be, embed o live.
export function idDeYoutube(texto) {
  const t = (texto || '').trim()
  if (/^[\w-]{11}$/.test(t)) return t
  const m = t.match(/(?:youtube\.com\/(?:shorts\/|watch\?(?:.*&)?v=|embed\/|live\/)|youtu\.be\/)([\w-]{11})/)
  return m ? m[1] : null
}

// Los Shorts son verticales; el resto se asume horizontal (se puede cambiar en el admin).
export const formatoDeLink = (texto) => (/\/shorts\//.test(texto) ? 'vertical' : 'horizontal')

export const miniatura = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

// Para los Shorts YouTube tiene una miniatura vertical (oar2) más nítida, pero pesa mucho más
// (hasta 1080x1920): se usa solo en el reel grande del inicio, no en la cuadrícula.
// Si no existe, el <img> vuelve a la normal gracias a data-respaldo (ver respaldoMiniaturas).
export const miniaturaVertical = (id) => `https://i.ytimg.com/vi/${id}/oar2.jpg`

export function imgMiniatura(v, extra = '') {
  const vertical = v.formato !== 'horizontal'
  return `<img src="${vertical ? miniaturaVertical(v.id) : miniatura(v.id)}" data-respaldo="${miniatura(v.id)}" alt="" decoding="async" ${extra} />`
}

export function respaldoMiniaturas() {
  document.addEventListener('error', (e) => {
    const img = e.target
    if (img.tagName === 'IMG' && img.dataset.respaldo && img.src !== img.dataset.respaldo) img.src = img.dataset.respaldo
  }, true)
}

export const embed = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`

export const LISTA_VACIA = { categorias: [], videos: [] }

// Primero la lista que maneja el admin en el VPS (/datos/videos.json). Si no está
// (sin señal, en desarrollo o en el respaldo de GitHub Pages), se usa la copia incluida en la web.
export async function cargarVideos() {
  for (const url of ['/datos/videos.json', `${import.meta.env.BASE_URL}videos.json`]) {
    try {
      const r = await fetch(url, { cache: 'no-cache' })
      if (!r.ok || !r.headers.get('content-type')?.includes('json')) continue
      return { ...LISTA_VACIA, ...(await r.json()) }
    } catch {}
  }
  return LISTA_VACIA
}

export const escapar = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
