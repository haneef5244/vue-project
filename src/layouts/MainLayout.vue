<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <!-- left header menu button -->
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Demo Github Search App
        </q-toolbar-title>

      </q-toolbar>
    </q-header>
    <!-- left drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Menu
        </q-item-label>
        <q-item
          clickable
          tag="a"
          target="_blank"
          v-on:click="logout"
          v-if="showLogout"
        >
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Logout</q-item-label>
            <q-item-label caption>
              Logout from your account
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container v-if="showRouter">
      <router-view :value="showLogout" @update="update"/>
    </q-page-container>
  </q-layout>
</template>

<script>
/* eslint-disable */
import axios from 'axios'

export default {
  name: 'MainLayout',
  data () {
    return {
      showLogout: false,
      showRouter: false,
      leftDrawerOpen: false
    }
  },

  mounted () {

  },
  beforeMount () {
    this.initSession()
  },
  methods: {
    initSession() {
      axios.defaults.withCredentials = true
      console.log("Mounted")
      let url = "http://localhost:3000/"
      axios.get(url, {
        headers: {
          withCredentials: true
        }
      }).then((response) => {
        if (response.status == '200') {
          console.log("Session retrived")
          this.showLogout = true
          this.$router.push({ name: response.data.path })
          this.$forceUpdate()
          this.showRouter = true
        }
      }).catch(error => {
        console.log("No session found")
        if(this.$q.cookies.has('sessionId')) {
          this.$q.cookies.remove('sessionId')
          this.showLogout = false
        }
        this.$router.push({name: 'home'})
        this.showRouter = true
      })

    },
    logout() {
      axios.get("http://localhost:3000/users/logout")
        .then((resp) => {
          console.log(resp)
          this.$q.cookies.remove('sessionId')
          this.$router.push({name : 'home'})
          this.showLogout = false
        })
        .catch((err) => {
          console.log("Printing err")
          console.log(err)
        })
    },
    update(v) {
      this.showLogout = v
    }
  }
}
</script>
