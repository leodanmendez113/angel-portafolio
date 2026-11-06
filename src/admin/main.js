import '../styles/base.css'
import '../styles/admin.css'
import { clave, leerVideos, guardarVideos } from './github.js'
import { crearEditor } from './editor.js'
import { cargarVideos } from '../datos.js'

const $ = (sel) => document.querySelector(sel)

// Modo demo (solo en la compu de desarrollo, con ?demo): no usa GitHub.
const DEMO = import.meta.env.DEV && new URLSearchParams(location.search).has('demo')

let sha = null
let original = ''
let actual = null

function mostrar(pantalla) {
  $('[data-cargando]').hidden = pantalla !== 'cargando'
  $('[data-acceso]').hidden = pantalla !== 'acceso'
  $('[data-editor]').hidden = pantalla !== 'editor'
}

async function entrar(token) {
  mostrar('cargando')
  const r = DEMO ? { datos: await cargarVideos(), sha: 'demo' } : await leerVideos(token)
  sha = r.sha
  const datos = { categorias: [], videos: [], ...r.datos }
  original = JSON.stringify(datos)
  actual = crearEditor(datos, (estado) => { actual = estado; marcarCambios() })
  mostrar('editor')
}

function marcarCambios() {
  const hay = JSON.stringify(actual) !== original
  $('[data-publicar]').disabled = !hay
  $('[data-estado]').textContent = hay ? 'Tienes cambios sin publicar' : 'Sin cambios'
  $('[data-barra-publicar]').classList.toggle('pendiente', hay)
}

$('[data-form-clave]').addEventListener('submit', async (e) => {
  e.preventDefault()
  const token = $('#clave').value.trim()
  const error = $('[data-error-clave]')
  error.textContent = ''
  try {
    await entrar(token)
    clave.guardar(token)
    $('#clave').value = ''
  } catch (err) {
    mostrar('acceso')
    error.textContent = err.message
  }
})

$('[data-publicar]').addEventListener('click', async () => {
  const boton = $('[data-publicar]')
  boton.disabled = true
  $('[data-estado]').textContent = 'Publicando…'
  try {
    // Se quitan títulos vacíos de espacios antes de guardar.
    actual.videos.forEach((v) => (v.titulo = v.titulo.trim()))
    sha = DEMO ? (console.log('DEMO publicar', actual), 'demo') : await guardarVideos(clave.leer(), actual, sha)
    original = JSON.stringify(actual)
    marcarCambios()
    $('[data-estado]').textContent = '✓ Publicado. La web se actualiza en 1–2 minutos.'
  } catch (err) {
    boton.disabled = false
    $('[data-estado]').textContent = err.message
  }
})

$('[data-salir]').addEventListener('click', () => {
  if (!confirm('¿Cerrar sesión en este dispositivo? Tendrás que pegar la clave de nuevo.')) return
  clave.borrar()
  location.reload()
})

addEventListener('beforeunload', (e) => {
  if (actual && JSON.stringify(actual) !== original) e.preventDefault()
})

const guardada = clave.leer()
if (DEMO || guardada) {
  entrar(guardada).catch((err) => {
    clave.borrar()
    mostrar('acceso')
    $('[data-error-clave]').textContent = err.message
  })
} else {
  mostrar('acceso')
}
