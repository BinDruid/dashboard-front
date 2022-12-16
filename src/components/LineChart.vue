<template>
  <div
    class="spinner-border text-primary spin-on"
    role="status"
    v-if="!chartLoaded"
  >
    <span class="visually-hidden">Loading...</span>
  </div>
  <p v-if="selfFilters">
    {{ selfFilters }}
    <button
      class="btn btn-outline-secondary btn-small"
      :disabled="selfFilters === ''"
      @click="resetFilter"
    >
      بازنشانی
    </button>
  </p>
  <apexchart
    type="area"
    :pivot="pivot"
    :aggregate="aggregate"
    :filtersAsDict="filtersAsDict"
    :filtersAsUrl="filtersAsUrl"
    :options="chartOptions"
    :series="series"
    :maximumRows="maximumRows"
    @markerClick="selectionHandler"
    @zoomed="zoomHandler"
  ></apexchart>
</template>

<script lang="js">
import axios from "axios";
import fa from 'apexcharts/dist/locales/fa.json' assert {type: 'json'};
import BarChart from './BarChart.vue';

export default {
  extends: BarChart,
  data() {
    return {
      chartOptions: {
          chart: {
            id: `bar-chart-${this.pivot}`,
            zoom: {
              enabled: true,
            },
            locales: [fa],
            defaultLocale: 'fa',

          },
          title: {
            text: `متوسط تاخیر به تفکیک ${this.verboosePivot()}`,
            align: 'center',
            margin: 10,
            offsetX: 0,
            offsetY: 0,
            floating: true,
            style: {
              fontSize: '14px',
              fontWeight: 'bold',
              fontFamily: 'Sahel FD',
              color: '#263238'
            },
          },
          xaxis: {
            categories: fa.options.months,
            labels: {
              show: true,
              rotate: -45,
              rotateAlways: true,
              hideOverlappingLabels: true,
              showDuplicates: false,
              trim: false,
              minHeight: undefined,
              maxHeight: 120,
              style: {
                  colors: [],
                  fontSize: '12px',
                  fontFamily: 'Sahel FD',
                  fontWeight: 400,
              },
            },
          },
            dataLabels: {
              enabled: false
            },
        },
    };
  },
  methods: {
    monthConvertor(monthIndex) {
      return (monthIndex < 10) ? `0${monthIndex}` : monthIndex
    },
    selectionHandler(event, chartContext, { seriesIndex, dataPointIndex, config}) {
      const monthString = this.monthConvertor(dataPointIndex)
      this.filterChange (monthString, this.pivot)
    },
    replaceData(data){
      this.series[0].data.length = 0
      data.results.slice(0,this.maximumRows).forEach((dataPoint) => {
        this.series[0].data.push(dataPoint[this.aggregate]);
      });
    },
    zoomHandler(chartContext, { xaxis, yaxis }){
      // console.log(xaxis)
      // console.log(yaxis)
    }
  },
};
</script>

<style scoped>
.spin-on {
  position: relative;
}
</style>
