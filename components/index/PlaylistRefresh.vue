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
        <div class="sectionCon" v-if="isEmpty(playlist)">
            <SectionHeader
            :title="'Playlist Info'"
            :subtitle="`Get a quick look at this playlist's tracks`"/>
            <div class="sectionBody">
                <div class="playlistInfoHeader">
                    <img :src="playlist.image" class="playlistImg">
                    <div class="playlistInfoTextarea">
                        <p class="playlistName">{{playlist.name}}</p>
                        <p class="playlistInfo">{{playlist.followers}} Follower{{ playlist.followers > 1 ?  's' : '' }} <span class="seperatorLine"></span>{{tracks.length}} Tracks</p>
                    </div>
                </div>
                <div class="actionCon">
                    <div class="refreshProcessIndicator" v-show="refreshingPlaylist"> 
                        <img src="../../assets/images/loadingIndicator.gif" class="loadingGif">
                        <p class="processAction">{{refreshProcessAction}}</p>
                    </div>
                    <button class="orderTypeBtn" :class="{ 'active' :  trackOrderType === 'random'}" v-on:click="trackOrderType = 'random'">Order By Random</button>
                    <button class="orderTypeBtn" :class="{ 'active' :  trackOrderType === 'descending'}"  v-on:click="trackOrderType = 'descending'">Order By Descending</button>
                    <button class="refreshPlaylistBtn" v-on:click="refreshPlaylist">Refresh Playlist</button>
                </div>
            </div>
        </div>

        <!-- Playlist Tracks -->
        <div class="sectionCon" v-if="tracks.length > 0">
            <SectionHeader
            :title="'Playlist Tracks'"
            :subtitle="`Get a quick look at this playlist's tracks`"/>
            <div class="trackCon" :key="track.track.id" v-for="track in tracks">
                <img :src="track.track.album.images[track.track.album.images.length - 1].url" class="trackImg">
                <div class="trackTextarea">
                    <p class="trackTitle">{{track.track.name}}</p>
                    <div class="trackArtsitCon"><p class="trackArtistsP" :key="artist.name" v-for="artist in track.track.artists">{{artist.name}}<span v-if="track.track.artists.indexOf(artist) != track.track.artists.length - 1">, </span></p></div>
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
            trackIdArray: [],

            refreshingPlaylist: false,
            refreshProcessAction: 'Initiating Playlist Refresh',
            trackOrderType: 'random'


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
                this.playlistId = this.playlistId.split('?')[0]
            }
        },
        retrievePlaylist() {
            this.playlistErrorMsg = false
            this.playlist = {}
            this.tracks = []
            this.trackIdArray = []
            this.playlistId = []

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

        // Reffresh Playlist
        refreshPlaylist() {
            this.refreshingPlaylist = true

            let chunkedArray = this.chunkArray(99, this.trackIdArray)
            this.refreshProcessAction = 'Chunking Tracks'
            
            let counter = 0;
            for(var i = 0; i < chunkedArray.length; i++) {
                counter++
                this.refreshProcessAction = 'Deleted Tracks: Chunk '+ i
                var tracksArray = chunkedArray[i]
                const trackUrlObjectsArray = []
                // Format track values for URL
                for(var k = 0; k < tracksArray.length; k++) {
                    var trackObj = {
                        uri: 'spotify:track:' + tracksArray[k]
                    }
                    trackUrlObjectsArray.push(trackObj)
                }
                // Delete playlist tracks
                axios({
                    method: 'delete' ,
                    url: 'https://api.spotify.com/v1/playlists/'+this.playlistId+'/tracks',
                    data: {
                        tracks: trackUrlObjectsArray
                    },
                    headers: {
                        Authorization: 'Bearer ' + this.spotifyAuthData.accessToken,
                        'Content-Type': 'application/json'
                    }
                })
                .then((result) => {
        
                })
                .catch((err) => {
                    console.log(err)
                })
            }
            // Once we are on the last itterate, wait a second for the last post to complete
            // Not ideal - but having this in then messes up to to loop not waiting for
            if(counter === chunkedArray.length) {
                setTimeout(()=> {
                    this.reOrderTracks()
                }, 1000)
            }
        },
        chunkArray(chunkSize, inputArray) {
            // Spotify can only add 100 songs to a track at a time
            var perChunk = chunkSize;
            var chunkedArray = [];

            // Chunk tracks array into multiples of 100
            let result = inputArray.reduce((resultArray, item, index) => { 
                const chunkIndex = Math.floor(index/perChunk)
                if(!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = [] // start a new chunk
                }
                resultArray[chunkIndex].push(item)
                return resultArray
            }, []);
            chunkedArray = result
            return chunkedArray
        },
        reOrderTracks() {
            if(this.trackOrderType === 'random') { 
                this.refreshProcessAction = 'Randomising Track Order'
                let array = this.trackIdArray
                var currentIndex = array.length, temporaryValue, randomIndex;
                // While there remain elements to shuffle...
                while (0 !== currentIndex) {
                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;
                    // And swap it with the current element.
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }
                this.trackIdArray = array
                this.addTracksToPlaylist()
            } 
            if(this.trackOrderType === 'descending') {
                this.refreshProcessAction = 'Ordering Tracks by Descending'
                var myArray = this.tracks
                myArray.sort(function compare(a, b) {
                    var dateA = new Date(a.added_at);
                    var dateB = new Date(b.added_at);
                    return dateB - dateA;
                });
                this.trackIdArray = []
                for(var i = 0; i < myArray.length; i++) {
                    this.trackIdArray.push(myArray[i].track.id)
                }
                this.addTracksToPlaylist()
            }
        },
        addTracksToPlaylist() {
            var chunkedArray = this.chunkArray(99, this.trackIdArray)
            this.refreshProcessAction = 'Chunking Tracks'
            
            let counter = 0;
            for(var i = 0; i < chunkedArray.length; i++) {
                counter++
                this.refreshProcessAction = 'Adding Tracks: Chunk '+ i
                var tracksArray = chunkedArray[i]
                const trackUrlArray = [];
                // Format track values for URL
                for(var k = 0; k < tracksArray.length; k++) {
                    var string = 'spotify:track:' + tracksArray[k]
                    trackUrlArray.push(string)
                }
           
                // Add playlist track
                // Headers
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + this.spotifyAuthData.accessToken, 
                        'Content-Type': 'application/json' 
                    }
                }
                axios.post('https://api.spotify.com/v1/playlists/'+this.playlistId+'/tracks', {
                    uris: trackUrlArray
                }, header)
                .then((res) => {
                    this.refreshProcessAction = 'Downloading Playlist Data'
                })
                .catch((err) => {
                    console.log(err)
                })

                // Once we are on the last itterate, wait a second for the last post to complete
                // Not ideal - but having this in then messes up to to loop not waiting for
                if(counter === chunkedArray.length) {
                    setTimeout(()=> {
                        this.refreshProcessAction = 'Initiating Playlist Refresh'
                        this.refreshingPlaylist = false
                        this.retrievePlaylist()
                        console.log('done')
                    }, 1000)
                }
            }

        },

        isEmpty(obj) {
            var empty = false
            if(Object.keys(obj).length === 0) {
                empty = false
            } else {
                empty = true
            }
            return empty
        }
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
    height: 30px;
    width: 30px;
    min-width: 30px;
    border-radius: 5px;
}
.trackTextarea {
    padding-left: 10px;
}
.trackTitle {
    font-size: 12px;
    color: var(--title-text);
    font-weight: bold;
}
.trackArtsitCon {
    display: flex;
    flex-wrap: wrap;
}
.trackArtistsP {
    font-size: 12px;
    margin-right: 5px;
    color: var(--body-text);
}
/* Playlist INfo */
.playlistInfoHeader {
    width: 100%;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
}
.playlistImg {
    height: 40px;
    width: 40px;
    border-radius: 5px;
    object-fit: cover;
}
.playlistInfoTextarea {
    padding-left: 10px;
}
.playlistName {
    color: var(--title-text);
    font-size: 14px;
    font-weight: bold;
}
.playlistInfo {
    color: var(--body-text);
    font-size: 14px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
.seperatorLine {
    display: block;
    height: 14px;
    width: 1px;
    margin: 0 7px;
    background-color: var(--body-text);
}
/* Refresh PLaylist btn section */
.actionCon {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
} 
.refreshProcessIndicator {
    width: 100%;
    height: 150px;
    background-color: var(--background-3);
    margin-bottom: 10px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.processAction {
    color: var(--title-text);
    font-size: 14px;
    font-weight: bold;
} 
.loadingGif {
    height: 20px;
    margin-bottom: 10px;
}
.refreshPlaylistBtn {
    width: 100%;
    padding: 10px 40px;
    background-color: var(--error-text);
    color: var(--title-text);
    font-size: 14px;
    border: none;
    border-radius: 10px;
    transition: 0.3s;
    cursor: pointer;
}
.refreshPlaylistBtn:hover {
    background-color: var(--error-text-hover);
}

.orderTypeBtn {
    width: calc(50% - 5px);
    margin-bottom: 10px;
    background-color: var(--background-2);
    border: none;
    border-radius: 10px;
    padding: 10px 40px;
    color: #FFF;
    cursor: pointer;
}
.orderTypeBtn.active {
    background-color: white;
    color: black;
}
</style>