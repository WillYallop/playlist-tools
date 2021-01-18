<template>
    <div class="signInCon">

        <div class="col2ContentCon">
            <h1>Sign Into<br>Your Spotify Account</h1>
            <p class="subtitleP">Find custom tools to help manage your playlist!.</p>
            <button class="signInBtn" v-on:click="authoriseNewAccount" aria-label="Sign In">Sign In</button>
        </div>
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
    methods: {
        authoriseNewAccount() {
            window.location.replace("https://accounts.spotify.com/authorize?client_id="+process.env.SPOTIFY_CLIENT_ID+"&response_type=code&redirect_uri="+process.env.SPOTIFY_REDIRECT_URL+"&scope=user-read-private%20user-read-email%20playlist-modify-public%20playlist-modify-private&state=34fFs29kd09");
        },
    }
}
</script>

<style scoped>
.signInCon {
    width: 100%;
}

.col2ContentCon {
    max-width: 550px;
    margin: 100px auto;
}
.col2ContentCon h1 {
    font-size: 20px;
    margin-bottom: 5px;
    color: var(--title-text);
} 
.subtitleP {
    color: var(--body-text);
} 
.subtitleP a {
    font-weight: bold;
    color: #15AA4A;
    text-decoration: none;
}

.signInBtn {
    padding: 10px 40px;
    width: 100%;
    border-radius: 20px;
    border: none;
    background-color: var(--accent-1);
    color: #FFF;
    font-size: 16px;
    font-weight: bold;
    margin-top: 20px;
    cursor: pointer;
    transition: 0.3s;
}
.signInBtn:hover {
    background-color: var(--accent-1-hover);
}



</style>