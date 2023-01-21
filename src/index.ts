import { Buffer } from "node:buffer";
import { getInput, info, setFailed, setOutput, setSecret } from "@actions/core";
import ensureError from "ensure-error";
import isBase64 from "is-base64";
import { fetchAppToken } from "./fetch-app-token.js";
import axios from 'axios'

const run = async () => {
  try {
    const appId = getInput("app_id", { required: true });


    const privateKeyInput = getInput("private_key", { required: true });
    const privateKey = isBase64(privateKeyInput)
      ? Buffer.from(privateKeyInput, "base64").toString("utf8")
      : privateKeyInput;


    const token = await fetchAppToken({
      appId,
      privateKey
    });
    
    //test token
    const response =  await axios.default({
      url: 'https://api.github.com/app/installations', 
      method: 'get',
      responseType: 'json',
      headers: {
        authorization:`bearer ${token}`
      }});

    info(`Fetching APP ${appId} installations response with ${response.statusText}`);

    info(JSON.stringify(response.data, null, 2));

    setSecret(token);
    setOutput("token", token);
    info("Token generated successfully!");
  } catch (_error: unknown) {
    const error = ensureError(_error);
    setFailed(error);
  }
};

void run();
