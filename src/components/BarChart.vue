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
  <apexchart type="bar" :pivot="pivot" :aggregate="aggregate" :filtersAsDict="filtersAsDict"
    :filtersAsUrl="filtersAsUrl" :options="chartOptions" :series="series" :maximumRows="maximumRows"
    @dataPointSelection="selectionHandler"></apexchart>
</template>

<script lang="js">
import fa from 'apexcharts/dist/locales/fa.json' assert {type: 'json'};
import BaseChart from './base/BaseChart.vue';

export default {
  extends: BaseChart,
  data() {
    return {
      baseUrl: `${this.apiEndPoint}/?pivot=${this.pivot}`,
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
          categories: [],
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
      },
      series: [
        {
          name: this.aggregate,
          data: [],
        },
      ],
    };
  },
};
</script>
