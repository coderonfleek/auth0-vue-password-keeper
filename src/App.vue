<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <a class="navbar-brand" href="#">
        Password Keeper
        <span v-if="$auth.isAuthenticated">( {{ $auth.user.name }} )</span>
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <div class="navbar-nav mr-auto user-details">
          <span v-if="$auth.isAuthenticated">({{ $auth.user.email }})</span>
          <span v-else>&nbsp;</span>
        </div>

        <span class="navbar-text">
          <ul class="navbar-nav float-right">
            <li class="nav-item" v-if="!$auth.isAuthenticated">
              <a class="nav-link" href="#" @click="login()">Log In</a>
            </li>

            <li class="nav-item" v-if="$auth.isAuthenticated">
              <a class="nav-link" href="#" @click="logout()">Log Out</a>
            </li>
          </ul>
        </span>
      </div>
    </nav>

    <div v-if="!$auth.isAuthenticated" id="welcomeScreen">
      <h1>Welcome to Vue Password Keeper</h1>
      <p>
        <i>We'll never share your secret with anyone else.</i>
      </p>
      <button class="btn btn-primary" @click="login()">Login To Auth0</button>
    </div>
    <div v-else id="appScreen" class="container">
      <div class="row">
        <div class="col-md-4">
          <form>
            <div class="form-group">
              <label>Enter Account Name</label>
              <input
                class="form-control"
                v-model="passwordForm.account_name"
                placeholder="E.g My Auth0 Account"
              />
            </div>

            <div class="form-group">
              <label>Enter Account ID</label>
              <input
                class="form-control"
                v-model="passwordForm.account_id"
                placeholder="E.g my@email.com or myusername"
              />
            </div>

            <div class="form-group">
              <label>Enter Password</label>
              <input class="form-control" type="password" v-model="passwordForm.password" />
              <small class="form-text text-muted">We'll never share your secret with anyone else.</small>
            </div>

            <button
              type="button"
              class="btn btn-primary"
              @click="savePassword()"
              :disabled="processing"
            >{{processing? "Saving...": "Save Password"}}</button>
          </form>
        </div>
        <div class="col-md-6 offset-md-2">
          <h3>Saved Passwords</h3>
          <ul class="list-group">
            <li class="list-group-item" v-for="password in savedpasswords" :key="password.id">
              {{password.account_name}}
              <button
                class="btn btn-success float-right"
                @click="viewPassword(password)"
              >View Password</button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Modal -->

      <modal
        v-if="modal.show"
        @close="modal.show = false"
        :header="modal.header"
        :content="modal.content"
      ></modal>
    </div>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
let CryptoJS = require("crypto-js");
import db from "./db.js";
import { passwords_db } from "../firebase_auth.json";
import { user_localstorage_key } from "../auth_config.json";
import modal from "./components/modal";

export default {
  name: "app",
  data() {
    return {
      passwordForm: {},
      savedpasswords: [],
      processing: false,
      modal: {
        show: false,
        header: "My header",
        content: "My Content"
      },
      user: this.$auth.user
    };
  },
  async created() {
    let profile = await this.$auth.checkSession();

    this.$bind(
      "savedpasswords",
      db.collection(passwords_db).where("user", "==", profile.email || "")
    );
  },

  components: { modal },

  methods: {
    login() {
      this.$auth.login();
    },
    logout() {
      this.$auth.logout();
    },
    async savePassword() {
      if (
        this.passwordForm.account_name &&
        this.passwordForm.account_id &&
        this.passwordForm.password
      ) {
        let ciphertext = CryptoJS.AES.encrypt(
          this.passwordForm.password,
          this.$auth.user.sub
        );

        let postData = {
          user: this.$auth.user.email,
          account_id: this.passwordForm.account_id,
          account_name: this.passwordForm.account_name,
          encrypted_password: ciphertext.toString()
        };

        console.log(postData);

        this.processing = true;

        await db.collection(passwords_db).add(postData);

        this.processing = false;

        this.showModal(
          "Success",
          `Password Successfully added for Account: ${this.passwordForm.account_name}`
        );

        //Clear form
        this.passwordForm = {};
      } else {
        this.showModal("Error", `All fields are required`);
      }
    },
    showModal(title, body) {
      this.modal = {
        show: true,
        header: title,
        content: body
      };
    },
    viewPassword(passwordDetails) {
      //Decrypt password
      let bytes = CryptoJS.AES.decrypt(
        passwordDetails.encrypted_password,
        this.$auth.user.sub
      );
      let plaintextPassword = bytes.toString(CryptoJS.enc.Utf8);

      this.showModal(
        `Credentials for ${passwordDetails.account_name}`,
        `Account ID: ${passwordDetails.account_id}, Password: ${plaintextPassword}`
      );
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;

  color: #2c3e50;
}

#welcomeScreen,
#appScreen {
  margin-top: 20px;
}

#welcomeScreen {
  text-align: center;
}
</style>
