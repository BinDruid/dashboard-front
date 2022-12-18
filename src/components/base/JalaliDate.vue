<template>
  <v-row class="my-1">
    <v-col>
      <p>تاریخ شروع</p>
      <date-picker simple format="jMM-jDD" display-format="dddd jDD jMMMM jYYYY" v-model="startDate"></date-picker>
    </v-col>
    <v-col>
      <p>تاریخ پایان</p>
      <date-picker simple format="jMM-jDD" display-format="dddd jDD jMMMM jYYYY" v-model="endDate"></date-picker>
    </v-col>
  </v-row>
</template>

<script lang="js">
import DatePicker from 'vue3-persian-datetime-picker'
export default {
  inject: ["filterChange"],
  components: {
    DatePicker
  },
  data() {
    return {
      startDate: null,
      endDate: null
    }
  },
  watch: {
    endDate() {
      if (this.startDate && this.endDate > this.startDate) this.filterChange({ from: this.startDate, to: this.endDate }, "from-to")
    }
  }

}
</script>
