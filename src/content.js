// The page's words, kept apart from its layout. Every example uses made-up names.

export const heroPhrases = [
  { said: "it types for you", result: "Typed into Slack" },
  { said: "it reads for you", result: "Summarised 9 unread emails" },
  { said: "pdf kholo", result: "Opened Lease 2025.pdf" },
  { said: "it does the job", result: "Sent on WhatsApp to Arjun" },
  { said: "it remembers", result: "Your flight is Sunday, 10:15" },
  { said: "stays on device", result: "Done, nothing sent anywhere" },
];

export const modes = [
  ["Type", "Running ten minutes late, start without me.", "Typed where your cursor is, in any app you can type in."],
  ["Ask", "What does this email want from me, and by when?", "Murmur reads what’s on screen and answers in a panel beside your work."],
  ["Do", "Send my resume to Arjun on WhatsApp.", "It finds the file, opens the chat, shows you the message and sends it once you say yes."],
  ["Find", "The clause about pets in the lease.", "It searches inside your documents and photos and opens the best match."],
];

export const whatsNew = [
  ["Memory that keeps the details", "Murmur follows your conversations as threads: who you wrote to, what about, and whose turn it is. An email you send is remembered with who it went to and what you said."],
  ["Who’s waiting on you", "The morning brief lists the replies you owe, the people to follow up with, and where you left off. A thread with no answer after four days becomes a follow-up."],
  ["Reads as you work", "Murmur groups what it sees into pieces of work (a project, a release, a booking) and reads each one while you carry on, a little at a time when the Mac is plugged in and quiet."],
  ["Answers straight away", "“Has Arjun replied?”, “When’s my flight?” and “What’s on my plate today?” are answered from memory at once, without waiting for a model."],
  ["Claude or OpenAI, if you choose", "Turn on Read with Claude or OpenAI for sharper memories, with your own key. Banking, health, ID and password pages are always read on your Mac, and addresses and numbers are taken out first."],
  ["On Windows: the key from the start", "The dictation key now works the moment Murmur opens, with no restart, and with keys sent by remote desktops and virtual machines."],
];

// The memory section: one memory for the whole Mac, how it's made, what it answers, and the AI tools that use it.
export const memorySources = ["Contacts", "Calendar", "Reminders", "Notes", "Mail", "The windows you work in", "Linear", "Notion", "Jira and Confluence"];

// How the memory is made: a sequence, so it's numbered on the page.
export const memorySteps = [
  ["It learns", "From the apps you turn on, and, if you let it, from the windows you work in: the Slack thread, the email, the doc, the booking page. Nothing to type in."],
  ["It keeps what’s yours", "Your conversations and your work become memories, promises and plans. Feeds, adverts and strangers’ posts are only seen, never kept as facts about you."],
  ["It stays current", "A new fact replaces the old one (a new job, a new number). A status or a one-off fades within days; a flight stays until it’s flown. A promise closes itself when Murmur sees it done."],
  ["Everything can use it", "Every Murmur command, and any AI tool on your Mac that can connect to it: Claude Code, Claude Desktop, Cursor and others."],
];

// What you say, and what memory lets Murmur do with it. All made-up people.
export const memoryExamples = [
  ["Message Priya I’m running late.", "Goes to Priya Shah on Slack, because that’s where you two talk. Not to the other Priya in your Contacts."],
  ["When’s my flight?", "Sunday at 10:15 from Bengaluru, Terminal 1. Check-in closes at 09:15. It read that from your booking, and reminds you the evening before."],
  ["What did I promise this week?", "The Q3 deck for Priya by Friday, Arjun’s pull request, and a call back to the accountant. Each one from where you said it."],
  ["Has Arjun replied?", "Not yet. You emailed him on Tuesday about the launch date, so it’s been three days. Murmur will suggest a follow-up tomorrow."],
  ["What did I do yesterday?", "Three hours on the payments release in Xcode, a call with Arjun about the launch, and the new pricing page in Figma."],
];

// What other AI tools can ask (MemoryServer's tools, in plain words).
export const memoryTools = [
  ["Who and what", "people, their work and how to reach them, projects, facts and preferences, each with where it came from"],
  ["Promises", "what you said you’d do and what you’re waiting on, soonest due first"],
  ["What you did", "a summary of any hour, day, month or year"],
  ["Where your time went", "apps and sites, between any two days"],
  ["What you saw", "pages, documents, chats and email you had open"],
  ["What’s coming up", "events, plans and things to do"],
];

