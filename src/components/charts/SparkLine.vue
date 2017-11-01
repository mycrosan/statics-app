<template>
  <div :dataLoad="dataLoad" :propCol="propCol" :statistics="statistics" ref="chart"></div>
</template>
<script>
import Highcharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more'
highchartsMore(Highcharts)

import highchartsMixin from '@/mixins/highcharts'

export default{
  name: 'SparkLine',
  mixins: [highchartsMixin],
  components: {
    Highcharts
  },
  props: ['dataLoad', 'propCol', 'statistics'],
  data () {
    return {
      dataLine: this.dataLoad,
      dataCol: this.propCol,
      options: {
        chart: {
          backgroundColor: '#F6F6F6',
          borderWidth: 0,
          type: 'area',
          margin: [0, 0, 0, 0],
          width: 120,
          height: 20,
          style: {
            overflow: 'visible'
          },
          skipClone: true
        },
        title: {
          text: ''
        },
        credits: {
          enabled: false
        },
        legend: {
          enabled: false
        },
        xAxis: {
          labels: {
            enabled: false
          },
          tickLength: 0
        },
        yAxis: {
          title: {
            text: null
          },
          maxPadding: 0,
          minPadding: 0,
          gridLineWidth: 0,
          ticks: false,
          endOnTick: false,
          labels: {
            enabled: false
          }
        },
        tooltip: {
          formatter: function () {
            if (this.point.date === undefined) {
              return '<b>' + this.series.name + '</b><br/>' + this.point.status
            } else {
              return '<b>' + this.series.name + '</b><br/>' + this.point.date + ' - ' + this.point.status
            }
          },
          borderWidth: 0,
          shadow: false,
          useHTML: true,
          hideDelay: 0,
          padding: 0,
          positioner: function (w, h, point) {
            return {
              x: point.plotX - w / 2,
              y: point.plotY - h
            }
          }
        },
        plotOptions: {
          series: {
            enableMouseTracking: true,
            lineWidth: 1,
            shadow: false,
            states: {
              hover: {
                lineWidth: 1
              }
            },
            marker: {
              radius: 2
            }
          }
        }
      }
    }
  },
  mounted () {
    var self = this
    var options = {}
    options.series = []
    var element = {type: 'line', data: []}
    this.propCol.forEach(function (itemHeaderCol, index) {
      element.data.push({
        x: index,
        y: self.dataLoad[itemHeaderCol.id],
        date: itemHeaderCol.value,
        status: 'Baseline'
      })
    })
    var statistics = 0
    element.data.forEach(function (itemHeaderCol, index) {
      statistics += element.data[(index - 1)] ? ((element.data[index].y - element.data[(index - 1)].y)) : 0
    })
    self.dataLoad.statistics = statistics
    options.series.push(element)
    this.target = Highcharts.chart(this.$el, Object.assign({}, self.options, options))
  },
  methods: {
    updateStatistics: function (statistics) {
      this.statistics.data = statistics
    }
  }
}
</script>
