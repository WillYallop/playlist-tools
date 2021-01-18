import axios from 'axios'
import qs from 'qs'

const state = () => ({
    loggedIn: false,
    state: undefined,
    code: undefined,

    refreshToken: undefined,
    accessToken: undefined,
    scope: undefined,
    tokenType: undefined,

    accountData: {}

})
  
const mutations = {
    // Set callback data
    setCallbackData(state, data) {
        state.state = data.state
        state.code = data.code
    },
    // Set Tokens
    setTokens(state, data) {
        state.loggedIn = true
        state.accessToken = data.access_token
        state.refreshToken = data.refresh_token
        state.scope = data.scope
        state.tokenType = data.token_type
    },
    // New Access Token 
    newAccessToken(state, token) {
        state.accessToken = token
    },
    // Save user data
    saveUserData(state, data) {
        state.accountData = data
    },
    // Log Out
    logOut(state) {
        state.loggedIn = false
        state.state = undefined
        state.code = undefined
        state.accessToken =  undefined
        state.refreshToken = undefined
        state.scope = undefined
        state.tokenType = undefined
        this.$router.push('/sign-in')
    }

}

const actions = {
    getTokens({ commit, state, dispatch }) {
        // Header
        let config = {
            headers: {
                Authorization: 'Basic ' + process.env.SPOTIFY_CLIENT_AUTH,
                'Content-Type': 'application/x-www-form-urlencoded' 
            }
        }
        axios.post('https://accounts.spotify.com/api/token', qs.stringify({
            grant_type: 'authorization_code',
            code: state.code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URL
        }), config)
        .then((results) => {
            if(results.status === 200) {
                commit('setTokens', results.data)
                dispatch('getUserData')
            }
        })
        .catch((err) => {
            console.log(err)
            commit('logOut')
        })
    },
    getUserData({ commit, state }) {
        // Header
        let config = {
            headers: {
                Authorization: state.tokenType + ' ' + state.accessToken
            }
        }
        axios.get('https://api.spotify.com/v1/me', config)
        .then((results) => {
            commit('saveUserData', results.data)
            this.$router.push('/')
        })
        .catch((err) => {
            console.log(err)
        })
    },
    refreshTokens({ commit, state }) {
        let tokenHeader = {
            headers: {
                Authorization: 'Basic '+ process.env.SPOTIFY_CLIENT_AUTH, 
                'Content-Type': 'application/x-www-form-urlencoded' 
            }
        }
        // body
        var requestBody = {
            grant_type: 'refresh_token',
            refresh_token: state.refreshToken
        }
        axios.post('https://accounts.spotify.com/api/token', qs.stringify(requestBody), tokenHeader)
        .then((response) => {
            commit('newAccessToken', response.data.access_token)
        })
        .catch((err) => {
            console.log(err)
        }) 
    },

}

export default {
    state, 
    mutations,
    actions
}