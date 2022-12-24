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

<script setup>
import axios from "axios";
import { ref, computed, watch, inject, onMounted } from 'vue'
import fa from 'apexcharts/dist/locales/fa.json'

const props = defineProps(["endpoint", "pivot", "filtersAsDict", "filtersAsUrl", "aggregate", "maximumRows"])
const filterChange = inject("filterChange")
const filterReset = inject("filterReset")
const api = inject("api")
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
const chartOptions = ref({
  chart: {
    id: `bar-chart-${props.pivot}`,
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
    text: `متوسط تاخیر به تفکیک ${verbosePivot.value}`,
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
})
const series = ref([
  {
    name: props.aggregate,
    data: [],
  },
],)

watch((props.filtersAsDict), () => { fetchChart() })

const selectionHandler = (e, chartContext, config) => {
  const selected = chartOptions.value.xaxis.categories[config.dataPointIndex]
  filterChange(selected, props.pivot)
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
  chartOptions.value.xaxis.categories.length = 0
  series.value[0].data.length = 0
  data.results.slice(0, props.maximumRows).forEach((dataPoint) => {
    chartOptions.value.xaxis.categories.push(dataPoint[props.pivot]);
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