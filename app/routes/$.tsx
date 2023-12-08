import { json } from "@remix-run/node";

export const loader = () => {
  return json(null);
};

export default function SeparatorDemo() {
  return (
    <body className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
        <p className="text-lg text-gray-600">抱歉，页面找不到了。</p>
      </div>
    </body>
  );
}
