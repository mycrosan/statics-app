<template>
  <div :options="options" :dataLoad="transformToChart(dataLoad)"></div>
</template>

<script>
import Highcharts from 'highcharts-more-node'
import highchartsMixin from '@/mixins/highcharts'
// import {chunk} from 'lodash'
export default{
  name: 'chart',
  mixins: [highchartsMixin],
  components: {
    Highcharts
  },
  props: ['dataLoad'],
  data () {
    return {
      options: {
        chart: {
          zoomType: 'x'
        },
        legend: {
          enabled: false
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
        },
        yAxis: {
          title: {
            text: 'Quantidade'
          }
        },
        tooltip: {
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          series: {
            animation: false,
            marker: {
              enabled: false
            }
          }
        },
        series: []
      },
      target: null
    }
  },
  updated: function () {
    this.$nextTick(function () {
      this.load()
    })
  },
  methods: {
    load () {
      // var self = this
      var dataParse = JSON.parse(JSON.stringify(this.dataLoad.series))
      var dataCategories = JSON.parse(JSON.stringify(this.dataLoad.categories))
      var options = Object.assign({}, JSON.parse(JSON.stringify(this._data.options)),
        {series: dataParse},
        {xAxis: {categories: dataCategories, labels: {rotation: -45}}})
      this.target = Highcharts.chart(this.$el, options)
      this.target.addSeries(this.dataLoad.avgSerie)
    },
    transformToChart: function (data) {
      return this.transformData(data)
    }
  },
  beforeDestroy: function () {
    this.target.destroy()
  }
}
</script>
