# Azure User Handling

A small node application used to enable and disable users in Azure AD via Microsoft Graph.

## Development

To develop the application you need to install dependencies and then run the app in watch mode

```sh
yarn
yarn watch

# in a separate terminal
yarn dev
```

## Hosting

The application is built to be hosted in [Azure App Service](https://azure.microsoft.com/en-us/services/app-service/) with the container feature.

> It should be setup with **authentication** and managed identity in the App Service.
