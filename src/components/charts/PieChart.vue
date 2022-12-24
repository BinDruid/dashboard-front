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


<script setup>
import axios from "axios";
import { ref, computed, watch, inject, onMounted } from 'vue'
import fa from 'apexcharts/dist/locales/fa.json'

const props = defineProps(["endpoint", "pivot", "filtersAsDict", "filtersAsUrl", "aggregate", "maximumRows"])
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
  labels: [],
  series: [],
  chart: {
    id: `pie-chart-${props.pivot}`,
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
    text: `متوسط توقف به تفکیک ${verbosePivot.value}`,
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
})

const series = ref([
  {
    name: props.aggregate,
    data: [],
  },
],)

watch((props.filtersAsDict), () => { fetchChart() })

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
  chartOptions.value.labels.length = 0
  series.value.length = 0
  data.results.slice(0, props.maximumRows).forEach((dataPoint) => {
    chartOptions.value.labels.push(dataPoint[props.pivot]);
    series.value.push(Math.round(dataPoint[props.aggregate]));
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