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

<script setup>
import axios from "axios";
import { ref, computed, watch, inject, onMounted } from 'vue'
import fa from 'apexcharts/dist/locales/fa.json'

const props = defineProps(["endpoint", "pivot", "filtersAsDict", "filtersAsUrl", "aggregate", "maximumRows", "category"])
const filterChange = inject("filterChange")
const filterReset = inject("filterReset")
const api = inject("api")
const monthCategory = inject("monthCategory")
const yearCategory = inject("yearCategory")
const chartLoaded = ref(false)
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
    id: `line-chart-${props.pivot}`,
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
    text: `متوسط تاخیر به تفکیک ${verbosePivot.value}`,
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
  dataLabels: {
    enabled: false
  },
})


const series = ref([
  {
    name: props.aggregate,
    data: [],
  },
],)

const categoryConvertor = (categoryIndex) => {
  return (categoryIndex < 9) ? `0${categoryIndex + 1}` : categoryIndex + 1
}

watch((props.filtersAsDict), () => { fetchChart() })

const selectionHandler = (event, chartContext, { seriesIndex, dataPointIndex, config }) => {
  let categoryString = ""
  if (props.category === "month") categoryString = categoryConvertor(dataPointIndex)
  if (props.category === "year") categoryString = chartOptions.value.xaxis.categories[dataPointIndex]
  filterChange(categoryString, props.pivot)
}

const resetFilter = () => {
  filterReset(props.pivot)
}

const baseUrl = computed(() => { return `${api}/${props.endpoint}/?pivot=${props.pivot}` })

const ignoreSelfUrl = computed(() => {
  let filters = ""
  for (const filter in props.filtersAsDict)
    if (filter !== props.pivot) {
      let baseFilter = `&${filter}=`
      baseFilter += props.filtersAsDict[filter].join(",")
      filters += baseFilter
    }
  return filters
})

const selfFilters = computed(() => {
  let filters = ""
  if (props.filtersAsDict[props.pivot]) {
    let baseFilter = `${verbosePivot.value}=`
    baseFilter += props.filtersAsDict[props.pivot].join(",")
    filters += baseFilter
  }
  return filters
})

const replaceData = (data) => {
  series.value[0].data.length = 0
  data.results.slice(0, props.maximumRows).forEach((dataPoint) => {
    series.value[0].data.push(dataPoint[props.aggregate]);
  });
}

const fetchChart = async () => {
  chartLoaded.value = false
  const { data } = await axios.get(baseUrl.value + ignoreSelfUrl.value);
  replaceData(data)
  chartLoaded.value = true
}

onMounted(() => fetchChart())

</script>