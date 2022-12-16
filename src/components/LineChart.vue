<template>
  <div class="spinner-grow spinner-grow-sm text-primary" role="status" v-if="!chartLoaded">
    <span class="visually-hidden">Loading...</span>
  </div>
  <p v-if="selfFilters">
    {{ selfFilters }}
    <a class="reset-btn mx-2" :disabled="selfFilters === ''" @click="resetFilter" role="button">
      بازنشانی
    </a>
  </p>
  <apexchart type="area" :pivot="pivot" :aggregate="aggregate" :category="category" :filtersAsDict="filtersAsDict"
    :filtersAsUrl="filtersAsUrl" :options="chartOptions" :series="series" :maximumRows="maximumRows"
    @markerClick="selectionHandler" @zoomed="zoomHandler"></apexchart>
</template>

<script lang="js">
import BaseChart from './base/BaseChart.vue';
import fa from 'apexcharts/dist/locales/fa.json' assert {type: 'json'};

export default {
  extends: BaseChart,
  props: ["category"],

  data() {
    return {
      baseUrl: `${this.apiEndPoint}/?pivot=${this.pivot}`,
      chartOptions: {
        chart: {
          id: `line-chart-${this.pivot}`,
          zoom: {
            enabled: true,
          },
          locales: [fa],
          defaultLocale: 'fa',
        },
        title: {
          text: `متوسط تاخیر به تفکیک ${this.verbosePivot()}`,
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
          categories: this.categorySelector(),
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
    categorySelector() {
      switch (this.category) {
        case "year":
          return this.yearCategory
        case "month":
          return this.monthCategory

      }
    },
    categoryConvertor(categoryIndex) {
      return (categoryIndex < 10) ? `0${categoryIndex}` : categoryIndex
    },
    selectionHandler(event, chartContext, { seriesIndex, dataPointIndex, config }) {
      let categoryString = ""
      if (this.category === "month") categoryString = this.categoryConvertor(dataPointIndex)
      if (this.category === "year") categoryString = this.chartOptions.xaxis.categories[dataPointIndex]
      this.filterChange(categoryString, this.pivot)
    },
    replaceData(data) {
      this.series[0].data.length = 0
      data.results.slice(0, this.maximumRows).forEach((dataPoint) => {
        this.series[0].data.push(dataPoint[this.aggregate]);
      });
    },
    zoomHandler(chartContext, { xaxis, yaxis }) {
      // console.log(xaxis)
      // console.log(yaxis)
    }
  },
};
</script>