export const metadata = {
  title: "JuniorMark SunnyMoon Concert — Seat Map",
  description: "Register your seat for JuniorMark SunnyMoon Concert",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0b0c10", fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
