<template>
  <div id="app">
    <button @click="login()" v-if="!$auth.isAuthenticated">Login To Auth0</button>
    <p v-if="$auth.isAuthenticated">
      Logged In
      <br />
      <button @click="logout()">Logout</button>
    </p>
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "app",
  components: {
    HelloWorld
  },
  methods: {
    login() {
      this.$auth.login();
    },
    logout() {
      this.$auth.logout();
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
