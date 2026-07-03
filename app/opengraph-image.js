import { ImageResponse } from "next/og";

export const alt = "ARIFA social preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const LOGO_URL = "https://arifa.org/assets/img/black-logo3.png";
const SITE_HOSTNAME = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://arifa.org",
).hostname;

async function loadLogoDataUri() {
  const response = await fetch(LOGO_URL);
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:image/png;base64,${base64}`;
}

export default async function Image() {
  const logo = await loadLogoDataUri();

  return new ImageResponse(
      (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#ffffff",
          color: "#000000",
          fontFamily: "Arial, Helvetica, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            height: 18,
            background: "#990000",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            right: 0,
            height: 18,
            background: "#00803d",
          }}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 84px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <img
              src={logo}
              alt="ARIFA logo"
              style={{
                width: 112,
                height: 112,
                objectFit: "contain",
                objectPosition: "left center",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 84,
                  lineHeight: 1,
                  fontWeight: 800,
                  color: "#990000",
                  letterSpacing: -3,
                }}
              >
                ARIFA |
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 26,
                  lineHeight: 1.2,
                  fontWeight: 700,
                  color: "#00803d",
                  maxWidth: 700,
                }}
              >
                Africa Research Institute for AI
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 42,
              maxWidth: 840,
              fontSize: 34,
              lineHeight: 1.25,
              fontWeight: 700,
              color: "#111111",
            }}
          >
            Advancing artificial intelligence research, training, and
            innovation across Africa.
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 22,
              lineHeight: 1.2,
              color: "#4b4b4b",
            }}
          >
            {SITE_HOSTNAME}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
