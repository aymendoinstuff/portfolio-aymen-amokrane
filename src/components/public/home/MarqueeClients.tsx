const logos = [
  "Amazon",
  "Microsoft",
  "Nike",
  "Adobe",
  "Uber",
  "Airbnb",
  "Coca-Cola",
  "Spotify",
  "Nestle",
  "Visa",
  "Samsung",
  "Ikea",
];
export default function MarqueeClients() {
  return (
    <div className="overflow-hidden border-y-2 border-black group">
      <div className="whitespace-nowrap animate-[marquee_32s_linear_infinite] group-hover:[animation-play-state:paused] py-4">
        {logos.concat(logos).map((name, i) => (
          <span
            key={i}
            className="inline-flex items-center mx-8 text-neutral-500"
          >
            <span
              className="h-5 w-10 bg-neutral-300 rounded-[2px] mr-2"
              aria-hidden
            ></span>
            <span className="uppercase tracking-[0.25em] text-[11px]">
              {name}
            </span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
