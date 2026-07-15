export interface GridProps {
  title: string;
  description: string;
  brand: string;
  logo?: string;
}

export const Grid = ({ title, description, brand, logo = "" }: GridProps) => (
  <div
    style={{
      backgroundColor: "#0a0a0a",
      color: "#ffffff",
      display: "flex",
      height: "100%",
      position: "relative",
      width: "100%",
    }}
  >
    <div
      style={{
        borderLeft: "1px dashed #44403c",
        bottom: 0,
        left: "64px",
        position: "absolute",
        top: 0,
        width: "1px",
      }}
    />
    <div
      style={{
        borderLeft: "1px dashed #44403c",
        bottom: 0,
        position: "absolute",
        right: "64px",
        top: 0,
        width: "1px",
      }}
    />
    <div
      style={{
        borderTop: "1px dashed #44403c",
        height: "1px",
        left: 0,
        position: "absolute",
        right: 0,
        top: "64px",
      }}
    />
    <div
      style={{
        borderTop: "1px dashed #44403c",
        bottom: "64px",
        height: "1px",
        left: 0,
        position: "absolute",
        right: 0,
      }}
    />

    <div
      style={{
        bottom: "128px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        left: "128px",
        position: "absolute",
        right: "128px",
        top: "128px",
        width: "896px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          fontSize: title && title.length > 20 ? 64 : 80,
          fontWeight: 600,
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
          textWrap: "balance",
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: "#a8a29e",
          display: "flex",
          flexGrow: 1,
          fontSize: "40px",
          fontWeight: 500,
          lineHeight: 1.5,
          marginTop: "24px",
          textWrap: "balance",
        }}
      >
        {description}
      </div>
    </div>

    <div
      style={{
        alignItems: "center",
        bottom: "96px",
        display: "flex",
        gap: "14px",
        position: "absolute",
        right: "96px",
      }}
    >
      {logo ? (
        <img
          alt=""
          height={48}
          src={logo}
          width={48}
          style={{
            borderRadius: "12px",
            objectFit: "contain",
          }}
        />
      ) : (
        <div
          style={{
            alignItems: "center",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            color: "#0a0a0a",
            display: "flex",
            fontSize: "26px",
            fontWeight: 800,
            height: "48px",
            justifyContent: "center",
            width: "48px",
          }}
        />
      )}
      <span
        style={{
          fontSize: "30px",
          fontWeight: 600,
        }}
      >
        {brand}
      </span>
    </div>
  </div>
);
