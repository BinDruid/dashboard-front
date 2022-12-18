<template>
    <v-dialog transition="dialog-bottom-transition">
        <template v-slot:activator="{ props }">
            <div class="text-left">
                <v-btn variant="flat" prepend-icon="mdi-text-box-search-outline" color="info" v-bind="props"
                    @click="showDetails">
                    نمایش جزئیات
                </v-btn>
            </div>
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
    inject: ["apiEndPoint"],
    components: { TrainTable },
    data() {
        return {
            baseUrl: `${this.apiEndPoint}/?pivot=timeline`,
            dataLoaded: false,
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
  