<script setup>
import axios from "axios";
import { ref, computed, watch, inject, onMounted } from 'vue'

const props = defineProps(["endpoint", "pivot", "queryFilters", "filtersAsUrl", "aggregate", "maxCategory"])
const filterChange = inject("filterChange")
const filterReset = inject("filterReset")
const api = inject("api")
const monthCategory = inject("monthCategory")
const yearCategory = inject("yearCategory")
const chartLoaded = ref(false)
const chartOptions = ref({
  chart: {
    id: `chart-${props.pivot}`,
  },
  xaxis: {
    categories: [],
  },
},)
const series = ref([
  {
    name: props.aggregate,
    data: [],
  },
],)

watch((props.filtersAsUrl), () => { fetchChart() })

const selectionHandler = (e, chartContext, config) => {
  const selected = chartOptions.xaxis.categories.value[config.dataPointIndex]
  filterChange(selected, props.pivot)
}

const resetFilter = () => {
  filterReset(props.pivot)
}

const verbosePivot = () => {
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
}

const baseUrl = computed(() => { return `${api}/${props.endpoint}/?pivot=${props.pivot}` })
const extraFilters = computed(() => {
  let filters = ""
  for (const filter in props.queryFilters)
    if (filter !== props.pivot) {
      let baseFilter = `&${filter}=`
      baseFilter += props.queryFilters[filter].join(",")
      filters += baseFilter
    }
  return filters
})

const selfFilters = computed(() => {
  let filters = ""
  if (props.queryFilters[props.pivot]) {
    let baseFilter = `${verbosePivot()}=`
    baseFilter += props.queryFilters[props.pivot].join(",")
    filters += baseFilter
  }
  return filters
})


const replaceData = (data) => {
  chartOptions.xaxis.categories.value.length = 0
  series.value[0].data.length = 0
  data.results.slice(0, props.maxCategory).forEach((dataPoint) => {
    chartOptions.xaxis.categories.value.push(dataPoint[props.pivot]);
    series.value[0].data.push(dataPoint[props.aggregate]);
  });
}

const fetchChart = async () => {
  chartLoaded.value = false
  const { data } = await axios.get(baseUrl.value + extraFilters.value);
  replaceData(data)
  chartLoaded.value = true
}

onMounted(() => fetchChart())

</script>