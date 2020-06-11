<template>
    <div id="app" class="adapt_iphonex">
        <keep-alive v-if="$route.meta.keepAlive">
            <router-view></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>
<script>
    export default {
        name: 'app',
        components: {},
        data() {
            return {
                
            }
        },
        mounted() {},
    }
</script>
<style>
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {

        .travel-list,
        .itinerary {
            height: calc(100vh - 34px);
            padding-bottom: 58px;
        }

        .itinerary-footer {
            padding-bottom: 34px;
        }
    }

    @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {

        .travel-list,
        .itinerary {
            height: calc(100vh - 34px);
            padding-bottom: 58px;
        }

        .itinerary-footer {
            padding-bottom: 34px;
        }
    }
</style>