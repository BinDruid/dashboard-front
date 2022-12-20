<template>
  <v-progress-circular class="text-end" color="teal" indeterminate :size="20" :width="5"
    v-if="!chartLoaded"></v-progress-circular>
  <v-chip closable v-if="selfFilters" @click:close="resetFilter">
    {{ selfFilters }}
  </v-chip>
  <apexchart class="pivot-chart" type="bar" :endpoint="endpoint" :pivot="pivot" :aggregate="aggregate"
    :filtersAsDict="filtersAsDict" :filtersAsUrl="filtersAsUrl" :options="chartOptions" :series="series"
    :maximumRows="maximumRows" @dataPointSelection="selectionHandler"></apexchart>
</template>

<script lang="js">
import fa from 'apexcharts/dist/locales/fa.json' assert {type: 'json'};
import BaseChart from '../base/BaseChart.vue';

export default {
  extends: BaseChart,
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
          offsetX: 0,
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
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            gradientToColors: ['#35D7FC'],
            shadeIntensity: 1,
            type: 'horizontal',
            opacityFrom: 0.9,
            opacityTo: 1,
            stops: [0, 20, 100, 100]
          },
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
