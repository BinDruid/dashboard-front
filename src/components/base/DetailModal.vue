<template>
    <div class="text-end">
        <span class="badge rounded-pill bg-primary mx-1 p-2 reset-btn" role="button" data-bs-toggle="modal"
            data-bs-target="#exampleModal" @click="showDetails">
            نمایش جزئیات
        </span>
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">جزئیات</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <train-table :columns="columns" :data="table_data" />
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">بستن</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
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
  