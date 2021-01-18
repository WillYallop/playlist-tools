<template>
    <div class="navBarCon">
        <!-- User Header -->
        <div class="userCon">
            <img :src="spotifyAuthData.accountData.images[0].url" class="userImg">
            <p class="userName">{{spotifyAuthData.accountData.display_name}}</p>

            <img src="../../assets/images/userBackgroundImg.png" class="backgroundImg">
        </div>
        <!-- Navigation --> 
        <nav class="navCon">
            <nuxt-link class="navLink" to="/"><span class="linkIcon"></span>Playlist Refresh</nuxt-link>
            <button class="navLink" v-on:click="$store.commit('logOut')"><span class="linkIcon"></span>Log Out</button>
        </nav>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    computed: {
        spotifyAuthData() {
            return this.$store.state.spotifyAuth
        }
    },
}
</script>

<style scoped>
.navBarCon {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 300px;
    background-color: var(--background-2);
    padding: 10px;
}
/* User Header */
.userCon {
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    padding: 10px;
    text-align: center;
}
.backgroundImg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}
.userImg {
    height: 80px;
    width: 80px;
    border-radius: 50%;
    object-fit: cover;
    z-index: 10;
    position: relative;
} 
.userName {
    font-size: 14px;
    font-weight: bold;
    color: #FFF;
    z-index: 10;
    position: relative;
    margin-top: 5px;
}

/* Navigation */
.navCon {
    width: 100%;
    margin-top: 10px;
} 
.navLink {
    display: flex;
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    background-color: var(--background-1);
    color: #FFF;
    text-decoration: none;
    font-size: 14px;
    border: none;
    cursor: pointer;
    margin-bottom: 5px;
} 
.linkIcon {
    height: 15px;
    width: 15px;
    border-radius: 50%;
    background-color: var(--accent-1);
    margin-right: 10px;
}
</style>