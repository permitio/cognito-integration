# Example app to show how to integrate Cognito and Permit
Based on this great example https://github.com/sashee/cognito-auth-example

Follow Permit io docs site to see more details about this integration https://docs.permit.io/category/cognito


## Standalone setup (without terraform) terraform instructions below
Create a Cognito user pool and a client.

### Node backend setup
Set the following environment variables:
* ```USER_POOL_ID```: the user pool id
* ```CLIENT_ID```: the Cognito client id
* ```PERMIT_TOKEN```: Permit env token
Inside the /standalone_be/.env folder (you can see the .env.example file for reference)

Run npm install inside the /standalone_be folder
And then `npx nodemon index.mjs` to start the backend (or just `node index.mjs`)

### Frontend setup (vanilla JS)
Set the following environment variables in the `frontend/config.js file:
`cognitoLoginUrl` - the Cognito login URL should look like `https://[cognito-name].auth.[region].amazoncognito.com`
`clientId` - the Cognito client id

Run `npm install` inside the `frontend` folder
And then just start a local server in the `frontend` folder (for example `python -m SimpleHTTPServer 8000` or `npx http-server`)
Open the browser at `http://localhost:8000` and you should see the login page

:: Note that you should add the fe url to the backend CORS configuration
you should change this line 
```js
    res.header("Access-Control-Allow-Origin", "http://localhost:8181");
```
To your frontend url

## Deploy with terraform

Requirements: Terraform set up with an AWS account, npm

* ```terraform init```
* ```terraform apply```

## Usage

* go to the URL
* sign up with a user (for example ```test```/```Password1]```, to conform to the password policy)
* you'll see the Cognito user id and that you have tokens
* use "Refresh token" to generate a new set of access keys
* you'll see the status of each token
  * ```userInfo```: result for the [USERINFO endpoint](https://docs.aws.amazon.com/cognito/latest/developerguide/userinfo-endpoint.html)
  * ```api access_token```: API check for the access token
  * ```api id_token```: API check for the id token
* use "Revoke token" to send a revocation to the [REVOCATION endpoint](https://docs.aws.amazon.com/cognito/latest/developerguide/revocation-endpoint.html)

## Cleanup

* ```terraform destroy```


Thanks again to @sashee for the original example and explanation