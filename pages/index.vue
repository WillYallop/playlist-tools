<template>
  <div>
    <NavigationBar/>
    <div class="pageCon">
      <PageHeaderBar
      :title="'Playlist Refresh'"
      :subtitle="'Use this tool to refresh your playlists song added info'"/>
      <div class="pageWrapper">
        <PlaylistRefresh/>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationBar from '@/components/global/NavigationBar'
import PageHeaderBar from '@/components/global/PageHeaderBar'
import PlaylistRefresh from '@/components/index/PlaylistRefresh'

export default {
  middleware: 'spotify-auth',
  data() {
    return {

    }
  },
  components: {
    NavigationBar,
    PageHeaderBar,
    PlaylistRefresh
  },
  methods: {

  }
}
</script>

<style>

</style>