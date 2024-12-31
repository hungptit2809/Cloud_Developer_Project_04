const apiId = 'yqlivtubdd'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-3ca3p63exwsb7sny.us.auth0.com',    // Domain from Auth0
  clientId: 'iePi5GCMCt2Ws5e88qzqSMaKJL8dKUFd',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}