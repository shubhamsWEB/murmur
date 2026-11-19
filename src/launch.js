// The launch film (src/Film.jsx plays it): what it is and its chapters, for its own page (/film/), the home page and search engines. The
// chapters match public/media/film/chapters.vtt (the player's timeline); change both together.
export const film = {
  path: "/film/",
  title: "Murmur demo video: voice typing, meeting notes and an AI assistant",
  description: "Watch a day with Murmur in 70 seconds: voice typing in any app, cleanup in Hindi-English, a long report read for you, whole jobs, meeting notes hidden from screen sharing, and memory.",
  name: "A day with Murmur: hold a key and say it",
  duration: 70,
  uploaded: "2026-11-19T12:00:00+05:30",
  youtube: null,
  label: "A day with Murmur: hold a key and speak, and it types into Slack; it tidies your ums in English and Hinglish, reads a 400-page report, sends a resume after asking, takes meeting notes and drafts your answer without showing in the screen share, remembers your day, and costs nothing.",
};

// [start, end, title, what it shows], in seconds.
export const chapters = [
  [0, 7.7, "Hold a key, say it", "You think faster than you type: one key starts Murmur."],
  [7.7, 14, "Types in any app", "A message said aloud and typed into Slack, wherever the cursor is."],
  [14, 21.3, "Cleanup and languages", "The ums and corrections taken out, in English, Hinglish and 25 more languages."],
  [21.3, 27.9, "Reads it for you", "A 400-page report turned into three lines."],
  [27.9, 35.9, "Whole jobs", "A resume found, attached and sent, after asking first."],
  [35.9, 44.4, "Meeting notes", "Notes taken on a call, and an answer drafted when you're asked."],
  [44.4, 48.2, "Hidden from screen share", "The meeting panel left out of the share and the recording."],
  [48.2, 53.8, "It remembers your day", "On a Mac: the day kept, and your flight time when you ask."],
  [53.8, 70, "Free and open source", "Three subscriptions elsewhere, nothing here, and it runs on your computer."],
];

const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen"];
// The length, three ways: "1:10", "1 minute 10 seconds", and the chapter count in words.
export const length = {
  clock: `${Math.floor(film.duration / 60)}:${String(film.duration % 60).padStart(2, "0")}`,
  spoken: `${Math.floor(film.duration / 60)} minute${Math.floor(film.duration / 60) === 1 ? "" : "s"}${film.duration % 60 ? ` ${film.duration % 60} seconds` : ""}`,
  chapters: words[chapters.length] || String(chapters.length),
  iso: `PT${Math.floor(film.duration / 60) ? `${Math.floor(film.duration / 60)}M` : ""}${film.duration % 60 ? `${film.duration % 60}S` : ""}`,
};

export const clock = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
