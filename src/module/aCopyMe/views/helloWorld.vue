<template>
    <div class="helloWorld">
        helloWorld
    </div>
</template>

<script>
    import { API } from '../api/getData'
    export default {
        data() {
            return {

            };
        },
        components: {

        },
        created() {
            API({
                data:1
            }).then(res => {
                
            })
        },
        mounted() {

        },
        methods: {

        },
    };
</script>

<style scoped lang="less">

</style>