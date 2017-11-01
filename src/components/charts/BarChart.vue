<script>
import Chart from './Chart'
export default{
  extends: Chart,
  props: ['dataLoad'],
  data () {
    return {
      options: {
        chart: {
          type: 'bar',
          spacingTop: 0,
          spacingBottom: 0,
          plotBackgroundColor: '#FFF'
        },
        legend: {
          enabled: true,
          verticalAlign: 'top'
        },
        xAxis: {
          lineWidth: 0,
          minorGridLineWidth: 0,
          lineColor: 'transparent',
          minorTickLength: 0,
          gridLineWidth: 0,
          alternateGridColor: '#F3F5F6'
        },
        yAxis: {
          lineWidth: 0,
          minorGridLineWidth: 0,
          lineColor: 'transparent',
          minorTickLength: 0,
          gridLineWidth: 0,
          alternateGridColor: '#F3F5F6',
          title: {
            text: ''
          },
          labels: {
            enabled: false
          }
        },
        plotOptions: {
          series: {
            minPointLength: 1,
            pointWidth: 20,
            dataLabels: {
              enabled: true,
              style: {
                fontSize: '13px',
                fontWeight: 'bold'
              }
            },
            pointPadding: 0,
            alignCustom: true,
            animation: false,
            stickyTracking: true,
            shadow: false
          }
        }
      }
    }
  }
}
</script>
