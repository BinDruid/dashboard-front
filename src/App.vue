<template>
  <div class="row p-2" dir="ltr">
    <div class="col-6">
      <line-chart
        pivot="month"
        aggregate="avg_delay"
        :filtersAsDict="filtersAsDict"
        :filtersAsUrl="filtersAsUrl"
        maximumRows="12"
      />
    </div>
    <div class="col-6">
      <bar-chart
        pivot="year"
        aggregate="avg_delay"
        :filtersAsDict="filtersAsDict"
        :filtersAsUrl="filtersAsUrl"
        maximumRows="5"
      />
    </div>
    <div class="col-4">
      <bar-chart
        pivot="region"
        aggregate="avg_delay"
        maximumRows="10"
        :filtersAsDict="filtersAsDict"
        :filtersAsUrl="filtersAsUrl"
      />
    </div>
    <div class="col-4">
      <bar-chart
        pivot="path"
        aggregate="avg_delay"
        maximumRows="5"
        :filtersAsDict="filtersAsDict"
        :filtersAsUrl="filtersAsUrl"
      />
    </div>
    <div class="col-4">
      <bar-chart
        pivot="train"
        aggregate="avg_delay"
        maximumRows="10"
        :filtersAsDict="filtersAsDict"
        :filtersAsUrl="filtersAsUrl"
      />
    </div>
  </div>
</template>

<script lang="js">
import BarChart from "./components/BarChart.vue";
import LineChart from "./components/LineChart.vue";

export default {
  components:{
    BarChart,
    LineChart
  },
  provide(){
    return {
      filterChange: this.filterChange,
      filterReset: this.filterReset,
    }
  },
  data() {
    return {
      filtersAsDict: {}
  }
},
computed:{
  filtersAsUrl(){
    let filters = ""
      for (const filter in this.filtersAsDict) {
        let baseFilter =`&${filter}=`
        baseFilter += this.filtersAsDict[filter].join(",")
        filters += baseFilter
      }
      return filters
  }
},
methods: {
  filterChange(filterValue, pivot) {
    this.filtersAsDict[pivot] ??= []
    if (!this.filtersAsDict[pivot].includes(filterValue))this.filtersAsDict[pivot].push(filterValue)
  },
  filterReset(pivot) {
    delete this.filtersAsDict[pivot]
  },
}};
</script>
