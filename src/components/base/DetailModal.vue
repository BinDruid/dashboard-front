<template>
    <v-dialog transition="dialog-bottom-transition">
        <template v-slot:activator="{ props }">
            <v-row class="pa-1" align="center" justify="end">
                <v-col cols="3">
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
  
<script lang="js">
import axios from "axios";
import TrainTable from './BaseTable.vue';


export default {
    props: ["filtersAsUrl"],
    inject: ["api"],
    components: { TrainTable },
    data() {
        return {
            detailEndpoint: 'جدول تاخیرات',
            dataLoaded: false,
            endpoint: "delays/charts",
            table_data: [],
            columns: [
                { lable: "قطار", path: "train_name" },
                { lable: "ناحیه", path: "region" },
                { lable: "مسیر", path: "path" },
                { lable: "تاریخ حرکت", path: "travel_date" },
                { lable: "مجموع تاخیر", path: "total_delay" },
            ]
        }
    },
    computed: {
        baseUrl() {
            return `${this.api}/${this.endpoint}/?pivot=timeline`
        }
    },
    watch: {
        detailEndpoint(value) {
            if (value === 'جدول تاخیرات') {
                this.endpoint = "delays/charts"
                this.columns = [
                    { lable: "قطار", path: "train_name" },
                    { lable: "ناحیه", path: "region" },
                    { lable: "مسیر", path: "path" },
                    { lable: "تاریخ حرکت", path: "travel_date" },
                    { lable: "مجموع تاخیر", path: "total_delay" },
                ]
            }
            if (value === 'جدول علل توقف') {
                this.endpoint = "stops/charts"
                this.columns = [
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

        }
    },
    methods: {
        async showDetails() {
            this.table_data.length = 0
            this.dataLoaded = false
            const { data } = await axios.get(this.baseUrl + this.filtersAsUrl);
            data.results.slice(0, 10).forEach(element => {
                this.table_data.push(element)
            });
            this.dataLoaded = true
        },
    }
};
</script>
  