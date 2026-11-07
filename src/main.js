import './styles/base.css'
import './styles/portafolio.css'
import { cargarVideos, respaldoMiniaturas } from './datos.js'
import { iniciarGrilla } from './grid.js'
import { iniciarMotion, animarTarjetas } from './motion.js'
import { iniciarHeroVideo } from './hero.js'
import { WHATSAPP, WHATSAPP_MENSAJE } from './config.js'

document.querySelector('[data-anio]').textContent = new Date().getFullYear()
const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`
document.querySelectorAll('[data-whatsapp]').forEach((a) => (a.href = wa))

respaldoMiniaturas()
iniciarMotion()
cargarVideos().then((datos) => {
  iniciarHeroVideo(datos)
  iniciarGrilla(datos, animarTarjetas)
})
