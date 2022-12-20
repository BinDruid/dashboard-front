<template>
  <v-progress-circular class="text-end" color="teal" indeterminate :size="20" :width="5"
    v-if="!chartLoaded"></v-progress-circular>
  <v-chip closable v-if="selfFilters" @click:close="resetFilter">
    {{ selfFilters }}
  </v-chip>
  <apexchart class="pivot-chart" type="pie" :endpoint="endpoint" :pivot="pivot" :aggregate="aggregate"
    :filtersAsDict="filtersAsDict" :filtersAsUrl="filtersAsUrl" :options="chartOptions" :series="series"
    :maximumRows="maximumRows"></apexchart>
</template>

<script lang="js">
import fa from 'apexcharts/dist/locales/fa.json' assert {type: 'json'};
import BaseChart from '../base/BaseChart.vue';

export default {
  extends: BaseChart,
  data() {
    return {
      chartOptions: {
        labels: [],
        series: [],
        chart: {
          id: `pie-chart-${this.pivot}`,
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
          text: `متوسط توقف به تفکیک ${this.verbosePivot()}`,
          align: 'center',
          margin: 0,
          offsetX: 0,
          offsetY: 5,
          floating: false,
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: 'Sahel FD',
            color: '#008ffb'
          },
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }],
      },
    };
  },
  methods: {
    replaceData(data) {
      this.chartOptions.labels.length = 0
      this.series.length = 0
      data.results.slice(0, this.maximumRows).forEach((dataPoint) => {
        this.chartOptions.labels.push(dataPoint[this.pivot]);
        this.series.push(Math.round(dataPoint[this.aggregate]));
      });
    },
  }
};
</script>