export const memoryTrust = [
  ["On your Mac", "The memory is one file on your Mac, read by Murmur’s own model unless you choose Claude or OpenAI with your own key. No account, no server."],
  ["Never read", "Password managers, private windows and password fields, and any app or site you add to Never read."],
  ["No pictures kept", "When a window has little text, Murmur looks at a small picture of it, then deletes the picture."],
  ["Yours to edit", "Every line on the Memory page has an × to forget it. Forget a person, everything from your screen, or all of it."],
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
  ["File search and memory", "Google EmbeddingGemma", "Finds files, and memories, by what they mean. Indexes only the folders you choose."],
  ["Memory", "Qwen3 4B, built in", "Turns what you work on into memories, threads and plans. 2.5 GB, run by Murmur itself, no Ollama. Or your own Claude or OpenAI key, if you choose."],
  ["Commands", "Murmur Agent", "Qwen3.5 4B, trained on Murmur’s own tools. 2.8 GB, through Ollama."],
  ["AI cleanup", "Murmur Cleanup", "Qwen3.5 0.8B, trained to tidy dictation without rewording it. 0.5 GB."],
  ["Screen vision", "Qwen3-VL 4B Instruct", "Looks at what only a picture shows. 3.3 GB, through Ollama."],
];

export const learns = [
  ["Memory", "Tell it once: “Priya is my manager, on Slack”, “open links in Chrome”, and it remembers for good. Everything else it learns fades unless it comes up again. The Memory page lists it all, each line with an × to forget it."],
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
  ["Memory: people, promises, plans", true, false],
  ["Send messages and files in your chats", true, false],
  ["Murmur’s own models", true, "Murmur Cleanup"],
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
  ["Does Murmur record my screen?", "No video, ever, and only if you turn on Remember what I work on. Then Murmur reads the text of the window you’re working in when it changes, and takes a small picture only when a window has little text. Pictures are deleted once they’re read. It never reads password managers, private windows or password fields, and you can add any app or site to Never read."],
  ["What does Murmur remember, and can I make it forget?", "People, organisations, projects, conversations and whose turn it is to reply, what’s coming up, and what you promised or are owed, each with where it came from. Things fade unless they come up again. Forget one line, a person, everything from your screen, or all of it, from the Memory page. Memory is on the Mac for now."],
  ["Does memory send anything to the cloud?", "Not unless you turn on Read with Claude or OpenAI on the Memory page, with your own key. Then what Murmur saw while you worked goes to that provider to be read, after email addresses, phone and account numbers and booking references are taken out. Banking, payments, investing, tax, ID, health, insurance and password pages are never sent, and are read on your Mac instead."],
  ["Can my other AI tools use Murmur’s memory?", "Yes, any that connect to tools over MCP: Claude Code, Claude Desktop, Cursor and others. On the Memory page, Use your memory in Claude Code copies the one command that adds it. They can read it, never change it, and what they read goes to the model they use."],
  ["Does it change what I say?", "Not unless you ask it to. By default your words go in exactly as heard; Murmur only fits the spacing, the first letter and the final full stop to the sentence around your cursor. AI cleanup, which takes out the ums and applies your corrections, is off until you turn it on. If the model changes more than that, your words go in as heard."],
  ["How does it tell a command from dictation?", "Typing is the default. Clear commands like “open Slack” or “PDF kholo” run at once. To decide yourself, hold ⇧ with fn to only type, or ⌃ with fn to make it a command."],
  ["Can I stop a command halfway?", "Yes. Press Esc, or choose Stop Command in the menu bar, and it stops after the step it’s on. If it had a task list, say “continue” later to pick it up."],
  ["Do I need an AI subscription?", "No. Dictation, file search and quick commands like “open Slack” or “volume 30” need nothing. For the rest, use Murmur Agent, free through Ollama, or your own Claude or OpenAI key, which handles the longest tasks best."],
  ["What are Murmur Agent and Murmur Cleanup?", "Two small models trained for Murmur: one plans commands with Murmur’s tools, one tidies dictation. Murmur downloads them through Ollama when you pick them in Settings, and they run on your Mac. If you already use another local model, it stays until you switch."],
  ["Is it really free?", "Yes, and open source under the MIT licence. There’s no account and nothing to pay for."],
  ["What does it need?", `A Mac with Apple silicon on macOS 14 or later, or 64-bit Windows 10 or 11. The app is ${macSize ? `a ${macSize}` : "a small"} download on a Mac${windowsSize ? ` and ${windowsSize} on Windows` : ""}; the speech and search models download when you choose them.`],
  ["Why does Windows warn about the installer?", "The Windows installer isn’t code-signed yet. If Chrome blocks the download, choose Keep in its downloads. If SmartScreen says it protected your PC, click More info, then Run anyway. The Mac app is signed by Apple and opens without a warning."],
];

export const links = [["#how", "How it works"], ["#memory", "Memory"], ["#features", "Features"], ["#languages", "Languages"], ["#models", "Models"], ["#privacy", "Privacy"], ["#windows", "Windows"], ["#install", "Install"]];
