<template>
  <v-locale-provider rtl>
    <v-container>
      <DelayCharts />
    </v-container>
  </v-locale-provider>
</template>

<script lang="js">
import DelayCharts from "./pages/DelayCharts.vue";
import TimeLineCharts from "./pages/TimeLineCharts.vue";


export default {
  components: {
    DelayCharts,
    TimeLineCharts,
  },
}
</script>
