import { MAPS_URL, WEDDING_DATE_ISO, WEDDING_END_ISO } from "@/content/copy";

/** 2026-12-13T16:00:00+07:00 → 20261213T090000Z */
function toIcsUtc(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function fold(line: string) {
  // RFC 5545 caps lines at 75 octets; continuation lines start with a space.
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = " " + rest.slice(74);
  }
  out.push(rest);
  return out.join("\r\n");
}

function escapeText(value: string) {
  return value.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
}

export function buildIcs({
  title,
  location,
}: {
  title: string;
  location: string;
}) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//nghiphong//wedding//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${WEDDING_DATE_ISO}-nghiphong@wedding`,
    `DTSTAMP:${toIcsUtc(new Date().toISOString())}`,
    `DTSTART:${toIcsUtc(WEDDING_DATE_ISO)}`,
    `DTEND:${toIcsUtc(WEDDING_END_ISO)}`,
    `SUMMARY:${escapeText(title)}`,
    `LOCATION:${escapeText(location)}`,
    `URL:${MAPS_URL}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n");
}

export function downloadIcs(opts: { title: string; location: string }) {
  const blob = new Blob([buildIcs(opts)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "nghi-phong-wedding.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
