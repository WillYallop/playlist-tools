<template>
    <div>
        
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    mounted() {
        this.$store.commit('setCallbackData', { 
            code: this.$router.currentRoute.query.code,
            state: this.$router.currentRoute.query.state
        })
        this.$store.dispatch('getTokens')


    }
}
</script>

<style scoped>

</style>