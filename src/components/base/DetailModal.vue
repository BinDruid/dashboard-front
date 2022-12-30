<template>
    <v-dialog transition="dialog-bottom-transition">
        <template v-slot:activator="{ props }">
            <v-row class="pa-1" align="center" justify="end">
                <v-col cols="4">
                    <v-switch color="info" v-model="detailEndpoint" hide-details true-value="جدول تاخیرات"
                        false-value="جدول علل توقف" :label="`نمایش جزئیات از: ${detailEndpoint}`"></v-switch>
                </v-col>
                <v-col cols="2">
                    <v-btn variant="flat" prepend-icon="mdi-text-box-search-outline" color="info" v-bind="props"
                        @click="showDetails">
                        نمایش جزئیات
                    </v-btn>
                </v-col>
            </v-row>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card>
                <v-toolbar color="info" title="جزئیات بر اساس فیلترهای انتخابی"></v-toolbar>
                <train-table :columns="columns" :data="table_data" />
                <v-card-actions class="justify-end">
                    <v-btn variant="flat" color="info" @click="isActive.value = false">بستن</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
  
<script setup>
import { ref, computed, watch, inject } from 'vue'
import axios from "axios";
import TrainTable from './BaseTable.vue';

const props = defineProps(['filtersAsUrl'])
const api = inject('api')
const detailEndpoint = ref("جدول تاخیرات")
const dataLoaded = ref(false)
const endpoint = ref("delays/charts")
const table_data = ref([])
const columns = ref([])

const baseUrl = computed(() => { return `${api}/${endpoint.value}/?pivot=timeline` })

const showDetails = async () => {
    if (detailEndpoint.value === 'جدول تاخیرات') {
        endpoint.value = "delays/charts"
        columns.value = [
            { lable: "قطار", path: "train_name" },
            { lable: "ناحیه", path: "region" },
            { lable: "مسیر", path: "path" },
            { lable: "تاریخ حرکت", path: "travel_date" },
            { lable: "مجموع تاخیر", path: "total_delay" },
        ]
    }
    if (detailEndpoint.value === 'جدول علل توقف') {
        endpoint.value = "stops/charts"
        columns.value = [
            { lable: "قطار", path: "train_name" },
            { lable: "ناحیه", path: "region" },
            { lable: "مسیر", path: "path" },
            { lable: "تاریخ حرکت", path: "travel_date" },
            { lable: "گروه علت توقف", path: "reason_group" },
            { lable: "علت توقف", path: "reason_label" },
            { lable: "ایستگاه", path: "station_name" },
            { lable: "توقف در ایستگاه", path: "station_stop" },
        ]

    }
    table_data.value.length = 0
    dataLoaded.value = false
    const { data } = await axios.get(baseUrl.value + props.filtersAsUrl);
    data.results.slice(0, 10).forEach(element => {
        table_data.value.push(element)
    });
    dataLoaded.value = true
}

</script>
  