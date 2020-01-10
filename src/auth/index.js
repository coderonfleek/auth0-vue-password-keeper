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
      async loginWithPopup(loginOptions) {
        this.popupOpen = true;

        this.auth0Lock.show(loginOptions);

        /* try {
          await this.auth0Lock.loginWithPopup(o);
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        } finally {
          this.popupOpen = false;
        }

        this.user = await this.auth0Lock.getUser();
        this.isAuthenticated = true; */
      },
      /** Handles the callback when logging in using a redirect */
      async handleRedirectCallback() {
        this.loading = true;
        try {
          await this.auth0Lock.handleRedirectCallback();
          this.user = await this.auth0Lock.getUser();
          this.isAuthenticated = true;
        } catch (e) {
          this.error = e;
        } finally {
          this.loading = false;
        }
      },
      /** Authenticates the user using the redirect method */
      loginWithRedirect(o) {
        return this.auth0Lock.loginWithRedirect(o);
      },
      /** Returns all the claims present in the ID token */
      getIdTokenClaims(o) {
        return this.auth0Lock.getIdTokenClaims(o);
      },
      /** Returns the access token. If the token is invalid or missing, a new one is retrieved */
      getTokenSilently(o) {
        return this.auth0Lock.getTokenSilently(o);
      },
      /** Gets the access token using a popup window */

      getTokenWithPopup(o) {
        return this.auth0Lock.getTokenWithPopup(o);
      },
      /** Logs the user out and removes their session on the authorization server */
      logout(o) {
        return this.auth0Lock.logout(o);
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
              return;
            }

            console.log(authResult);
            console.log(profileResult);

            this.accessToken = authResult.accessToken;
            this.getUser = profileResult;
            this.isAuthenticated = true;

            // Update DOM
          }
        );
      });

      //Check the session if its still active an bring up login page if session has expired
      /* this.auth0Lock.checkSession({}, (error, authResult) => {
        if (error || !authResult) {
          this.auth0Lock.show();
        } else {
          // user has an active session, so we can use the accessToken directly.
          this.auth0Lock.getUserInfo(
            authResult.accessToken,
            (error, profile) => {
              console.log(error, profile);
            }
          );
        }
      }); */
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
