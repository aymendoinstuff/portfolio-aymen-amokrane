"use client";

export default function Greeting() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <h1 className="text-xl font-bold text-gray-900">
      {greeting}, Aymen 👋
    </h1>
  );
}
