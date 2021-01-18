<template>
    <div  class="">
      <h1>Please Sign Into Your Spotify</h1>
      <button class="" v-on:click="authoriseNewAccount()">Sign In To Spotify Account</button>
      <nuxt-link to="/">Home</nuxt-link>
      {{spotifyAuthData}}
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