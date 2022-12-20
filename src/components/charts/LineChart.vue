<template>
  <v-progress-circular class="text-end" color="teal" indeterminate :size="20" :width="5"
    v-if="!chartLoaded"></v-progress-circular>
  <v-chip closable v-if="selfFilters" @click:close="resetFilter">
    {{ selfFilters }}
  </v-chip>
  <apexchart class="pivot-chart" :endpoint="endpoint" type="area" :pivot="pivot" :aggregate="aggregate"
    :category="category" :filtersAsDict="filtersAsDict" :filtersAsUrl="filtersAsUrl" :options="chartOptions"
    :series="series" :maximumRows="maximumRows" @markerClick="selectionHandler"></apexchart>
</template>

<script lang="js">
import BaseChart from '../base/BaseChart.vue';
import fa from 'apexcharts/dist/locales/fa.json' assert {type: 'json'};

export default {
  extends: BaseChart,
  props: ["category"],

  data() {
    return {
      chartOptions: {
        chart: {
          id: `line-chart-${this.pivot}`,
          locales: [fa],
          defaultLocale: 'fa',
        },
        noData: {
          text: 'داده‌ای برای نمایش وجود ندارد',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: 'Sahel FD',
            color: '#008ffb'
          }
        },
        title: {
          text: `متوسط تاخیر به تفکیک ${this.verbosePivot()}`,
          align: 'center',
          margin: 10,
          offsetX: -20,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: 'Sahel FD',
            color: '#008ffb'
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
      return (categoryIndex < 9) ? `0${categoryIndex + 1}` : categoryIndex + 1
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
  },
};
</script>