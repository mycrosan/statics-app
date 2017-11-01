<template>
  <div class="container-fluid">
    <div class="row">
      <app-menu></app-menu>
      <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        aaaa
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Multiselect from 'vue-multiselect'
import DatePicker from 'vue2-datepicker'
import AppMenu from '@/components/layout/AppMenu'
import LineChart from './charts/LineChart'
import SparkLine from './charts/SparkLine'
import TagCloud from './charts/TagClound'

export default {
  name: 'usuario',
  components: {AppMenu, LineChart, SparkLine, TagCloud, Multiselect, DatePicker},
  computed: {
    ...mapGetters({'query': 'loadReport'})
  },
  methods: {
    ...mapActions(['loadReport'])
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
  <style>
.spark-cont {
  height: 30px;
  width: 200px;
  display: inline-block
}
</style>
