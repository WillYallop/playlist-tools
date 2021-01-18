<template>
    <div class="navBarCon">
        <!-- User Header -->
        <div class="userCon">
            <img :src="spotifyAuthData.accountData.images[0].url" class="userImg">
            <p class="userName">{{spotifyAuthData.accountData.display_name}}</p>
        </div>
        <!-- Navigation --> 
        <nav class="navCon"> 
            <div class="navTop">
                <nuxt-link class="navLink" to="/"><fa class="fas" :icon="['fas', 'sync']"/>Playlist Refresh</nuxt-link>
            </div>
            <div class="navBot">
                <button class="navLink" v-on:click="$store.commit('logOut')"><fa class="fas" :icon="['fas', 'sign-out-alt']"/>Sign Out</button>
                <p class="poweredByP">Powered By Melody Melon</p>
            </div>
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
    background-color: var(--background-1);
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
    height: calc(100% - 135.8px);
    display: flex;
    flex-wrap: wrap;
} 
.navTop {
    width: 100%;
    align-self: flex-start;
} 
.navBot {
    width: 100%;
    align-self: flex-end;
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
.fas {
    font-size: 16px;
    color: var(--accent-1);
    margin-right: 10px;
}
.poweredByP {
    font-size: 14px;
    margin-top: 10px;
    color: var(--body-text);
}
</style>