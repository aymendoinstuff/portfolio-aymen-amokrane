import SectionTitle from "@/components/SectionTitle";
import CountUp from "@/components/public/about/CountUp";
import { getServerSiteSettings } from "@/lib/settings/server";

/* ===== Style tokens ===== */
const container   = "max-w-5xl mx-auto px-4";
const titleStyle  = "text-sm font-semibold uppercase tracking-[0.15em]";
const tagStyle    = "border px-2 py-1 rounded-full text-xs";
const bigNumber   = "text-6xl md:text-7xl font-extrabold leading-none tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-black to-black/70";
/* ======================== */

export default async function AboutPage() {
  const settings = await getServerSiteSettings();
  const { personal, heroAvatarUrl, heroCoverUrl, intro, experiences, education, skills, tools, stats } = settings.about;

  const name     = personal.name     || "Aymen Doin Stuff";
  const role     = personal.role     || "Senior Brand Designer";
  const location = personal.location || "Dubai";
  const introText = intro || "Designer focused on strategy-led brand systems. I help teams ship identities that scale — from positioning to guidelines and design ops.";

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative h-[42vh] min-h-[300px] flex items-center justify-center bg-black text-white overflow-hidden">
        {/* Cover image */}
        {heroCoverUrl && (
          <img
            src={heroCoverUrl}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center">
          {/* Avatar */}
          <div className="mx-auto h-28 w-28 rounded-full border-2 border-white overflow-hidden bg-gray-800 shadow">
            {heroAvatarUrl ? (
              <img src={heroAvatarUrl} alt={name} fetchPriority="high" decoding="async" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                {name[0]?.toUpperCase() ?? "A"}
              </div>
            )}
          </div>
          <div className="mt-3 text-xl font-medium">{name}</div>
          <div className="text-sm opacity-80">
            {role}{location ? ` — ${location}` : ""}
          </div>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className={`${container} py-10`}>
        <p className="text-lg md:text-xl leading-relaxed font-medium text-center text-gray-800 whitespace-pre-line">
          {introText}
        </p>
      </section>

      {/* ── Experience ── */}
      {experiences.length > 0 && (
        <section className={`${container} pb-10`}>
          <SectionTitle>Experience</SectionTitle>
          <div className="divide-y divide-black/40">
            {experiences.map((e, i) => (
              <div key={i} className="py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="font-medium">{e.role} — {e.company}</div>
                  <div className="text-xs opacity-70">{e.period}</div>
                </div>
                {e.desc && <p className="text-sm opacity-80 mt-1">{e.desc}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Education / Skills / Tools ── */}
      {(education.length > 0 || skills.length > 0 || tools.length > 0) && (
        <section className={`${container} pb-10 grid md:grid-cols-3 gap-6`}>
          {education.length > 0 && (
            <div>
              <div className={titleStyle}>Education</div>
              <ul className="mt-3 space-y-2 text-sm">
                {education.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}
          {skills.length > 0 && (
            <div>
              <div className={titleStyle}>Skills &amp; Focus</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((s) => <span key={s} className={tagStyle}>{s}</span>)}
              </div>
            </div>
          )}
          {tools.length > 0 && (
            <div>
              <div className={titleStyle}>Tools</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {tools.map((t) => <span key={t} className={tagStyle}>{t}</span>)}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Numbers ── */}
      {stats.length > 0 && (
        <section>
          <div className={`${container} py-16`}>
            <SectionTitle>By the numbers</SectionTitle>
            <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((s, i) => (
                <div key={i} className="select-none">
                  <div className={bigNumber}>
                    <CountUp value={s.v} suffix={s.suffix} />
                  </div>
                  <div className="mt-3 text-lg font-semibold">{s.k}</div>
                  {s.sub && <div className="text-sm opacity-70">{s.sub}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
