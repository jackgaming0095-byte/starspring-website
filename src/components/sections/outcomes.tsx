import { CalendarCheck, MousePointerClick, PhoneCall, Star } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { IllustrativeBadge } from "@/components/visuals/illustrative-badge";
import { MapGrid } from "@/components/visuals/map-grid";
import { outcomes } from "@/lib/content";

/* One-use micro-visuals for the outcome cells. */

function ReviewStack() {
  const cards = [
    { name: "Aisha K.", text: "Turned up when they said they would." },
    { name: "Rob McE.", text: "Third time using them. No complaints." },
    { name: "Lena V.", text: "Fixed it same day, priced it fairly." },
  ];
  return (
    <div className="relative mt-6">
      {cards.map((card, index) => (
        <div
          key={card.name}
          className="
            rounded-md border border-line bg-surface p-3
            [&:not(:first-child)]:-mt-2
          "
          style={{
            marginLeft: `${index * 10}px`,
            opacity: 1 - index * 0.12,
            position: "relative",
            zIndex: cards.length - index,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="flex gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Star key={starIndex} className="size-2.5 text-accent" fill="currentColor" strokeWidth={0} />
              ))}
            </span>
            <span className="text-[0.6875rem] font-medium text-ink">{card.name}</span>
          </div>
          <p className="mt-1 truncate text-[0.6875rem] text-ink-subtle">{card.text}</p>
        </div>
      ))}
    </div>
  );
}

function RatingMove() {
  return (
    <div className="mt-6 rounded-md border border-line bg-surface p-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="numeric text-xs text-ink-subtle">Before</p>
          <p className="numeric mt-1 text-2xl font-semibold text-ink-muted">4.1</p>
        </div>
        <div className="mb-2 flex-1">
          <div className="h-px w-full bg-line-strong">
            <div className="h-px w-3/4 bg-accent" />
          </div>
        </div>
        <div className="text-right">
          <p className="numeric text-xs text-accent">After</p>
          <p className="numeric mt-1 text-2xl font-semibold text-ink">4.6</p>
        </div>
      </div>
      <p className="mt-3 border-t border-line pt-3 text-[0.6875rem] text-ink-subtle">
        Illustrative movement over six months.
      </p>
    </div>
  );
}

function ActionCounts() {
  const rows = [
    { icon: PhoneCall, label: "Calls from your profile" },
    { icon: CalendarCheck, label: "Booking and direction taps" },
    { icon: MousePointerClick, label: "Website clicks and messages" },
  ];
  return (
    <div className="mt-6 flex flex-col gap-2.5">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center gap-3 rounded-md border border-line bg-surface px-3.5 py-3"
        >
          <row.icon className="size-4 shrink-0 text-accent" aria-hidden="true" />
          <span className="text-xs text-ink-muted">{row.label}</span>
        </div>
      ))}
      <p className="text-[0.6875rem] leading-relaxed text-ink-subtle">
        Reported where your profile and booking tools make them trackable.
      </p>
    </div>
  );
}

const CELLS = [
  { span: "lg:col-span-7", visual: <ReviewStack /> },
  { span: "lg:col-span-5", visual: <RatingMove /> },
  { span: "lg:col-span-5", visual: <MapGrid className="mt-6" /> },
  { span: "lg:col-span-7", visual: <ActionCounts /> },
];

export function Outcomes() {
  return (
    <Section id="outcomes">
      <div className="shell">
        <SectionHeading
          title="A stronger reputation at every point of decision."
          lead="These are the outcomes the work is aimed at. How far and how fast each one moves depends on your customer volume, your location and the service you actually deliver."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {outcomes.map((outcome, index) => (
            <Reveal
              key={outcome.title}
              delay={index * 0.06}
              className={`${CELLS[index].span} flex flex-col rounded-lg border border-line bg-bg-raised p-6`}
            >
              <h3 className="text-xl font-semibold text-ink">{outcome.title}</h3>
              <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-ink-muted">
                {outcome.body}
              </p>
              {CELLS[index].visual}
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-6 flex items-center gap-3">
          <IllustrativeBadge />
          <p className="text-xs text-ink-subtle">
            Figures in these panels are examples, not client results.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
