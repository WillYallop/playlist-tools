<template>
    <div class="sectionHeaderCon">
        <h2>{{title}}</h2>
        <p class="sectionSubtitleP">{{subtitle}}</p>
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
.sectionHeaderCon {
    width: 100%;
    margin-bottom: 10px;
}
.sectionHeaderCon h2 {
    font-size: 14px;
    color: var(--title-text);
}
.sectionSubtitleP {
    font-size: 14px;
    color: var(--body-text);
    margin-top: 2px;
}
</style>