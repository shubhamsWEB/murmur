// The page's words, kept apart from its layout. Every example uses made-up names.

export const heroPhrases = [
  { said: "it types for you", result: "Typed into Slack" },
  { said: "it reads for you", result: "Summarised 9 unread emails" },
  { said: "pdf kholo", result: "Opened Lease 2025.pdf" },
  { said: "it does the job", result: "Sent on WhatsApp to Arjun" },
  { said: "stays on device", result: "Done, nothing sent anywhere" },
];

export const modes = [
  ["Type", "Running ten minutes late, start without me.", "Typed where your cursor is, in any app you can type in."],
  ["Ask", "What does this email want from me, and by when?", "Murmur reads what’s on screen and answers in a panel beside your work."],
  ["Do", "Send my resume to Arjun on WhatsApp.", "It finds the file, opens the chat, shows you the message and sends it once you say yes."],
  ["Find", "The clause about pets in the lease.", "It searches inside your documents and photos and opens the best match."],
];

export const whatsNew = [
  ["Murmur’s own models", "Murmur Agent and Murmur Cleanup are trained for Murmur and run on your Mac through Ollama. A command step takes a couple of seconds, where a general model took half a minute, and it picks the right tool more often."],
  ["Stop any command", "Press Esc, or choose Stop Command in the menu bar. A new command stops the one before it, so two never run at once."],
  ["Answer its questions", "When Murmur asks “Which resume do you mean?”, say “the latest one” and the same task carries on."],
  ["Messages by name", "WhatsApp, Telegram, Signal, Discord and Teams chats open by the person’s name, even if they have no number in Contacts."],
  ["Quicker screen vision", "macOS reads the text on screen, and the vision model only looks at what the picture shows. Looking at an app takes seconds, not a minute."],
];

export const dictation = [
  ["Fits the sentence", "Dictate into the middle of a line and Murmur adds the space and leaves out the capital and the full stop. Your words never change."],
  ["Hands-free", "Double-tap fn and talk for as long as you like. Tap again to finish, or press Esc to throw it away."],
  ["Quiet voice", "Lifts soft speech, for open offices and late nights."],
  ["Your microphone", "Choose which one Murmur listens with, and prefer the Mac’s own over AirPods so calls don’t drop to phone quality."],
  ["Exactly what you said", "With cleanup on, Paste Exactly What I Said in the menu bar puts the unedited words back."],
  ["The Murmur button", "A small pill you can drag anywhere on screen. Click to open Murmur, right-click to dictate."],
];

export const spoken = [
  ["kal meeting 5 baje rakhte hain", "Hinglish"],
  ["Running ten minutes late, start without me.", "English"],
  ["Je serai là dans dix minutes.", "Français"],
  ["mujhe PDF kholkar do", "Hinglish, as a command"],
  ["Ich schicke dir die Folien heute Abend.", "Deutsch"],
  ["¿Podemos moverlo al jueves?", "Español"],
  ["Posso chiamarti dopo pranzo?", "Italiano"],
  ["Wyślę ci plik za chwilę.", "Polski"],
];

export const jobs = [
  ["Open saleshq.ai and summarise what they do.", "Opens the site, reads it top to bottom, and tells you."],
  ["Find running shoes on Flipkart and open the cheapest.", "Searches the site, compares the results, opens the one."],
  ["Go through my unread emails and tell me what needs a reply.", "Opens each one, notes who wants what, and gives you the short list."],
  ["Build a React app with a login page.", "Starts Claude Code or Codex on it in a new project folder."],
];

export const chatApps = ["WhatsApp", "Telegram", "Signal", "Discord", "Microsoft Teams", "Messages", "Slack", "Mail"];

export const models = [
  ["Dictation in English", "NVIDIA Parakeet", "Runs on the Neural Engine. Your audio is held in memory only while it’s transcribed."],
  ["Dictation in Hinglish", "Oriserve Whisper Hindi2Hinglish Apex", "Hindi and English, mixed as you speak, typed in English letters. About 1 GB."],
  ["25 European languages", "NVIDIA Parakeet Ultra", "From Bulgarian to Ukrainian. About 630 MB."],
  ["File search", "Google EmbeddingGemma", "Indexes only the folders you choose."],
  ["Commands", "Murmur Agent", "New. Qwen3.5 4B, trained on Murmur’s own tools. 2.8 GB, through Ollama."],
  ["AI cleanup", "Murmur Cleanup", "New. Qwen3.5 0.8B, trained to tidy dictation without rewording it. 0.5 GB."],
  ["Screen vision", "Qwen3-VL 4B Instruct", "Looks at what only a picture shows. 3.3 GB, through Ollama."],
];

