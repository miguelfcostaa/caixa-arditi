import { ImageResponse } from "next/og";

export const alt = "Projeto C.A.I.X.A.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#FCFAF9",
          color: "#07213D",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            maxWidth: "980px",
          }}
        >
          <div style={{ color: "#F85308", fontSize: 30, fontWeight: 700 }}>
            PREVENÇÃO · SAÚDE · TECNOLOGIAS XR
          </div>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800 }}>
            Projeto&nbsp;<span style={{ color: "#F85308" }}>C.A.I.X.A.</span>
          </div>
          <div style={{ display: "flex", fontSize: 34, lineHeight: 1.35 }}>
            Da Consciencialização à Ação na prevenção do cancro infantil.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
