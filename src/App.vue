<template>
  <section class="p-2">
    <DelayCharts />
  </section>
</template>

<script lang="js">
import DelayCharts from "./components/DelayCharts.vue";
import DateChart from "./components/DateChart.vue";


export default {
  components: {
    DelayCharts,
    DateChart,
  },
}
</script>
