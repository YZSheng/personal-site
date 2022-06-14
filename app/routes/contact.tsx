import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return {
    title: "Contact Yunzhou",
  };
};

export function headers() {
  return {
    "Cache-Control": "public, max-age=86400",
  };
}

export default function Contact() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Hi there.</h1>
      <div>
        You can contact me at{" "}
        <a className="font-semibold" href="mailto:shengyunzhou@gmail.com">
          shengyunzhou@gmail.com
        </a>
        .
      </div>
    </div>
  );
}
