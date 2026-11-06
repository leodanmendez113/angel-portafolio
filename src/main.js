import './styles/base.css'
import './styles/portafolio.css'
import { cargarVideos } from './datos.js'
import { iniciarGrilla } from './grid.js'
import { iniciarMotion, animarTarjetas } from './motion.js'
import { WHATSAPP, WHATSAPP_MENSAJE } from './config.js'

document.querySelector('[data-anio]').textContent = new Date().getFullYear()
const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`
document.querySelectorAll('[data-whatsapp]').forEach((a) => (a.href = wa))

iniciarMotion()
cargarVideos().then((datos) => iniciarGrilla(datos, animarTarjetas))
