import { Instagram, Facebook, Twitter, Globe, Mail, BadgeCheck } from "lucide-react";

const SOCIALS = [
  { Icon: Instagram, label: "@sawah.hijau", href: "https://instagram.com", tint: "text-pink-500" },
  { Icon: Facebook, label: "Sawah Hijau Co-op", href: "https://facebook.com", tint: "text-blue-600" },
  { Icon: Twitter, label: "@sawahhijau", href: "https://twitter.com", tint: "text-sky-500" },
  { Icon: Globe, label: "sawahhijau.id", href: "https://sawahhijau.id", tint: "text-primary" },
  { Icon: Mail, label: "halo@sawahhijau.id", href: "mailto:halo@sawahhijau.id", tint: "text-chain" },
];

export function ShopOwnerSocial() {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-primary text-base font-bold text-primary-foreground">
          BS
        </div>
        <div className="flex-1 leading-tight">
          <div className="flex items-center gap-1.5 text-sm font-bold">
            Pak Budi Santoso
            <BadgeCheck className="h-3.5 w-3.5 text-chain" />
          </div>
          <div className="text-[11px] text-muted-foreground">Pemilik · Sawah Hijau Cooperative</div>
        </div>
      </div>

      <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Sosial Media Toko
      </div>
      <div className="mt-2 grid gap-1.5">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2.5 rounded-lg border border-transparent bg-accent/40 px-2.5 py-2 text-xs transition-colors hover:border-primary/30 hover:bg-accent"
          >
            <span className={`grid h-7 w-7 place-items-center rounded-md bg-card ${s.tint}`}>
              <s.Icon className="h-3.5 w-3.5" />
            </span>
            <span className="font-medium">{s.label}</span>
            <span className="ml-auto text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              Buka →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