export const learns = [
  ["Memory", "Tell it once: “Priya is my manager, on Slack”, “open links in Chrome”. It also notices who you message where. The Memory page lists everything it knows, each line with an × to forget it."],
  ["Skills", "Teach it how you like things done, in the same SKILL.md format Claude uses. It comes with skills for email, chats, research, shopping, forms and long tasks, and you can add any from a GitHub link."],
  ["Permissions", "Before it sends, deletes or runs a script, it asks: Allow, Allow for This Task, or Always Allow. Settings shows what’s always allowed and takes it back. Anything that pays always asks."],
];

// [feature, Mac, Windows]: true, false, or a short note.
export const parity = [
  ["Dictation in any app", true, true],
  ["English, Hinglish and 25 European languages", true, true],
  ["AI cleanup", true, true],
  ["Voice commands: apps, settings, media, volume", true, true],
  ["Rewrite, translate or summarise selected text", true, true],
  ["Search your files by what’s inside them", true, true],
  ["Photos by what they show", true, "Words in images"],
  ["Terminal commands", true, "PowerShell"],
  ["Read the screen, click and scroll for you", true, false],
  ["Send messages and files in your chats", true, false],
  ["Murmur’s own models", true, false],
  ["Updates itself", true, true],
];

export const steps = [
  ["Download Murmur and open it.", "It’s signed and notarized by Apple, and it moves itself to your Applications folder."],
  ["Choose how you speak.", "English, Hinglish or one of 25 European languages. Only that speech model downloads."],
  ["Allow the microphone and Accessibility.", "Accessibility is what lets Murmur type into other apps and press buttons for you."],
  ["Choose the folders Murmur may search.", "The first index takes a while. You can search while it runs."],
  ["Choose how commands are planned.", "Murmur Agent, free through Ollama, or your own Claude or OpenAI key. Dictation, search and quick commands need neither."],
];

export const questions = (macSize, windowsSize) => [
  ["Does Murmur listen all the time?", "No. Only while you hold the key, or after you double-tap it for hands-free, until you tap again. Esc cancels."],
  ["Does it change what I say?", "Not unless you ask it to. By default your words go in exactly as heard; Murmur only fits the spacing, the first letter and the final full stop to the sentence around your cursor. AI cleanup, which takes out the ums and applies your corrections, is off until you turn it on. If the model changes more than that, your words go in as heard."],
  ["How does it tell a command from dictation?", "Typing is the default. Clear commands like “open Slack” or “PDF kholo” run at once. To decide yourself, hold ⇧ with fn to only type, or ⌃ with fn to make it a command."],
  ["Can I stop a command halfway?", "Yes. Press Esc, or choose Stop Command in the menu bar, and it stops after the step it’s on. If it had a task list, say “continue” later to pick it up."],
  ["Do I need an AI subscription?", "No. Dictation, file search and quick commands like “open Slack” or “volume 30” need nothing. For the rest, use Murmur Agent, free through Ollama, or your own Claude or OpenAI key, which handles the longest tasks best."],
  ["What are Murmur Agent and Murmur Cleanup?", "Two small models trained for Murmur: one plans commands with Murmur’s tools, one tidies dictation. Murmur downloads them through Ollama when you pick them in Settings, and they run on your Mac. If you already use another local model, it stays until you switch."],
  ["Is it really free?", "Yes, and open source under the MIT licence. There’s no account and nothing to pay for."],
  ["What does it need?", `A Mac with Apple silicon on macOS 14 or later, or 64-bit Windows 10 or 11. The app is ${macSize ? `a ${macSize}` : "a small"} download on a Mac${windowsSize ? ` and ${windowsSize} on Windows` : ""}; the speech and search models download when you choose them.`],
  ["Why does Windows warn about the installer?", "The Windows installer isn’t code-signed yet. If Chrome blocks the download, choose Keep in its downloads. If SmartScreen says it protected your PC, click More info, then Run anyway. The Mac app is signed by Apple and opens without a warning."],
];

export const links = [["#how", "How it works"], ["#features", "Features"], ["#languages", "Languages"], ["#models", "Models"], ["#privacy", "Privacy"], ["#windows", "Windows"], ["#install", "Install"]];
