import { REPO } from '../config.js'

// Lee y guarda public/videos.json en GitHub usando la clave (token) de Ángel.
// La clave vive solo en el navegador de este dispositivo.
const LLAVE = 'anmar-admin-token'
const API = `https://api.github.com/repos/${REPO.dueno}/${REPO.nombre}/contents/${REPO.archivo}`

export const clave = {
  leer: () => { try { return localStorage.getItem(LLAVE) } catch { return null } },
  guardar: (t) => { try { localStorage.setItem(LLAVE, t) } catch {} },
  borrar: () => { try { localStorage.removeItem(LLAVE) } catch {} }
}

async function pedir(url, token, opciones = {}) {
  const r = await fetch(url, {
    ...opciones,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(opciones.body ? { 'Content-Type': 'application/json' } : {})
    }
  })
  if (r.status === 401) throw new Error('La clave no es válida o ya venció.')
  if (r.status === 403 || r.status === 404) throw new Error('La clave no tiene permiso sobre el repositorio del portafolio.')
  if (r.status === 409) throw new Error('Alguien más guardó cambios hace un momento. Recarga la página e inténtalo de nuevo.')
  if (!r.ok) throw new Error(`GitHub respondió con un error (${r.status}).`)
  return r.json()
}

// Texto ⇄ base64 respetando acentos y emojis.
function aBase64(texto) {
  const bytes = new TextEncoder().encode(texto)
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin)
}
function deBase64(b64) {
  const bin = atob(b64.replace(/\n/g, ''))
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))
}

// Devuelve { datos, sha }. "sha" identifica la versión actual del archivo en GitHub.
export async function leerVideos(token) {
  const r = await pedir(`${API}?ref=${REPO.rama}&t=${Date.now()}`, token)
  return { datos: JSON.parse(deBase64(r.content)), sha: r.sha }
}

export async function guardarVideos(token, datos, sha) {
  const r = await pedir(API, token, {
    method: 'PUT',
    body: JSON.stringify({
      message: 'Actualizar videos del portafolio (admin)',
      content: aBase64(JSON.stringify(datos, null, 2) + '\n'),
      sha,
      branch: REPO.rama
    })
  })
  return r.content.sha
}
