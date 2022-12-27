<template>>
  <v-progress-circular color="teal" indeterminate :size="20" :width="5" v-if="!chartLoaded"></v-progress-circular>
  <p v-if="selfFilters">
    {{ selfFilters }}
    <v-btn icon color="info" size="x-small" :disabled="selfFilters === ''" @click="resetFilter">
      <v-icon>mdi-cached</v-icon>
    </v-btn>
  </p>
  <apexchart class="pivot-chart" :pivot="pivot" :aggregate="aggregate" :category="category" :queryFilters="queryFilters"
    :filtersAsUrl="filtersAsUrl" :options="chartOptions" :series="series" :maxCategory="maxCategory"
    @markerClick="selectionHandler"></apexchart>
</template>


<script setup>
import axios from "axios";
import { ref, computed, watch, inject, onMounted } from 'vue'
import fa from 'apexcharts/dist/locales/fa.json'

const props = defineProps(["endpoint", "pivot", "queryFilters", "filtersAsUrl", "aggregate", "maxCategory"])
const filterChange = inject("filterChange")
const filterReset = inject("filterReset")
const api = inject("api")
const monthCategory = inject("monthCategory")
const yearCategory = inject("yearCategory")
const chartLoaded = ref(false)
const yearsSelected = ["1399", "1400"]
const verbosePivot = computed(() => {
  switch (props.pivot) {
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
    case "reason":
      return "علل توقف"
  }
})

const categorySelector = () => {
  switch (props.category) {
    case "year":
      return yearCategory
    case "month":
      return monthCategory
  }
}

const chartOptions = ref({
  chart: {
    id: `line-chart-${props.pivot}-2`,
    locales: [fa],
    defaultLocale: 'fa',
    height: 100
  },
  title: {
    text: `روند تاخیرات در دو سال متوالی به تفکیک ${verbosePivot.value}`,
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
    categories: categorySelector(),
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
      position: 'topLeft',
      offsetY: 30,
      offsetX: 60
    },
  },
})
const series = ref([
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
],)

watch((props.queryFilters), () => { fetchChart() })

const selectionHandler = (e, chartContext, config) => {
  const selected = chartOptions.value.xaxis.categories[config.dataPointIndex]
  filterChange(selected, props.pivot)
}

const resetFilter = () => {
  filterReset(props.pivot)
}

const baseUrl = computed(() => { return `${api}/${props.endpoint}/?pivot=${props.pivot}` })

const selfFilters = computed(() => {
  let filters = ""
  if (props.queryFilters[props.pivot]) {
    let baseFilter = `${verbosePivot.value}=`
    baseFilter += props.queryFilters[props.pivot].join(",")
    filters += baseFilter
  }
  return filters
})

const showDifference = (arr1, arr2) => {
  series.value.push({
    name: "تغییرات",
    data: [],
    type: 'line',
  })
  const length = Math.max(arr1.length, arr2.length)
  for (let i = 0; i < length; i++)
    series.value[2].data.push(Math.abs((arr1[i] || 0) - (arr2[i] || 0)).toFixed(2));
}

const replaceData = (chartA, chartB) => {
  series.value[0].data.length = 0
  series.value[1].data.length = 0
  chartA.results.slice(0, props.maxCategory).forEach((dataPoint) => {
    series.value[0].data.push(dataPoint[props.aggregate]);
  });
  chartB.results.slice(0, props.maxCategory).forEach((dataPoint) => {
    series.value[1].data.push(dataPoint[props.aggregate]);
  });
  showDifference(series.value[0].data, series.value[1].data)
}

const fetchChart = async () => {
  chartLoaded.value = false
  const { data: chartA } = await axios.get(baseUrl.value + `&year=${yearsSelected[0]}`);
  const { data: chartB } = await axios.get(baseUrl.value + `&year=${yearsSelected[1]}`);
  replaceData(chartA, chartB)
  chartLoaded.value = true
}

onMounted(() => fetchChart())

</script>