<script>
import sha1 from 'sha1'
import forEach from 'lodash/forEach'
import { login } from '@/api/common'
import { encrypt, decrypt } from '@/utils/common-util'

const USERNAME = 'USERNAME'
const PASSWORD = 'PASSWORD'
const TOKEN = 'TOKEN'

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [],
        password: []
      },
      loading: false,
      rememberMe: true,
      passwordVisibility: false
    }
  },
  mounted() {
    // 从localStorage去除用户名和密码
    let username = localStorage.getItem(USERNAME)
    if (username) {
      let password = localStorage.getItem(PASSWORD)
      username = decrypt(username)
      password = decrypt(password)
      this.form.username = username
      this.form.password = password
    }
  },
  watch: {
    vErrors: {
      handler: function (val, oldVal) {
        forEach(this.rules, (val, key) => {
          this.rules[key] = [() => (this.vErrors.has(key) ? this.vErrors.first(key) : true)]
        })
      },
      deep: true
    }
  },
  methods: {
    async loginHandler() {
      this.rules.username = []
      const valid = await this.$validator.validateAll()
      if (!valid) return
      this.loading = true
      const { data: loginResult } = await login(this.form.username, sha1(this.form.password))
      this.loading = false
      if (loginResult.success) {
        localStorage.setItem(TOKEN, loginResult.token)
        if (this.rememberMe) { // 把用户密码加密保存到localStore
          localStorage.setItem(USERNAME, encrypt(this.form.username))
          localStorage.setItem(PASSWORD, encrypt(this.form.password))
        }
        const redirectUrl = decodeURIComponent(this.$route.query.redirect || '/admin')
        this.$router.push({ path: redirectUrl })
      } else {
        this.rules.username.push('用户名和密码不匹配，请检查')
      }
    }
  }
}
</script>

<template>
  <v-app>
    <div class="login-bg"></div>
    <v-container fluid>
      <v-layout justify-center align-center>
        <v-flex xs10 sm8 md6 lg4>
          <v-card class="elevation-3">
            <form @submit.prevent="loginHandler">
              <v-layout justify-center align-center>
                <v-flex xs12>
                  <h5>御锦黄金支撑平台</h5>
                </v-flex>
              </v-layout>
              <v-layout justify-center align-center>
                <v-flex xs10>
                  <v-text-field name="username" label="用户名" v-model="form.username" prepend-icon="perm_identity" data-vv-name="username" data-vv-as="用户名" :rules="rules.username" v-validate="'required'" required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout justify-center align-center>
                <v-flex xs10>
                  <v-text-field name="password" label="密码" v-model="form.password" prepend-icon="accessibility" :append-icon="passwordVisibility ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (passwordVisibility = !passwordVisibility)" :type="passwordVisibility ? 'text' : 'password'" data-vv-name="password" data-vv-as="密码" :rules="rules.password" v-validate="'required'" required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout justify-center align-center>
                <v-flex xs10>
                  <v-switch label="记住我" v-model="rememberMe"></v-switch>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-fab-transition>
                  <v-btn class="pink" fab dark :loading="loading" absolute bottom right type="submit">
                    <v-icon>trending_flat</v-icon>
                  </v-btn>
                </v-fab-transition>
              </v-layout>
            </form>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url('../../assets/img/login_bg.jpg') !important;
  background-repeat: no-repeat;
  background-size: cover !important;
  background-attachment: fixed !important;
  background-position: center !important;
  .login-bg {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    background-image: url('../../assets/img/login_bg.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed;
    background-position: center;
    filter: blur(10px);
    z-index: 0;
  }

  .container {
    position: relative;
    height: 100vh;
    background-size: cover;
    z-index: 1;
    .layout {
      height: 100%;
      .card {
        background: rgba(255, 255, 255, 1);
        h5 {
          color: #7E7E7E;
          text-align: center;
          font-weight: bold;
          letter-spacing: -0.05em;
          line-height: 20px;
          margin: 30px 0px 10px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>


<style lang="stylus">
@import '../../assets/styl/main'
@import '../../assets/font/material-icons.css'
</style>
