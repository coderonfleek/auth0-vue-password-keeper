# Password Keeper

A Password storing and encrypting application built with Vuejs, Firebase and Auth0 Passwordless

## Project setup

1. Create An [Auth0](https://auth0.com) Application and Enable Passwordless connection for it (Email)
2. Set the Auth0 Application **Allowed Callback URLs**, **Allowed Web Origins**, **Allowed Logout URLs** and **Allowed Origins (CORS)** to `http://localhost:8080`
3. Create the file `auth_config.json` in the root of the project as shown below with your Auth0 application details

```
{
  "domain": "YOUR_AUTH0_DOMAIN",
  "clientId": "YOUR_CLIENT_ID"
}

```

3. Create a [Firebase project](https://firebase.google.com) with a Firestore collection named `passwordkeeper`
4. Create a `firebase_auth.json` file at the root of the project as displayed below using your firebase project details

```
{
  "project_id": "YOUR_FIREBASE_PROJECTID",
  "db_url": "YOUR_FIRESTORE_DB_URL"
}

```

5. Run `npm install` to install application dependencies
6. Run `npm run serve` to serve the application at the address `http://localhost:8080`
