<template>
  <v-app>
    <v-navigation-drawer dark persistent enable-resize-watcher :mini-variant.sync="miniVariant" :clipped="clipped" v-model="drawer" class="blue-grey darken-4">
    <v-list class="pa-0 blue-grey darken-4">
      <v-list-tile avatar tag="div">
        <v-list-tile-avatar>
          <img src="https://randomuser.me/api/portraits/men/85.jpg"></img>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>John Leider</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon dark @click.native.stop="toggleMainNavMiniVariant">
            <v-icon dark v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-list class="blue-grey darken-4">
      <v-list-tile v-for="nav in navs" :key="nav.title" :to="nav.to" router ripple>
        <v-list-tile-action>
          <v-btn icon dark @click.native.stop="showMainNavMiniVariant">
            <v-icon dark>{{ nav.action }}</v-icon>
          </v-btn>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ nav.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
    <v-toolbar fixed>
      <v-toolbar-side-icon @click.native.stop="toggleMainNavDrawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.native.stop="toggleMainNavClipped">
        <v-icon>web</v-icon>
      </v-btn>
    </v-toolbar>
    <main>
      <v-container>
        <router-view></router-view>
        <v-speed-dial fixed bottom right direction="top" hover transition="slide-y-reverse-transition" v-model="fab">
          <v-btn slot="activator" class="secondary" dark fab hover v-model="fab">
            <v-icon>data_usage</v-icon>
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn fab dark small class="green" @click.native.stop="gotoTop">
            <v-icon>vertical_align_top</v-icon>
          </v-btn>
          <v-btn fab dark small class="indigo" @click.native.stop="backup">
            <v-icon>keyboard_arrow_left</v-icon>
          </v-btn>
        </v-speed-dial>
      </v-container>
    </main>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Index',
  data() {
    return { fab: false }
  },
  computed: {
    ...mapState({
      miniVariant: state => state.admin.miniVariant,
      clipped: state => state.admin.clipped,
      navs: state => state.admin.navs,
      title: state => state.admin.title
    }),
    drawer: {
      get() {
        return this.$store.state.admin.drawer
      },
      set(val) {
        this.$store.commit('admin/SET_MAIN_NAV_DRAWER', val)
      }
    }
  },
  methods: {
    ...mapActions('admin', [
      'toggleMainNavMiniVariant',
      'toggleMainNavClipped',
      'toggleMainNavDrawer'
    ]),
    gotoTop() {
      scrollTo(0, 0)
    },
    backup() {
      this.$router.back()
    }
  }
}
</script>

<style lang="stylus">
@import '../../../assets/styl/main'
@import '../../../assets/css/main.css'
</style>
