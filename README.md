# Axios Token 🛡

Bother with handling jwt web tokens in your React project? Wanna a "magick stick" which does everything by its own? So, you are in right package!

Please welcome to  `axios-token` - fastest way to handle web tokens.

Here are all steps you need to do: 

### Step 1 

Create an instance of Axios and pass it to `axiosToken` as shown down below: 

```js
import { axiosToken } from "axios-token-handler";

const axios = Axios.create({
  baseURL,
  timeout: 100000,
  withCredentials: true,
  headers: {
    "Content-type": "application/json"
  }
});

export const tokenHandler = axiosToken(axios, {
  accessTokenKey: "access_token",
  refreshTokenKey: "refresh_token",
  accessTokenExpiresInKey: "expires_in",
  refreshTokenUrl: "/auth/refresh",
  onExpired() {
    tokenHandler.clearToken();
    // Logout from project or redirect to login page
  }
});

```

### Step 2

In your signin or signup implementations pass sucessfull payload to `setToken()` method:
```js
// for example
 const { mutate, isLoading } = useMutation(AuthApi.loginUser, {
    onSuccess: tokens => tokenHandler.setToken(tokens);
  });

```

Let's suppose your server returns following payload during user `signin` or `signup`:

```json
{
    "token_type": "Bearer",
    "access_token": "yourJWTAccessToken",
    "refresh_token": "yourJWTRefreshToken",
    "expires_in": 86400
}

```

All token information are saved to `sessionStorage` by default.

--- 
Fields explanation:   
|Field name | Default values | Description | 
|---- | ----- | ----- |
| `accessTokenKey` |  `accessToken`  |  this field per our response example should be changed to `access_token`   |
| `refreshTokenKey` |  `refreshToken`  |  this field per our response example should be changed to `refresh_token`   |
| `accessTokenExpiresInKey` |  `accessTokenExpiresIn`  |  this field per our response example should be changed to `expires_in`   |
| `refreshTokenurl` |  an empty `string`  |  this field requires refresh token url path implemented in server. If server url provided as axios `baseUrl` it is enough to add relative path like `/auth/refresh`.   |

--- 
Methods explanation:
|Method name | Parameters | Description | 
|---- | ----- | ----- |
| `getToken()` |  `access_token` \| `refresh_token` \| or no argument  |  If no argument has been passed it returns object payload saved in Storage. Otherwise, it returns string of provided key value.   |
| `setToken()` |  payload from server  | On Signin or Signup just pass an object of token information. Example response has been provided above.   |
| `refreshToken()` |  no arguments  | In case where new tokens are required, just call this method and all tokens would be refreshed.   |
| `clearToken()` |  no arguments  |  Clears token information from Storage.     |

--- 
Callback methods explanation:
|Method name | Return values | Description | 
|---- | ----- | ----- |
| `onExpired()` | error   |  This is for controlling next step in case when refresh token expires. Usually in this case better to clear storage and forward to login/home pages.   |
| `ontError()` |  error  |  If during handling process somthing goes wrong, then an error would be thrown for further catch at your side.  |