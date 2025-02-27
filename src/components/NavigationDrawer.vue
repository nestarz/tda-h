<template>
  <div>
    <v-navigation-drawer v-model="drawer" fixed app :class="{ 'has-alert': !isOnline }">
      <v-list>
        <v-list-tile :to="{ name: 'Projects' }" ripple exact>
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="{ name: 'Profile' }" ripple exact>
          <v-list-tile-action>
            <v-icon>info</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Profile</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="{ name: 'Settings' }" ripple>
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile @click="toggleLogoutDialog()" ripple>
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-if="! currentUser.isAnonymous">Logout</v-list-tile-title>
            <v-list-tile-title v-else>Login</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="currentUser.isAnonymous" :to="{ name: 'SignUp' }" ripple>
          <v-list-tile-action>
            <v-icon>person_add</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Create Account</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <toolbar v-on:toggle="drawer = !drawer"/>

    <v-dialog v-model="logoutDialog" @keydown.esc="toggleLogoutDialog()" max-width="290">
      <v-card>
        <v-card-title v-if="!currentUser.isAnonymous">Are you sure you want to logout?</v-card-title>
        <v-card-title v-else>Are you sure you want to logout? You probably meant to click Create Account instead to convert your anonymous account!</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat="flat" @click="toggleLogoutDialog()">
            No
          </v-btn>
          <v-btn color="primary" flat="flat" @click="logout()">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import firebase from '@/config/firebase'
import { mapMutations, mapState } from 'vuex'
import Toolbar from '@/components/Toolbar'

export default {
  name: 'navigation-drawer',
  data () {
    return {
      drawer: false,
      logoutDialog: false
    }
  },
  computed: {
    ...mapState(['currentUser']),
  },
  watch: {
    logoutDialog (active) {
      if (!active) {
        this.drawer = true
      }
    }
  },

  methods: {
    ...mapMutations([
      'SHOW_SNACKBAR',
      'HIDE_SNACKBAR',
    ]),
    toggleLogoutDialog () {
      this.logoutDialog = !this.logoutDialog
      this.drawer = !this.drawer
    },
    logout () {
      this.HIDE_SNACKBAR()

      firebase.auth().signOut().then(response => {
        this.$router.replace({
          name: 'Login'
        })
      }).catch(error => {
        this.SHOW_SNACKBAR(error.message)
      })
    }
  },

  components: {
    Toolbar
  }
}
</script>

<style scoped>
.has-alert {
  margin-top: 60px !important;
}
</style>
