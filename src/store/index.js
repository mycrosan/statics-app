import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const state = {
  querys: []
}
const mutations = {
  fetchConsultas (state, data) {
    state.querys = data
  }
}
const getters = {
  getQuery: state => state.querys
}
const actions = {
  async loadReport ({commit}, jsonQuery) {
    try {
      let {data} = await axios.get('/statics/query?filter=' + JSON.stringify(jsonQuery))
      return Promise.resolve(data)
    } catch (err) {

    }
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
