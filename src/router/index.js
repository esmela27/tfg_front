import { createRouter, createWebHistory } from 'vue-router'
import Login from '../ui/pages/Login.vue'
import CrearCuenta from '../ui/pages/CrearCuenta.vue'
import Canciones from '../ui/pages/Canciones.vue'
import Prueba from '../ui/components/SongPlayer.vue'
import Generos from '../ui/pages/Generos.vue'
import Genero from '../ui/pages/Genero.vue'
import Artistas from '../ui/pages/Artistas.vue'
import Artista from '../ui/pages/Artista.vue'
import Bibliotecas from '../ui/pages/Bibliotecas.vue'
import Biblioteca from '../ui/pages/Biblioteca.vue'

const routes = [
    {
      path: '/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/crearCuenta',
      name: 'CrearCuenta',
      component: CrearCuenta
    },
    {
      path:'/canciones/:usuario',
      name: 'Canciones',
      component: Canciones
    },
    {
      path:'/generos/:usuario',
      name: 'Generos',
      component: Generos
    },
    {
      path:'/genero/:usuario/:genero',
      name: 'Genero',
      component: Genero
    },
    {
      path:'/artistas/:usuario',
      name: 'Artistas',
      component: Artistas
    },
    {
      path:'/artista/:usuario/:artista',
      name: 'Artista',
      component: Artista
    },
    {
      path:'/bibliotecas/:usuario/:id',
      name: 'Bibliotecas',
      component: Bibliotecas
    },
    {
      path:'/biblioteca/:usuario/:id/:idBiblioteca',
      name: 'Biblioteca',
      component: Biblioteca
    },
    {
      path:'/prueba',
      name: 'Prueba',
      component: Prueba
    }
  ]
  const router = createRouter({
    history: createWebHistory(''),
    routes
  })
  
  export default  router