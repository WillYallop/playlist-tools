<template>
    <div class="compCon">
        <!-- Find playlist Section -->
        <div class="sectionCon">
            <SectionHeader
            :title="'Select a playlist'"
            :subtitle="'Pick a playlist to refresh the song added info'"/>
            <input v-on:keyup.enter="retrievePlaylist" type="text" placeholder="Playlist URL/URI/ID" class="inputStyle" v-model="playlistUrl">
            <p class="errorMsg" v-if="playlistErrorMsg">{{playlistErrorMsg}}</p>
        </div>

        <!-- Playlist Info -->
        <div class="sectionCon">
            <SectionHeader
            :title="'Playlist Info'"
            :subtitle="`Get a quick look at this playlist's tracks`"/>
            <div class="sectionBody">
                <p>Total Tracks: {{tracks.length}}</p>
               
            </div>
        </div>

        <!-- Playlist Tracks -->
        <div class="sectionCon">
            <SectionHeader
            :title="'Playlist Tracks'"
            :subtitle="`Get a quick look at this playlist's tracks`"/>
            <div class="trackCon" :key="track.track.id" v-for="track in tracks">
                <img :src="track.track.album.images[2].url" class="trackImg">
                <div class="trackTextarea">
                    <p class="trackTitle">{{track.track.name}}</p>
                    <div class="trackArtsitCon"><p class="trackArtistsP" :key="artist" v-for="artist in track.track.artists">{{artist.name}}<span v-if="track.track.artists.indexOf(artist) != track.track.artists.length - 1">, </span></p></div>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
// Libs
import axios from 'axios'

// Comps
import SectionHeader from '@/components/global/SectionHeader'

export default {
    data() {
        return {
            playlistUrl: '',
            playlistId: '',
            retryAddPlaylist: 0,
            playlistErrorMsg: false,
            playlist: {},
            tracks: [],
            trackIdArray: []


        }
    },
    components: {
        SectionHeader
    },
    computed: {
        spotifyAuthData() {
            return this.$store.state.spotifyAuth
        }
    },
    methods: {
        // Add new playlist methods 
        checkPlaylistURL() {
            var rexeg = /^(spotify:|https:\/\/[a-z]+\.spotify\.com\/)/
            if(rexeg.test(this.playlistUrl)) {
                return true
            } else {
                return false
            }
        },
        getPlaylistId() {
            // For Spotify track URI
            var playlistURI = /^(spotify:)/
            // For Spotify track URL
            var playlistURL = /^(https:\/\/[a-z]+\.spotify\.com\/)/
            // Set data
            if(playlistURI.test(this.playlistUrl)) {
                this.playlistId = this.playlistUrl.split('spotify:playlist:')[1]
            } else if (playlistURL.test(this.playlistUrl)) {
                this.playlistId = this.playlistUrl.split('https://open.spotify.com/playlist/')[1]
            }
        },
        retrievePlaylist() {
            this.playlistErrorMsg = false
            if(this.checkPlaylistURL()) {
                // Get track id
                this.getPlaylistId()
                // Header
                let spotifyAuthHeader = {
                    headers: {
                        Authorization: 'Bearer '+this.spotifyAuthData.accessToken
                    }
                }
                // Get track data
                axios.get('https://api.spotify.com/v1/playlists/'+this.playlistId, spotifyAuthHeader)
                .then((res) => {
                    if(res.data.owner.id === this.spotifyAuthData.accountData.id) {
                        // Set playlist data
                        this.playlist = {
                            playlist_id: res.data.id,
                            name: this.decodeHtml(res.data.name),
                            description: this.decodeHtml(res.data.description),
                            external_url: res.data.external_urls.spotify,
                            followers: res.data.followers.total,
                            image: res.data.images[0].url,
                            owner_display_name: res.data.owner.display_name,
                            owner_id: res.data.owner.id,
                            owner_url: res.data.owner.external_urls.spotify
                        }
                        this.tracks = res.data.tracks.items

                        if(res.data.tracks.next) {
                            this.loadMoreTracks(res.data.tracks.next)
                        } else {
                            this.setTrackIdArray()
                        } 
                        
                    } else {
                        this.playlist = {}
                        this.playlistErrorMsg = 'You do not own this playlist!'
                    }
                })
                .catch((err) => {
                    if(err.response.data.error.message === 'The access token expired') {
                        // If token fails retry
                        if(this.retryAddPlaylist < 1) {
                            this.$store.dispatch('refreshTokens')
                            this.retrievePlaylist()
                            this.retryAddPlaylist++
                        } else if (this.retryAddPlaylist === 1) {
                            // It has been attempted twice and still failed
                            // Show error message
                            this.playlistErrorMsg = 'There was an issue getting playlist data.'
                        }
                    }
                })
            } else {
                this.playlistErrorMsg = 'Make sure you enter a valid Spotify playlist URL.'
            }
        },
        decodeHtml(html) {
            var txt = document.createElement("textarea");
            txt.innerHTML = html;
            return txt.value;
        },
        // If tracks is greater than 100
        loadMoreTracks(nextTracksUrl) {
            let spotifyAuthHeader = {
                headers: {
                    Authorization: 'Bearer '+this.spotifyAuthData.accessToken
                }
            }
            // Get track data
            axios.get(nextTracksUrl, spotifyAuthHeader)
            .then((res) => {
                
                for(var i = 0; i < res.data.items.length; i++) {
                    this.tracks.push(res.data.items[i])
                }

                if(res.data.next) {
                    this.loadMoreTracks(res.data.next)
                } else {
                    this.setTrackIdArray()
                }
            })
            .catch((err) => {
                console.log(err)
            })
        },
        // Set track ids
        setTrackIdArray() {
            for(var i = 0; i < this.tracks.length; i++) {
                this.trackIdArray.push(this.tracks[i].track.id)
            }
        },
    }
}
</script>

<style scoped>
.compCon {
    width: 100%;
}
.sectionCon {
    margin-bottom: 20px;
}
.sectionCon:last-child {
    margin-bottom: 0;
}
.sectionBody {
    border: 2px solid var(--border-color);
    padding: 10px;
    border-radius: 10px;
}

/* Track */
.trackCon {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    border: 2px solid var(--border-color);
    padding: 5px;
    border-radius: 10px;
}
.trackCon:last-child {
    margin-bottom: 0;
}
.trackImg {
    height: 40px;
    width: 40px;
    min-width: 40px;
    border-radius: 5px;
}
.trackTextarea {
    padding-left: 10px;
}
.trackTitle {
    font-size: 14px;
    color: var(--title-text);
    font-weight: bold;
}
.trackArtsitCon {
    display: flex;
    flex-wrap: wrap;
}
.trackArtistsP {
    font-size: 14px;
    margin-right: 5px;
    color: var(--body-text);
}
</style>