<template>
    <div class="headerBarCon">
        <h1>{{title}}</h1>
        <p class="subtitleP">{{subtitle}}</p>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        subtitle: String
    }
}
</script>

<style scoped>
.headerBarCon {
    width: 100%;
    padding: 30px;
    background-color: var(--background-3);
}
.headerBarCon h1 {
    font-size: 16px;
    color: var(--title-text);
}
.subtitleP {
    font-size: 14px;
    color: var(--body-text);
}
</style>