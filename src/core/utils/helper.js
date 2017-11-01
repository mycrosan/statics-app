import {extend, findIndex} from 'lodash'

export const helper = {

  /**
   * Faz o merge dos arrays pelo ID de seus objetos.
   *
   * @param {Array} oldData
   * @param {Array} newData
   */
  mergeById: (oldData, newData) => {
    newData.forEach(item => {
      // Obtém o index do registro
      let index = findIndex(oldData, {
        id: item.id
      })
      // Se retornou um índice válido
      if (index > -1) {
        oldData[index] = extend(oldData[index], item)
      } else {
        oldData.push(item)
      }
    })
    return oldData
  }
}
