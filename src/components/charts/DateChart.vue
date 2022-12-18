<template>
  <apexchart class="pivot-chart" type="area" :pivot="pivot" :aggregate="aggregate" :options="chartOptions"
    :series="series" @beforeZoom="zoomHandler" @beforeResetZoom="resetZoomHandler"></apexchart>
</template>

<script lang="js">
import axios from "axios";
import moment from "moment-jalaali";
import BaseChart from '../base/BaseChart.vue';

export default {
  extends: BaseChart,
  data() {
    return {
      baseUrl: `${this.apiEndPoint}/?pivot=${this.pivot}`,
      days: [],
      xMin: null,
      xMax: null,
      chartOptions: {
        chart: {
          id: 'area-datetime',
          zoom: {
            autoScaleYaxis: true
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          type: 'datetime',
          min: this.xMin,
          max: this.xMax,
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 3,
          style: 'hollow',
        },
      },
      series: [
        {
          name: this.aggregate,
          data: [],
        },
      ],
    }
  },
  computed: {
    year() {
      return this.filtersAsDict["year"] ?? "1400"
    }
  },
  methods: {
    convertDays(dayMonth) {
      const dayObject = moment(`${this.year}-${dayMonth}`, "jYYYY-jMM-jDD")
      return dayObject.format("M/D/YYYY")
    },
    replaceData(data) {
      this.days.length = 0
      this.series[0].data.length = 0
      data.results.forEach((dataPoint) => {
        this.days.push(dataPoint[this.pivot]);
        const timeStampPoint = {}
        timeStampPoint["x"] = this.convertDays(dataPoint[this.pivot])
        timeStampPoint["y"] = (dataPoint[this.aggregate])
        this.series[0].data.push(timeStampPoint);
      });
      const length = this.series[0].data.length
      this.xMin = this.series[0].data[0]["x"]
      this.xMax = this.series[0].data[length - 1]["x"]
    },
    async fetchChart() {
      this.chartLoaded = false
      const { data } = await axios.get(this.baseUrl + `&year=${this.year}`);
      this.replaceData(data)
      this.chartLoaded = true
    },
    convertXasis(xaxis) {
      return moment(xaxis).format("jMM-jDD")
    },
    validateXaxis(xaxis) {
      // First non valid condition: User spans lefside of screen too much so it goes below 01-01 date
      if ((xaxis["max"] < xaxis["min"]) && xaxis["min"].split("-")[0] === "12") xaxis["min"] = this.convertXasis(this.xMin)

      // Second non valid condition: User spans rightside of screen too much so it goes over 12-29 date
      if (xaxis["max"] < xaxis["min"]) xaxis["max"] = this.convertXasis(this.xMax)
    },
    zoomHandler(chartContext, { xaxis, yaxis }) {
      const zoomPoints = { min: this.convertXasis(xaxis["min"]), max: this.convertXasis(xaxis["max"]) }
      this.validateXaxis(zoomPoints)
      this.filterChange({ from: zoomPoints["min"], to: zoomPoints["max"] }, "from-to")
    },
    resetZoomHandler(chartContext, opts) {
      return {
        min: this.xMin,
        max: this.xMax
      }
    }
  },
};
</script>
