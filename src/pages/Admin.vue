<template>
  <q-page class="q-pa-md">
    <div v-if="isInitialized">
      <div v-if="isAuthorized">
        <div class="text-center">
          <span class="text-h5 text-center content-center justify-center">Searches By Category</span>
          <div class="row justify-center">
            <q-card flat bordered class="col-5 q-mr-sm" v-for="(data, idx) in byCategoryData" v-bind:key="idx">
              <q-card-section class="q-pa-md text-h5 q-mt-sm q-mb-xs">
                {{data.category}}
              </q-card-section>
              <q-card-section class="q-pa-md">
                <b>Keywords</b> :
                <span>
                  {{delimitKeywords(data.keyword)}}
                </span>
                <br>
                <span><b>Total count of searches</b> : {{data.count}}</span>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="text-center q-pt-md">
          <span class="text-h5 text-center content-center justify-center">Trending Searches (Past 1 Hour)</span>
          <div v-if="byTrendingData && byTrendingData.length > 0">
            <q-card flat bordered class="q-mb-md" v-for="(data, idz) in byTrendingData" v-bind:key="idz">
              <q-card-section>
                <div class="row">
                  <div class="col-4">
                    {{data.keyword}}
                  </div>
                  <div class="col-4">
                    {{data.totalCount}} searches
                  </div>
                  <div class="col-4">
                    {{ data.lastSearchedOn | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}
                  </div>
                </div>
              </q-card-section>

            </q-card>
          </div>
          <div v-else>
            <q-card>
              <q-card-section>
                No data found!
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <div v-else>
        404 Unauthorized Access
      </div>
    </div>
  </q-page>
</template>

<script>
/* eslint-disable */
import axios from 'axios'
export default {
  name: "Admin.vue",
  data () {
    return {
      isAuthorized: false,
      isInitialized: false,
      byCategoryData: [],
      byTrendingData: []
    }
  },
  mounted() {
    if (this.initSession()) {
      this.getSearchesByCategory()
      this.getTrendingSearches()
    }
  },
  methods : {
    initSession() {
      axios.defaults.withCredentials = true
      console.log("Mounted")
      let param = {
        role : 'ADMIN'
      }
      let url = "http://localhost:3000/users"
      axios.get(url,{
        headers: {
          withCredentials: true
        },
        params: param
      }).then((response) => {
        if (response.status == '200') {
          this.isAuthorized = true
          this.isInitialized = true
        }
      }).catch(error => {
        this.isInitialized = true
        console.log("No session found")
      })
      return true
    },
    getSearchesByCategory() {
      let url = "http://localhost:3000/search-history/byCategory"
      axios.get(url, {
        headers: {
          withCredentials: true
        }
      }).then((response) => {
        if (response.status == '200') {
          console.log(response.data)
          this.byCategoryData = response.data.data
        }
      }).catch(error => {
        console.log("No session found")
      })
    },
    getTrendingSearches() {
      let url = "http://localhost:3000/search-history/trending"
      axios.get(url, {
        headers: {
          withCredentials: true
        }
      }).then((response) => {
        if (response.status == '200') {
          console.log(response.data)
          this.byTrendingData = response.data.data
        }
      }).catch(error => {
        console.log("No session found")
      })
    },
    delimitKeywords(vals) {
      if (vals && vals.length > 0) {
        var delimited = ""
        for (let i = 0; i < vals.length + 1; i++) {
          delimited += `${vals[i]}, `
        }
        delimited += `${vals[vals.length - 1]}`
        return delimited
      } else return vals
    }
  }
}
</script>

<style scoped>

</style>
