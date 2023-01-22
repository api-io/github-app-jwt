import { getOctokit } from "@actions/github";
import { createAppAuth } from "@octokit/auth-app";
import { request } from "@octokit/request";
import ensureError from "ensure-error";

export const fetchAppToken = async ({
  appId,
  privateKey,
}: Readonly<{
  appId: string;
  privateKey: string;
}>): Promise<string> => {

  const app = createAppAuth({
    appId,
    privateKey
  });

  const authApp = await app({ type: "app" });
  await test_token(authApp.token);
  return authApp.token;

}

function test_token(token:string){
  
    //test token
    const response =  await axios.default({
      url: 'https://api.github.com/app', 
      method: 'get',
      responseType: 'json',
      headers: {
        authorization:`bearer ${token}`
      }});

    info(`Fetching APP ${appId} installations response with ${response.statusText}`);

    info(JSON.stringify(response.data, null, 2));

}