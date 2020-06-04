<template>
    <div class="chen">
        <button @click="gowen">wen</button>
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
            gowen() {
                this.$router.push({
                    path: '/'
                })
            }
        },
    };
</script>

<style scoped lang="less">

</style>