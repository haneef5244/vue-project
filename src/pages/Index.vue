<template>
  <q-page class="flex flex-center">
    <div v-if="!showRegistration" class="column q-pa-lg" :key="loginKey">
      <div class="row">
        <q-card square class="shadow-24" style="width:300px;height:485px;">
          <q-card-section class="bg-primary">
            <h4 class="text-h5 text-white q-my-md">Login</h4>
          </q-card-section>
          <q-card-section>
            <q-form class="q-px-sm q-pt-xl">
              <form @submit.prevent.stop="onSubmit('login')" class="q-gutter-md">
                <q-input
                  ref="email"
                  filled
                  v-model="email"
                  label="Email"
                  lazy-rules
                  :rules="[ val => validateEmail(val) || 'Please enter a valid mail']"
                >
                  <template v-slot:prepend>
                    <q-icon name="mail" />
                  </template>
                </q-input>

                <q-input
                  ref="password"
                  filled
                  :type="isPwd ? 'password' : 'text'"
                  v-model="password"
                  label="Password"
                  lazy-rules
                  :rules="[
                    val => validateStrongPassword(val) || 'Your password has to be between 7-15 characters and contains at least 1 numeric digit and 1 special character']"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
                <div class="q-mt-xl">
                  <q-btn class="full-width" label="Login" type="submit" color="primary" />
                  <q-btn label="Register" v-on:click="switchForm" color="primary" flat class="q-mt-sm full-width" />
                </div>
              </form>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- registration card-->
    <div v-if="showRegistration" class="column q-pa-lg" :key="registrationKey">
      <div class="row">
        <q-card square class="shadow-24" style="width:300px;height:530px;">
          <q-card-section class="bg-primary">
            <h4 class="text-h5 text-white q-my-md">Registration</h4>
          </q-card-section>
          <q-card-section>

            <q-form class="q-px-sm q-pt-xl q-pb-lg">
              <form @submit.prevent.stop="onSubmit('register')" class="q-gutter-md">
                <q-input
                  ref="email"
                  filled
                  v-model="email"
                  label="Email"
                  lazy-rules
                  :rules="[ val => validateEmail(val) || 'Please enter a valid mail']"
                >
                  <template v-slot:prepend>
                    <q-icon name="mail" />
                  </template>
                </q-input>
                <q-input
                  ref="name"
                  filled
                  type="text"
                  v-model="name"
                  label="Full Name"
                  lazy-rules
                  :rules="[
                  val => validateName(val) || 'Please enter a valid full name']"
                >
                  <template v-slot:prepend>
                    <q-icon name="face" />
                  </template>
                </q-input>
                <q-input
                  ref="password"
                  filled
                  :type="isPwd ? 'password' : 'text'"
                  v-model="password"
                  label="Password"
                  lazy-rules
                  :rules="[
                  val => validateStrongPassword(val) || 'Password must be 7-15 characters, 1 numeric digit, 1 special character']"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>

                <div class="">
                  <q-btn class="full-width" label="Register" type="submit" color="primary" />
                  <q-btn class="full-width q-mt-sm" label="Back to Login" v-on:click="switchForm" color="primary" />
                </div>
              </form>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
/* eslint-disable */
import axios from 'axios'

export default {
  name: 'PageIndex',
  props: ['value'],
  data () {
    return {
      loginKey: '1',
      registrationKey: '2',
      email: '',
      emailForReg: '',
      password: '',
      name: '',
      isPwd: true,
      showRegistration: false
    }
  },
  mounted() {


  },
  methods: {
    validateEmail (email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    },
    validateStrongPassword (password) {
      const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/
      return re.test(password)
    },
    validateName (name) {
      const re = /^[a-zA-Z]+ [a-zA-Z]+$/
      return re.test(name)
    },
    onSubmit (mode) {
      if (mode == 'login') {
        this.$refs.email.validate()
        this.$refs.password.validate()

        if (this.$refs.email.hasError || this.$refs.password.hasError) {
          this.formHasError = true
        } else {
          this.sendLoginHttpRequest()
        }
      } else if (mode == 'register') {
        this.$refs.email.validate()
        this.$refs.password.validate()
        this.$refs.name.validate()
        if (this.$refs.email.hasError || this.$refs.password.hasError || this.$refs.name.hasError) {
          this.formHasError = true
        } else {
          this.sendRegistrationHttpRequest()
        }
      }
    },
    sendLoginHttpRequest() {
      // POST request using fetch with async/await
      let url = "http://localhost:3000/users/login"
      axios.post(url, {
        email: this.email,
        password: this.password
      }).then((response) => {
        this.$q.notify({
          color: 'green',
          message: response.data.message
        })
        console.log('response data')
        console.log(response.data)
        this.$q.sessionStorage.set('sessionId', response.data.sessionId)
        this.$q.cookies.set('sessionId', response.data.sessionId)
        this.onChange()
        this.$router.push({name: response.data.path})

      }).catch(error => {
        this.$q.notify({
          icon: 'error',
          color: 'red',
          message: error.response.data.message
        })
      })
    },
    onChange() {
      this.$emit('update', true)
    },
    sendRegistrationHttpRequest() {
      // POST request using fetch with async/await
      let url = "http://localhost:3000/users"
      axios.post(url, {
        name: this.name,
        password: this.password,
        email: this.email
      })
      .then( (response) => {
        this.$q.notify({
          color: 'positive',
          message: 'Registration Successful'
        })
      })
      .catch((error) => {
        this.$q.notify({
          icon: 'error',
          color: 'red',
          message: error.response.data.message
        })
      })
    },
    switchForm () {
      this.email = ''
      this.name = ''
      this.password = ''
      this.showRegistration = !this.showRegistration
    }
  }
}
</script>

<style>
</style>
