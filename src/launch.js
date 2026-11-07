// The launch film (src/Film.jsx plays it): what it is and its chapters, for its own page (/film/), the home page and search engines. The
// chapters match public/media/film/chapters.vtt (the player's timeline); change both together.
export const film = {
  path: "/film/",
  title: "Murmur demo video: voice typing and an AI assistant at work",
  description: "Watch Murmur at work in 1 minute 28 seconds: voice typing in any app, cleanup, questions about your screen, whole jobs, file search and memory, on Mac and Windows.",
  name: "Murmur: hold a key and say it",
  duration: 88,
  uploaded: "2026-11-07T12:00:00+05:30",
  label: "Murmur's launch film: hold a key and speak; it types where your cursor is in many languages, reads and summarises a long document, opens apps, plans a whole job like sending your resume, finds a file you describe and learns from what you work on, and your voice never leaves your computer.",
};

// [start, end, title, what it shows], in seconds.
export const chapters = [
  [0, 5, "This is Murmur", "A voice assistant for your Mac and your PC: hold a key and say it."],
  [5, 13.4, "Types in any app", "Speech typed where the cursor is, in Mail, Slack and a code editor, in English, Hinglish and other languages."],
  [13.4, 20, "Cleanup", "The ums and false starts taken out, and a spoken correction applied."],
  [20, 29, "Ask about your screen", "A long document read to the end and summarised beside it."],
  [29, 34, "Rewrite with your voice", "Selected text made shorter, in place."],
  [34, 40.2, "Quick commands", "Apps opened and settings changed at once."],
  [40.2, 48, "Whole jobs", "A task list planned and worked through, such as finding a resume and sending it."],
  [48, 57, "Find any file", "A file found by describing what's in it."],
  [57, 63.4, "It remembers your work", "Who's who, what was promised and what's coming up."],
  [63.4, 68, "Your morning brief", "The day's threads and who's waiting on a reply."],
  [68, 73.8, "Your tools", "Claude Code asking Murmur's memory before it answers."],
  [73.8, 81.2, "Private by design", "Speech recognised on the computer; nothing uploaded."],
  [81.2, 88, "Free and open source", "No account, no subscription, MIT licence."],
];

export const clock = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
