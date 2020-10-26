<template>
  <q-page class="">
    <div v-if="isInitialized">
      <div v-if = "isAuthorized">
        <q-table
          title="Search for a repo in Github"
          :data="data"
          :columns="columns"
          row-key="id"
          :pagination.sync="pagination"
          :loading="loading"
          :filter="filter"
          @request="onRequest"
          binary-state-sort
          class="q-ma-sm"
        >
          <template v-slot:top-right>
              <div class="q-pr-xl" style="width:300px">
                <q-select class="full-width" rounded outlined v-model="findBy" :options="findByOptions" label="Find by" />
              </div>
              <div class="">
                <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
          </template>

        </q-table>
      </div>
      <div v-else>
        401 Unauthorized access
      </div>
    </div>
  </q-page>

</template>

<script>
/* eslint-disable */
import axios from 'axios'

export default {
  data () {
    return {
      isInitialized: false,
      isAuthorized: false,
      findBy: 'Language',
      findByOptions: [
        'Language','Topic'
      ],
      filter: '',
      loading: false,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      columns: [
        { name: 'id', required: true, label: 'ID', align: 'left', field: 'id'},
        { name: 'fullName', align: 'center', label: 'Full Name', field: 'fullName' },
        { name: 'url', label: 'HTML Url', field: 'url'},
        { name: 'watchersCount', label: 'Watchers Count', field: 'watchersCount' },
        { name: 'language', label: 'Language', field: 'language' },
        { name: 'forks', label: 'Forks', field: 'forks' }
      ],
      data: [],
      original: []
    }
  },
  mounted () {
    // get initial data from server (1st page)
    if (this.initSession()) {
      this.showLogout = true
      this.onRequest({
        pagination: this.pagination,
        filter: undefined
      })
    }
  },
  methods: {
    initSession() {
      axios.defaults.withCredentials = true
      console.log("Mounted")
      let param = {
        role : 'USER'
      }
      let url = "http://localhost:3000/users"
      axios.get(url, {
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
      })
    },
    onRequest (props) {
      let reqBody = {}
      if (this.findBy == 'Language') {
        reqBody = {
          language: this.filter,
          per_page: props.pagination.rowsPerPage,
          page: props.pagination.page
        }
      } else {
        reqBody = {
          topic: this.filter,
          per_page: props.pagination.rowsPerPage,
          page: props.pagination.page
        }
      }
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter
      console.log(JSON.stringify(reqBody))
      axios.post("http://localhost:3000/github", { reqBody })
        .then((resp) => {
          this.pagination.rowsNumber = resp.data.totalCount
          this.original = new Array(resp.data.totalCount)
          let startsAt = 0
          if (props.pagination.page == 1) {
            startsAt = 1
          } else {
            startsAt = 1 + ((props.pagination.page * props.pagination.rowsPerPage) - props.pagination.rowsPerPage)
          }
          console.log("starts at " + startsAt)
          let counter = 0;
          let max = props.pagination.page * props.pagination.rowsPerPage

          if (resp.data.data.length < props.pagination.rowsPerPage) {
            // if results is less than total rows per page
            for (let i = startsAt; i < startsAt + resp.data.data.length; i++) {
              console.log("i is :" + i)
              this.original[i] = resp.data.data[counter]
              counter++
            }
            console.log("printing origianl")
            console.log(this.original)
            this.data = this.original
          } else if (resp.data.data.length == 0) {
            // if results is empty (this should be handled in error, but there are times github api returns empty list)
            this.original = []
            this.data = this.original
          } else {
            // if results is equals props.pagination.rowsPerPage
            console.log("max is " + max)
            for (let i = startsAt; i <= max; i++) {
              console.log("i is :" + i)
              this.original[i] = resp.data.data[counter]

              counter++
            }
            console.log("printing origianl")
            console.log(this.original)
            this.data = this.original
          }
          console.log("Printing resp")
          console.log(resp.data)
          //this.pagination.rowsNumber = resp.data.totalCount

          console.log("Printing resp")
          console.log(resp.data)
          console.log(resp.data)

          this.pagination.page = page
          this.pagination.rowsPerPage = rowsPerPage
          this.pagination.sortBy = sortBy
          this.pagination.descending = descending

        })
        .catch((err) => {
          console.log("Printing err")
          console.log(err)
          this.original = []
          this.data = []
          this.loading = true
          this.pagination.page = page
          this.pagination.rowsPerPage = rowsPerPage
          this.pagination.sortBy = sortBy
          this.pagination.descending = descending

        })
      console.log("onRequest")
      //this.original = this.getGithubRepositories()



      // ...and turn of loading indicator
      this.loading = true
      // emulate server
      setTimeout(() => {
        this.loading = false
      }, 3500)
    },

    // emulate ajax call
    // SELECT * FROM ... WHERE...LIMIT...
    fetchFromServer (startRow, count, filter, sortBy, descending) {
      console.log("fetchFromServer")
      var data = []
      if (this.original == undefined || this.original.length == 0) {
        data = []
      } else {
        data = this.original
      }
      // handle sortBy
      if (sortBy) {
        const sortFn = sortBy === 'desc'
          ? (descending
              ? (a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
              : (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
          )
          : (descending
              ? (a, b) => (parseFloat(b[sortBy]) - parseFloat(a[sortBy]))
              : (a, b) => (parseFloat(a[sortBy]) - parseFloat(b[sortBy]))
          )
        data.sort(sortFn)
      }

      return data.slice(startRow, startRow + count)
    },

    // emulate 'SELECT count(*) FROM ...WHERE...'
    getRowsNumberCount (filter) {
      console.log("getRowsNumberCount")
      if (!filter) {
        if (this.original == undefined || this.original.length == 0) {
          return 0
        }
        return this.original.length
      }
      let count = 0
      this.original.forEach(() => {
        ++count
      })
      return count
    },
    getGithubRepositories () {

    }


  }
}
</script>

<style scoped>

</style>
