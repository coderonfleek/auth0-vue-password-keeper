/* eslint-disable no-console */
import Vue from "vue";
import { Auth0LockPasswordless } from "auth0-lock";

/** Define a default action to perform after authentication */

let instance;

/** Returns the current instance of the SDK */
export const getInstance = () => instance;

/** Creates an instance of the Auth0 SDK. If one has already been created, it returns that instance */
export const useAuth0 = options => {
  if (instance) return instance;

  // The 'instance' is simply a Vue object
  instance = new Vue({
    data() {
      return {
        loading: true,
        isAuthenticated: false,
        user: {},
        auth0Lock: null,
        popupOpen: false,
        error: null,
        accessToken: null
      };
    },
    methods: {
      /** Authenticates the user using a popup window */
      login(loginOptions) {
        this.popupOpen = true;

        this.auth0Lock.show(loginOptions);
      },
      checkSession() {
        return new Promise((resolve, reject) => {
          this.auth0Lock.checkSession({}, (error, authResult) => {
            if (error || !authResult) {
              this.auth0Lock.show();
            } else {
              // user has an active session, so we can use the accessToken directly.
              this.auth0Lock.getUserInfo(
                authResult.accessToken,
                (error, profile) => {
                  if (error) {
                    reject(error);
                  }

                  this.setProfileDetails(authResult.accessToken, profile);
                  resolve(profile);
                }
              );
            }
          });
        });
      },
      /** Logs the user out and removes their session on the authorization server */
      logout(o) {
        return this.auth0Lock.logout(o);
      },
      setProfileDetails(token, profile) {
        console.log(profile);
        this.accessToken = token;
        this.user = profile;
        this.isAuthenticated = true;
      }
    },
    /** Use this lifecycle method to instantiate the SDK client */
    async created() {
      // Create a new instance of the SDK client using members of the given options object
      this.auth0Lock = new Auth0LockPasswordless(
        options.clientId,
        options.domain
      );

      this.auth0Lock.on("authenticated", authResult => {
        this.auth0Lock.getUserInfo(
          authResult.accessToken,
          (error, profileResult) => {
            if (error) {
              throw error;
            }

            this.setProfileDetails(authResult.accessToken, profileResult);
          }
        );
      });
    }
  });

  return instance;
};

// Create a simple Vue plugin to expose the wrapper object throughout the application
export const Auth0Plugin = {
  install(Vue, options) {
    Vue.prototype.$auth = useAuth0(options);
  }
};
