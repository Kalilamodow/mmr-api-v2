const EOS_CLIENT_ID = "xyza7891p5D7s9R6Gm6moTHWGloerp7B";
const EOS_CLIENT_SEC = "Knh18du4NVlFs+3uQ+ZPpDCVto0WYf4yXP8+OcwVt1o";
const DEPLOYMENT_ID = "da32ae9c12ae40e8a112c52e1f17f3ba";

type EOSDeviceResponse = {
  user_code: string; // "GXFFPJZD"
  device_code: string; // "R0pUU1JSQkJRUUZSUFhTUS5HWEZGUEpaRA=="
  verification_uri: "https://www.epicgames.com/activate";
  verification_uri_complete: string; // "https://www.epicgames.com/activate?userCode=GXFFPJZD"
  prompt: "login";
  expires_in: 600;
  interval: 10;
  client_id: "xyza7891p5D7s9R6Gm6moTHWGloerp7B";
};

type EOSAuthResponse = {
  scope: string;
  token_type: "bearer";
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: string;
  refresh_expires_in: number;
  refresh_expires_at: string;
  account_id: string;
  client_id: string;
  application_id: string;
  acr: string;
  auth_time: string;
};

export class EOSAuth {
  private auth: {
    accountId: string;
    accessToken: string;
    refreshToken: string;
  } | null;

  private refreshTokenUpdatedHandlers: ((refreshToken: string) => void)[];

  constructor() {
    this.auth = null;
    this.refreshTokenUpdatedHandlers = [];
  }

  public onRefreshTokenUpdate(fn: (refreshToken: string) => void) {
    this.refreshTokenUpdatedHandlers.push(fn);
  }

  public set(creds: EOSAuthResponse) {
    this.auth = {
      accountId: creds.account_id,
      accessToken: creds.access_token,
      refreshToken: creds.refresh_token,
    };

    for (const handler of this.refreshTokenUpdatedHandlers)
      handler(creds.refresh_token);
  }

  public get() {
    if (this.auth === null) throw new Error("Invalid credentials");
    return structuredClone(this.auth);
  }

  public exists() {
    return this.auth !== null;
  }

  public async refresh(): Promise<void>;
  public async refresh(refreshToken: string): Promise<void>;
  public async refresh(refreshToken?: string) {
    const response = await fetch(
      "https://api.epicgames.dev/epic/oauth/v2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${EOS_CLIENT_ID}:${EOS_CLIENT_SEC}`)}`,
          "User-Agent":
            "UELauncher/11.0.1-14907503+++Portal+Release-Live Windows/10.0.19041.1.256.64bit",
        },
        body: new URLSearchParams({
          deployment_id: DEPLOYMENT_ID,
          scope: "basic_profile",
          grant_type: "refresh_token",
          refresh_token: refreshToken ?? this.get().refreshToken,
          token_type: "eg1",
        }).toString(),
      },
    );

    const json: EOSAuthResponse & {
      error?: string;
      error_description?: string;
    } = await response.json();
    if (json.error) throw new Error(json.error_description);

    this.set(json);
  }
}

/**
 * Get a device code and the URL for the user to log in to
 */
export async function getDeviceCode() {
  const device: EOSDeviceResponse = await (
    await fetch("https://api.epicgames.dev/epic/oauth/v2/deviceAuthorization", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "UELauncher/11.0.1-14907503+++Portal+Release-Live Windows/10.0.19041.1.256.64bit",
      },
      body: new URLSearchParams({
        client_id: EOS_CLIENT_ID,
      }),
    })
  ).json();

  return {
    code: device.device_code,
    url: device.verification_uri_complete,
  };
}

/**
 * Check if the user has authenticated with the requested device.
 */
export async function pollCompletedDeviceCode(
  code: string,
): Promise<
  { type: "success"; data: EOSAuthResponse } | { type: "error"; error: string }
> {
  const response = await fetch(
    "https://api.epicgames.dev/epic/oauth/v2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${EOS_CLIENT_ID}:${EOS_CLIENT_SEC}`)}`,
        "User-Agent":
          "UELauncher/11.0.1-14907503+++Portal+Release-Live Windows/10.0.19041.1.256.64bit",
      },
      body: new URLSearchParams({
        deployment_id: DEPLOYMENT_ID,
        scope: "basic_profile",
        grant_type: "device_code",
        device_code: code,
      }).toString(),
    },
  );

  const json: EOSAuthResponse & { errorCode?: string } = await response.json();
  if (json.errorCode !== undefined) {
    return { type: "error", error: json.errorCode };
  } else {
    return { type: "success", data: json };
  }
}
