import axios from 'axios';

async function getAuth0ManagementApiToken() {
  const response = await axios.post(`https://dev-xxr5z7dtkpxjy1gl.us.auth0.com/oauth/token`, {
    client_id: process.env.MACHINE_CLIENTID,
    client_secret: process.env.MACHINE_SECRET,
    audience: process.env.AUTH0_AUDIENCE,
    grant_type: 'client_credentials'
  });

  return response.data.access_token;
}

export default getAuth0ManagementApiToken;