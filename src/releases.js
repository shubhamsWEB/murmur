import { useEffect, useState } from "react";
import { releaseList } from "./release";

// The release the "New in" cards describe: its line ("1.7"), so a patch (1.7.1) doesn't make them say something
// else. Change it with the cards.
export const featured = "1.7";

// The latest releases, newest first, for the "Recent releases" list: one line each, written for the site. A release
// published since then shows up on its own (useRecentReleases reads GitHub when the page opens, and sums a missing one
// up from its notes); a line here only words it better. The full notes live on GitHub
// (scripts/release-notes/<version>.md in the app repo).
export const recentReleases = [
  ["1.7.3", "11 Nov 2026", "Your day: clicking the morning brief or evening wrap-up opens everything behind it, from what needs you to what you worked on, session by session."],
  ["1.7.2", "10 Nov 2026", "Commands finish the job on screen instead of stopping halfway, and type where pasting doesn’t. Dictation catches your first word, changes your voice less, and spells names right."],
  ["1.7.1", "7 Nov 2026", "Questions about your own work are answered from memory, not the web: what you released, posted and sent, and to whom. One memory, searched as one, and names heard the way you say them."],
  ["1.7.0", "7 Nov 2026", "Memory keeps the details: who you wrote to, whose turn it is to reply, and when to follow up. It reads as you work, and can use Claude or OpenAI if you choose. On Windows, the dictation key works from the start."],
  ["1.6.0", "6 Nov 2026", "Memory: Murmur remembers who’s who, what’s coming up and what you promised, from your apps and what you work on. Morning brief and evening wrap-up, and Linear, Notion and Jira by voice."],
  ["1.5.1", "4 Nov 2026", "On Windows: Murmur Cleanup, stopping a command with Esc, and answering Murmur’s questions mid-task."],
  ["1.5.0", "2 Nov 2026", "Murmur’s own models for commands and cleanup. Stop a command with Esc, answer its questions mid-task, message anyone in your chats by name, and quicker screen vision."],
  ["1.4.3", "29 Oct 2026", "Murmur moves itself to Applications when you open it from the disk image."],
  ["1.4.2", "29 Oct 2026", "Summarise any open document, or a range of its pages, read straight from the file."],
  ["1.4.1", "29 Oct 2026", "Signed and notarized by Apple. Updates in one click. Find photos by what’s in them. Screen vision on your Mac."],
  ["1.4.0", "22 Oct 2026", "Murmur for Windows: dictation, AI cleanup, voice commands and file search."],
  ["1.3.0", "20 Oct 2026", "AI cleanup, a microphone picker, the Murmur button on screen, and answers with tables and checklists."],
];

const written = new Map(recentReleases.map(([version, date, text]) => [version, { date, text }]));

// "7 Nov 2026", as the lines above are dated (in India's time, where the releases are made).
const dated = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

// A release's notes in a line: the bold lead of its first few points ("**Memory that keeps the details.** …").
export function summary(notes) {
  // (Not a one-word label such as "**Mac**".)
  const leads = [...String(notes || "").matchAll(/^\s*\*\*(.+?)\*\*/gm)].map((m) => m[1].trim().replace(/[.:]$/, ""))
    .filter((lead) => lead.split(/\s+/).length > 1);
  if (leads.length) return leads.slice(0, 3).join(". ") + ".";
  const text = String(notes || "").replace(/^#.*$/gm, "").replace(/[*_`]/g, "").trim();
  return text.split(/(?<=[.!?])\s/)[0] || "";
}

// The releases as GitHub has them (published, not pre-releases), newest first, worded as above where they're listed.
// Until GitHub answers (or when it can't), the list above.
export function useRecentReleases() {
  const [releases, setReleases] = useState(recentReleases);
  useEffect(() => {
    let cancelled = false;
    releaseList().then((data) => {
      if (cancelled || !Array.isArray(data)) return;
      const published = data
        .filter((r) => !r.draft && !r.prerelease && /^v\d/.test(String(r.tag_name)))
        .map((r) => {
          const version = String(r.tag_name).slice(1);
          const listed = written.get(version);
          return [version, listed?.date ?? dated(r.published_at), listed?.text ?? summary(r.body)];
        });
      if (published.length) setReleases(published.slice(0, recentReleases.length));
    });
    return () => { cancelled = true; };
  }, []);
  return releases;
}
