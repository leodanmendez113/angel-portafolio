import './styles/base.css'
import './styles/portafolio.css'
import { cargarVideos, respaldoMiniaturas } from './datos.js'
import { iniciarGrilla } from './grid.js'
import { iniciarMotion, animarTarjetas } from './motion.js'
import { iniciarHeroVideo } from './hero.js'
import { cargarContacto, aplicarContacto } from './contacto.js'

document.querySelector('[data-anio]').textContent = new Date().getFullYear()
aplicarContacto()
cargarContacto().then(aplicarContacto)

respaldoMiniaturas()
iniciarMotion()
cargarVideos().then((datos) => {
  iniciarHeroVideo(datos)
  iniciarGrilla(datos, animarTarjetas)
})
