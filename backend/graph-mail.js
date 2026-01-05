// backend\graph-mail.js
import "dotenv/config";
import axios from "axios";
import qs from "qs";
import fs from "fs/promises";
import path from "path";

const tokenEndpoint = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;

/**
 * Persist refresh token to .env (development convenience).
 * In production you should persist to a secrets store (Key Vault, etc.)
 */
async function persistRefreshToken(newToken) {
  const envPath = path.resolve(process.cwd(), ".env");
  try {
    let text = "";
    try {
      text = await fs.readFile(envPath, "utf8");
    } catch (e) {
      /* file may not exist */
    }
    const regex = /^REFRESH_TOKEN=.*$/m;
    if (regex.test(text)) {
      text = text.replace(regex, `REFRESH_TOKEN=${newToken}`);
    } else {
      if (text.length && !text.endsWith("\n")) text += "\n";
      text += `REFRESH_TOKEN=${newToken}\n`;
    }
    await fs.writeFile(envPath, text, "utf8");
  } catch (e) {
    console.warn("Unable to persist refresh token to .env:", e.message || e);
  }
}

async function getAccessToken() {
  const data = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: process.env.REFRESH_TOKEN,
    scope: "offline_access Mail.Send openid profile",
  };

  let resp;
  try {
    resp = await axios.post(tokenEndpoint, qs.stringify(data), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  } catch (err) {
    console.error(
      "Failed to get access token:",
      err.response ? err.response.data : err.message
    );
    throw err;
  }

  // Persist rotated refresh token only in development (never write to .env in production)
  if (
    resp.data.refresh_token &&
    resp.data.refresh_token !== process.env.REFRESH_TOKEN
  ) {
    if (process.env.NODE_ENV !== "production") {
      await persistRefreshToken(resp.data.refresh_token);
      console.log("New refresh_token persisted to .env");
    } else {
      console.warn(
        "New refresh_token returned but not persisted in production. Persist to secure store."
      );
    }

    // Update in-memory env for this process
    process.env.REFRESH_TOKEN = resp.data.refresh_token;
  }

  return resp.data.access_token;
}

export async function sendMail({ to, subject, html }) {
  const token = await getAccessToken();
  const payload = {
    message: {
      subject,
      body: { contentType: "HTML", content: html || subject },
      toRecipients: [{ emailAddress: { address: to } }],
    },
    saveToSentItems: true,
  };

  try {
    await axios.post("https://graph.microsoft.com/v1.0/me/sendMail", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Mail sent to", to);
  } catch (err) {
    console.error(
      "Graph sendMail failed:",
      err.response ? err.response.data : err.message
    );
    throw err;
  }
}
