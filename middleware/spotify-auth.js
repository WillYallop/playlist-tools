export default function ({ store, redirect }) {
    if(!store.state.spotifyAuth.loggedIn) {
        return redirect('/sign-in');
    }
}