<template>
  <v-progress-circular color="teal" indeterminate :size="20" :width="5" v-if="!chartLoaded"></v-progress-circular>
  <p v-if="selfFilters">
    {{ selfFilters }}
    <v-btn icon color="info" size="x-small" :disabled="selfFilters === ''" @click="resetFilter">
      <v-icon>mdi-cached</v-icon>
    </v-btn>
  </p>
  <apexchart class="pivot-chart" :pivot="pivot" :aggregate="aggregate" :category="category"
    :filtersAsDict="filtersAsDict" :filtersAsUrl="filtersAsUrl" :options="chartOptions" :series="series"
    :maximumRows="maximumRows" @markerClick="selectionHandler" @zoomed="zoomHandler"></apexchart>
</template>

<script lang="js">
import axios from "axios";
import LineCHart from './LineChart.vue';
import fa from 'apexcharts/dist/locales/fa.json' assert {type: 'json'};

export default {
  extends: LineCHart,

  data() {
    return {
      chartOptions: {
        chart: {
          id: `line-chart-${this.pivot}-2`,
          locales: [fa],
          defaultLocale: 'fa',
          height: 100
        },
        title: {
          text: `روند تاخیرات در دو سال متوالی به تفکیک ${this.verbosePivot()}`,
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
        yaxis: {
          tooltip: {
            enabled: true,
            offsetX: 0,
          },
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [2]
        },
        tooltip: {
          fixed: {
            enabled: true,
            position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
            offsetY: 30,
            offsetX: 60
          },
        },
      },
      series: [
        {
          name: "سال ۱۴۰۰",
          data: [],
          type: 'bar',
        },
        {
          name: "سال ۱۳۹۹",
          data: [],
          type: 'bar',

        },
      ],
    };
  },
  methods: {
    async fetchChart() {
      this.chartLoaded = false
      const { data: chartA } = await axios.get(this.baseUrl + "&year=1400");
      const { data: chartB } = await axios.get(this.baseUrl + "&year=1399");
      this.replaceData(chartA, chartB)
      this.chartLoaded = true
    },
    replaceData(chartA, chartB) {
      this.series[0].data.length = 0
      this.series[1].data.length = 0
      chartA.results.slice(0, this.maximumRows).forEach((dataPoint) => {
        this.series[0].data.push(dataPoint[this.aggregate]);
      });
      chartB.results.slice(0, this.maximumRows).forEach((dataPoint) => {
        this.series[1].data.push(dataPoint[this.aggregate]);
      });
      this.showDifference(this.series[0].data, this.series[1].data)
    },
    showDifference(arr1, arr2) {
      this.series.push({
        name: "تغییرات",
        data: [],
        type: 'line',
      })
      const length = Math.max(arr1.length, arr2.length)
      for (let i = 0; i < length; i++)
        this.series[2].data.push(Math.abs((arr1[i] || 0) - (arr2[i] || 0)).toFixed(2));
    }
  },
};
</script>