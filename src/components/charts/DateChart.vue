<template>
  <apexchart type="area" :pivot="pivot" :aggregate="aggregate" :options="chartOptions" :series="series"
    @beforeZoom="zoomHandler" @beforeResetZoom="resetZoomHandler"></apexchart>
</template>

<script lang="js">
import axios from "axios";
import { toGregorian, toJalaali } from "jalaali-js"
const { VITE_API_URL: API_URL } = import.meta.env

export default {
  data() {
    return {
      pivot: "day",
      year: 1400,
      aggregate: "avg_delay",
      baseUrl: `${API_URL}/delay/charts/?pivot=day`,
      days: [],
      xMin: null,
      xMax: null,
      daily_delay: [],
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
          size: 0,
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
  methods: {
    verbosePivot() {
      switch (this.pivot) {
        case "train":
          return "قطار"
        case "path":
          return "مسیر"
        case "region":
          return "ناحیه"
        case "year":
          return "سال"
        case "month":
          return "ماه"
      }
    },
    convertDays(day) {
      const dayObject = toGregorian(this.year, parseInt(day.split("-")[0]), parseInt(day.split("-")[1]))
      return new Date(dayObject.gy, dayObject.gm, dayObject.gd).getTime()
    },
    async fetchChart() {
      const { data } = await axios.get(this.baseUrl);
      this.days.length = 0
      this.daily_delay.length = 0
      data.results.forEach((dataPoint) => {
        this.days.push(dataPoint[this.pivot]);
        const timeStampPoint = []
        timeStampPoint.push(this.convertDays(dataPoint[this.pivot]))
        timeStampPoint.push(dataPoint[this.aggregate])
        this.series[0].data.push(timeStampPoint);
      });
    },
    convertXasis(xaxis) {
      for (const props in xaxis) {
        console.log(new Date(xaxis[props]))
        const miliTime = toJalaali(new Date(xaxis[props]))
        const timeStamp = `${miliTime.jm}-${miliTime.jd}`
        console.log(timeStamp)
      }
    },
    zoomHandler(chartContext, { xaxis, yaxis }) {
      this.convertXasis(xaxis)
    },
    resetZoomHandler(chartContext, opts) {
      const xaxis = {
        min: this.series[0].data[0][0],
        max: this.series[0].data[this.series[0].data.length - 1][0]
      }
      this.convertXasis(xaxis)
      return xaxis
    }
  },
  created() {
    this.fetchChart()
  },
};
</script>
