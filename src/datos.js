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

export const embed = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`

export const LISTA_VACIA = { categorias: [], videos: [] }

export async function cargarVideos() {
  try {
    const r = await fetch(`${import.meta.env.BASE_URL}videos.json?t=${Date.now()}`)
    if (!r.ok) throw new Error(r.status)
    const datos = await r.json()
    return { ...LISTA_VACIA, ...datos }
  } catch {
    return LISTA_VACIA
  }
}

export const escapar = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
