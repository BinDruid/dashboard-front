<template>
  <div class="row">
    <div class="col">
      <p>تاریخ شروع</p>
      <date-picker simple format="jMM-jDD" display-format="dddd jDD jMMMM jYYYY" v-model="startDate"></date-picker>
    </div>
    <div class="col">
      <p>تاریخ پایان</p>
      <date-picker simple format="jMM-jDD" display-format="dddd jDD jMMMM jYYYY" v-model="endDate"></date-picker>
    </div>
  </div>
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
