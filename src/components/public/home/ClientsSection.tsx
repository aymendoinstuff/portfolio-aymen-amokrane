import type { z } from "zod";
import type { ClientSchema } from "@/app/admin/settings/schema";

type Client = z.infer<typeof ClientSchema>;

interface ClientsSectionProps {
  clients: Client[];
  label?: string;
}

export default function ClientsSection({ clients, label = "Trusted by" }: ClientsSectionProps) {
  if (clients.length === 0) return null;

  return (
    <section className="py-20 border-y-2 border-black">
      <div className="max-w-5xl mx-auto px-4">
        {/* Section label */}
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-gray-400 mb-14">
          {label}
        </p>

        {/* Logo grid — large logos, name underneath */}
        <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-10">
          {clients.map((client, i) => (
            <a
              key={i}
              href={client.href || undefined}
              target={client.href ? "_blank" : undefined}
              rel="noreferrer"
              className="group flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-opacity duration-300"
              aria-label={client.name}
            >
              {client.logoHref ? (
                <img
                  src={client.logoHref}
                  alt={client.name}
                  className="h-10 w-auto max-w-[130px] object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              ) : (
                <div className="h-10 w-28 bg-gray-200 rounded" aria-hidden />
              )}
              {client.name && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 group-hover:text-black transition-colors">
                  {client.name}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
