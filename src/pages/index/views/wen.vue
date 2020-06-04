<template>
    <div class="wen">
        <button @click="gochen">chen</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            };
        },
        components: {

        },
        created() {

        },
        mounted() {

        },
        methods: {
            gochen() {
                this.$router.push({
                    path: '/chen'
                })
            }
        },
    };
</script>

<style scoped lang="less">

</style>