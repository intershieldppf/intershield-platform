import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "64px",
          height: "64px",
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
        }}
      >
        <img
          src="https://www.intershield.com.br/intershield-shield-v2.png"
          alt=""
          width="192"
          height="100"
          style={{
            position: "absolute",
            left: "-64px",
            top: "-14px",
            width: "192px",
            height: "auto",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
