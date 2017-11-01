import {indexOf, chunk} from 'lodash'
export default {
  methods: {
    transformData (dataDb) {
      if (dataDb.data) {
        var avgItem = {}
        if (dataDb.avg) {
          avgItem = dataDb.avg[0]
        }
        dataDb.series = []
        dataDb.categories = []
        dataDb.data.forEach(function (itemLine) {
          var serie = {}
          serie.zIndex = 0
          serie.data = []
          dataDb.header.row.forEach(function (itemHeaderRow) {
            serie.name = itemLine[itemHeaderRow.id]
          })
          if (dataDb.header.col.length) {
            dataDb.header.col.forEach(function (itemHeaderCol) {
              serie.data.push({ name: itemHeaderCol.value, y: itemLine[itemHeaderCol.id] })
              if (indexOf(dataDb.categories, itemHeaderCol.value) === -1) {
                dataDb.categories.push(itemHeaderCol.value)
              }
            })
          } else {
            serie.data.push(itemLine[dataDb.header.expr[0].id])
          }
          dataDb.series.push(serie)
        })
        var avgSerie = {}
        avgSerie.data = []
        avgSerie.type = 'arearange'
        avgSerie.zIndex = 1
        avgSerie.linkedTo = ':previous'
        avgSerie.name = 'Média'
        avgSerie.color = 'red'
        dataDb.header.col.forEach(function (itemHeaderCol) {
          var low = avgItem[itemHeaderCol.id] - (avgItem[itemHeaderCol.id] * 0.2)
          var high = avgItem[itemHeaderCol.id] + (avgItem[itemHeaderCol.id] * 0.2)
          avgSerie.data.push([itemHeaderCol.value, low, high])
        })
        dataDb.avgSerie = avgSerie
      }
      return dataDb
    },
    quarterTransformDataRow (dataDb) {
      var arrayQuarter = []
      var quarterNumber = Math.ceil(dataDb.data.length / 4)
      var chuckArray = chunk(dataDb.data, quarterNumber)
      chuckArray.forEach(function (itemChuck) {
        var item = {}
        item.name = itemChuck[0].name + ' - ' + itemChuck[(itemChuck.length - 1)].name
        item.y = 0
        itemChuck.forEach(function (scopeChuck) {
          item.y += scopeChuck.y
        })
        arrayQuarter.push(item)
      })
      dataDb.data = arrayQuarter
      return dataDb
    },

    somaAcumulada (dataDb, header) {
      // console.log(dataDb, header)
      var statistics = 0
      header.forEach(function (itemHeaderCol, index) {
        statistics += header[(index - 1)] ? ((dataDb[header[index].id] - dataDb[header[(index - 1)].id])) : 0
      })
      return statistics
    },

    transformSimpleSerie (dataDb) {
      var series = []
      dataDb.data.forEach(function (item) {
        var serie = {}
        serie.name = ''
        serie.weight = 0
        dataDb.header.row.forEach(function (row) {
          serie.name = item[row.id]
        })
        dataDb.header.expr.forEach(function (expr) {
          serie.weight = item[expr.id]
        })
        series.push(serie)
      })
      return series
    }
  }
}
