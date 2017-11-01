<template>
  <div :dataLoad="dataLoad"></div>
</template>
<script>
import Highcharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more'
highchartsMore(Highcharts)
require('highcharts/modules/wordcloud')(Highcharts)

import highchartsMixin from '@/mixins/highcharts'
export default{
  name: 'TagCloud',
  props: ['dataLoad'],
  mixins: [highchartsMixin],
  components: {
    Highcharts
  },
  updated: function () {
    this.load()
    /* self.dataTag.data.forEach(function (item, index) {
      console.log(item)
    }) */
  },
  data () {
    return {
      dataTag: this.dataLoad,
      options: {
        chart: {
          type: 'wordcloud'
        },
        credits: {
          enabled: false
        },
        series: [{
          type: 'wordcloud',
          data: []
        }],
        title: {
          text: ''
        }
      }
    }
  },
  methods: {
    load () {
      var series = this.transformSimpleSerie(this.dataLoad)
      this._data.options.series[0].data = series
      var options = Object.assign({}, JSON.parse(JSON.stringify(this._data.options)))
      this.target = Highcharts.chart(this.$el, options)
    }
  }
}
</script>
