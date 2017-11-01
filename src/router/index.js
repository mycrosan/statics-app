import Vue from 'vue'
import Router from 'vue-router'
import Conteudo from '@/components/Conteudo'
import Usuario from '@/components/Usuario'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/conteudo',
      name: 'conteudo',
      component: Conteudo
    },
    {
      path: '/usuario',
      name: 'usuario',
      component: Usuario
    }
  ]
})
