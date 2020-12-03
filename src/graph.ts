import fetch, { Response } from "node-fetch";
import { DefaultAzureCredential } from "@azure/identity";

import * as User from "./User";

const json_or_throw = <T>(res: Response): Promise<T> => {
  if (res.status < 200 || res.status > 399) {
    throw new Error(`status: ${res.status}, message: ${res.statusText}`);
  }
  return res.json();
};

const text_or_throw = (res: Response): Promise<string> => {
  if (res.status < 200 || res.status > 399) {
    throw new Error(`status: ${res.status}, message: ${res.statusText}`);
  }
  return res.text();
};

export const make = () => {
  const credentials = new DefaultAzureCredential();

  const get_user_by_upn = async (email: string) => {
    const select = `$select=id,accountEnabled,displayName,country,mail,userPrincipalName`;
    const url = `https://graph.microsoft.com/beta/users?$filter=startsWith(userPrincipalName,'${email}')&${select}`;

    const access_token = await credentials.getToken([
      "https://graph.microsoft.com/.default",
    ]);

    if (access_token == null) {
      throw new Error("Could not get access_token");
    }

    return fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access_token?.token}`,
      },
    }).then((res) => json_or_throw<{ value: User.t[] }>(res));
  };

  const get_user_by_id = async (email: string) => {
    const select = `$select=id,accountEnabled,displayName,country,mail,userPrincipalName`;
    const url = `https://graph.microsoft.com/beta/users/${email}?${select}`;

    const access_token = await credentials.getToken([
      "https://graph.microsoft.com/.default",
    ]);

    if (access_token == null) {
      throw new Error("Could not get access_token");
    }

    return fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access_token?.token}`,
      },
    }).then((res) => json_or_throw<User.t>(res));
  };

  const get_auth_methods = async (email: string) => {
    const access_token = await credentials.getToken([
      "https://graph.microsoft.com/.default",
    ]);

    if (access_token == null) {
      throw new Error("Could not get access_token");
    }

    const url = `https://graph.microsoft.com/beta/users/${email}/authentication/methods`;

    return fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access_token?.token}`,
      },
    }).then((res) => res.json());
  };

  const disable_user_by_id = async (email: string) => {
    const access_token = await credentials.getToken([
      "https://graph.microsoft.com/.default",
    ]);

    if (access_token == null) {
      throw new Error("Could not get access_token");
    }

    return fetch(`https://graph.microsoft.com/v1.0/users/${email}`, {
      method: "PATCH",
      body: JSON.stringify({ accountEnabled: false }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token?.token}`,
      },
    }).then((res) => text_or_throw(res));
  };

  const enable_user_by_id = async (email: string) => {
    const access_token = await credentials.getToken([
      "https://graph.microsoft.com/.default",
    ]);

    if (access_token == null) {
      throw new Error("Could not get access_token");
    }

    return fetch(`https://graph.microsoft.com/v1.0/users/${email}`, {
      method: "PATCH",
      body: JSON.stringify({ accountEnabled: true }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token?.token}`,
      },
    }).then((res) => text_or_throw(res));
  };

  return {
    get_auth_methods,
    get_user_by_upn,
    get_user_by_id,
    disable_user_by_id,
    enable_user_by_id,
  };
};
