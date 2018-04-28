<template>
    <div class="container">
        <ul>
            <li v-for="car in carList" :key="car.id">
                <img src="car.logo" alt="">
                <p>{{car.name | empty}}</p>
            </li>
        </ul>
        <button @click="loadNextPage">下一页</button>
        <div class="last" v-show="isLast">已经没有更多了...</div>
        <div class="loading" v-show="isLoading">正在加载...</div>
        <div class="error" v-show="isError" @click="getCarListData">加载错误，点击 <span class="font-blue">这里</span> 重试</div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                carList: [],
                totalPage: 1, // 总页数
                page: 0, // 当前页数
                isLoading: false, // 是否正在加载
                isError: false // 是否加载错误
            }
        },
        mounted() {
            this.loadNextPage();
        },
        methods: {
            // 获取列表数据
            getCarListData() {
                let data = {
                    page: this.page, // 当前页数
                    pageSize: 10 // 每页条数 
                }

                this.isLoading = true;
                this.isError = false;
                this.$ajaxGet('/car/list', data).then(data => {
                    // 加载成功
                    this.carList.concat(data.list);
                    this.page = data.page;
                    this.totalPage = data.totalPage
                    
                    this.isLoading = false;
                }).catch(() => {
                     //  加载列表失败
                    this.isLoading = false;
                    this.isError = true;
                });
            },
            // 下一页
            loadNextPage() {
                if(this.page <= this.totalPage) {
                    this.page ++;
                    this.getCarListData();
                }
            }
        },
        filters: {
            empty(value) {
                return value || '未知';
            }
        },
        computed: {
            // 是否是最后一条
            isLast() {
                return !this.isLoading && this.carList.length > 10 && !this.isError && this.page >= this.totalPage;
            }
        }
    }
</script>