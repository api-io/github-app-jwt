import { Buffer } from "node:buffer";
import { getInput, info, setFailed, setOutput, setSecret } from "@actions/core";
import ensureError from "ensure-error";
import isBase64 from "is-base64";
import { fetchAppToken } from "./fetch-app-token.js";
import axios, { AxiosResponse } from 'axios'

const run = async () => {
  try {
    const appId = getInput("app_id", { required: true });


    const privateKeyInput = getInput("private_key", { required: true });
    const privateKey = isBase64(privateKeyInput)
      ? Buffer.from(privateKeyInput, "base64").toString("utf8")
      : privateKeyInput;


    const installationToken = await fetchAppToken({
      appId,
      privateKey
    });
    
    //test token
    const { token } = await getAppAuthentication(state);
    const response =  await axios.get(config.http_url, {
      method: 'get',
      responseType: 'stream',
      headers: {
        authorization:`bearer ${token}`
      }});
      
    info(response);

    setSecret(installationToken);
    setOutput("token", installationToken);
    info("Token generated successfully!");
  } catch (_error: unknown) {
    const error = ensureError(_error);
    setFailed(error);
  }
};

void run();
