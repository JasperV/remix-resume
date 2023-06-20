import type { V2_MetaFunction } from "@remix-run/cloudflare";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Dev Page" },
    { name: "description", content: "Remix Resume!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Development</h1>
    </div>
  );
}
