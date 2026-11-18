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
  ["Meeting notes", "Murmur sits in on your Zoom, Teams or Meet call. It writes down what’s said and keeps notes as it goes: what was decided, who does what, and the details. When someone asks you something, an answer you can read out appears beside the call while it’s being written."],
  ["Hidden from screen sharing", "The meeting panel never shows in a shared screen or a recording, and nor do Murmur’s other windows unless you choose otherwise."],
  ["Answers you can say", "The main point first, then the details, an example, and working code when code was asked for. Ask for a recap, follow-up questions or what to say next, or about what’s on the shared screen."],
  ["Notes that are kept", "When the call ends, the notes and the transcript are saved to Documents, ready to search under Meetings, with a follow-up email drafted if you want one."],
  ["Sarvam for Indian languages", "Add a Sarvam key to dictate in Hindi, English and 20 more Indian languages, mixed as you speak. Use Sarvam for commands and meetings too."],
  ["Commands that learn", "When a command goes wrong, or you correct it, Murmur works out why and writes a rule for next time. It keeps the rules that help and turns off the ones that don’t."],
];

// The lead card's picture of 1.8: a question from the call and the answer Murmur drafts, as the panel shows them.
// Made-up people.
export const leadThreads = [
  ["Priya", "How would you rate-limit our public API?", "Asked"],
  ["Murmur", "A token bucket per API key, kept in Redis.", "Your answer"],
  ["Notes", "Decision: limits per plan, launch Friday", "Saved"],
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
  ["Meeting notes and live answers", true, true],
  ["Hidden from screen sharing", true, true],
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
  ["What is Murmur?", "Murmur is a free, open-source voice assistant for Mac and Windows. Hold a key and talk, and it types what you say in any app. It also answers questions about your screen, finds your files by what’s in them, carries out whole jobs across your apps and, on a Mac, remembers your work. Its speech models run on your own computer."],
  ["Is Murmur a free alternative to Wispr Flow?", "Yes. Like Wispr Flow, you hold a key, talk, and it’s typed in any app. Murmur is free with no word limit, its source is open, and your speech is turned into text on your own computer rather than in the cloud. Murmur has no phone app."],
  ["Does Murmur take meeting notes?", "Yes, on Mac and Windows. Murmur listens to your Zoom, Teams or Meet call and your microphone, writes down what’s said, and keeps notes: decisions, who does what, and the details. No bot joins the call. The notes and transcript are saved to your Documents folder when the call ends."],
  ["Can other people see Murmur when I share my screen?", "No. Murmur’s meeting panel is left out of shared screens and recordings, and its other windows are too unless you turn that off. Tell the people you meet that you’re taking notes; in many places the law asks you to."],
  ["Is Murmur a free alternative to Cluely?", "Yes. Like Cluely, Murmur drafts answers during a call and takes the notes, in a panel that’s hidden from screen sharing. Murmur is free, open source, and works on Windows as well as the Mac. You choose the AI: your own Claude, OpenAI or Sarvam key, or a model on your computer."],
  ["Does Murmur listen all the time?", "No. Only while you hold the key, or after you double-tap it for hands-free, until you tap again. Esc cancels. Meeting notes listen from when you start them until the call ends."],
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

export const links = [["#write", "Write"], ["#ask", "Ask and do"], ["#meetings", "Meetings"], ["#memory", "Memory"], ["#free", "Free"], ["#privacy", "Privacy"], ["#questions", "Questions"]];

// The top of the page: one sentence, said five ways. Each is a tab on the demo beside the headline, and the
// headline's last word. Made-up people.
export const heroModes = [
  { id: "type", tab: "Write", word: "typed.", label: "You say", said: "Running ten minutes late, start without me.", pill: "Typed into Slack" },
  { id: "ask", tab: "Ask", word: "answered.", label: "You say", said: "What does this email want from me, and by when?", pill: "Read from your screen" },
  { id: "do", tab: "Do", word: "done.", label: "You say", said: "Send my resume to Arjun on WhatsApp.", pill: "Sent to Arjun on WhatsApp", hold: 6400 },
  { id: "meet", tab: "Meet", word: "noted.", label: "On your call, Priya asks", said: "How would you rate-limit the public API?", pill: "Only you can see this" },
  { id: "recall", tab: "Remember", word: "remembered.", label: "You say", said: "When’s my flight?", pill: "From your booking email" },
];

// Under the headline: the four things to know before anything else.
export const proof = [
  ["Free, for good", "No subscription, no account and no word limit. The code is open under the MIT licence."],
  ["Private by default", "Your speech becomes text on your own computer. Nothing is uploaded unless you choose a cloud model."],
  ["Wherever you type", "Mail, Slack, Docs, your code editor, any browser. On a Mac and on Windows."],
  ["In your language", "English, Hinglish and 25 European languages. Hindi and 20 more Indian languages with Sarvam."],
];

// Write: what makes dictation good, beside the scene.
export const writePoints = [
  ["The ums go, your corrections stick", "Turn on AI cleanup and “let’s meet at 5, no, 6” is typed as “Let’s meet at 6”. It’s off until you want it."],
  ["It fits the sentence", "Dictate into the middle of a line and the space, the capital and the full stop come out right. Your words never change."],
  ["Hands-free when you need it", "Double-tap the key and talk for as long as you like. Tap again to finish."],
];

// Ask and do: three things the same key does, each with its scene.
export const ways = [
  { id: "read", title: "Ask about what’s in front of you", said: "Summarise pages one to twenty-two.",
    text: "Murmur reads the page, the email or the PDF on your screen, all the way to the end, and answers beside your work. Select some text and say “make this shorter” to rewrite it in place." },
  { id: "task", title: "Hand it a whole job", said: "Send my resume to Arjun on WhatsApp.",
    text: "It writes itself a task list and works through it in your apps and your own browser. When it needs you, it asks, and you answer out loud. Esc stops it at any step." },
  { id: "find", title: "Find a file by describing it", said: "My cat on the blue sofa.",
    text: "It searches inside your PDFs, documents, audio and video, and what your photos show, in the folders you choose. It reads the words in images too: receipts, screenshots, signs." },
];

// What the same things cost elsewhere, each from its own site (guides.js has the full comparisons, dated).
export const receipt = [
  ["Voice typing", "Wispr Flow Pro", 15, "/wispr-flow-alternative/"],
  ["Meeting notes", "Otter Pro", 16.99, "/otter-alternative/"],
  ["Answers on a call", "Cluely Pro", 19.99, "/cluely-alternative/"],
];

export const freeReasons = [
  ["Free means free", "No trial that runs out, no tiers, no word limit and no account to make. Murmur is open source under the MIT licence."],
  ["Your AI, or none", "Murmur’s own models run on your computer and cost nothing. Add your own Claude, OpenAI or Sarvam key when you want a bigger one, and pay only that provider."],
  ["Nothing to take on trust", "Every line is on GitHub. The Mac app is signed and notarized by Apple, and each release lists the SHA-256 of its download."],
];

// Privacy, as a ledger: what stays, and what leaves only when you say so.
export const privacyLedger = [
  ["Stays on your computer", [
    "Your voice, and the text it becomes",
    "Your files, and the index of what’s in them",
    "Everything Murmur remembers",
    "What it reads from your screen, and every command and cleanup, unless you choose a cloud AI",
  ]],
  ["Leaves only if you choose", [
    "With your own Claude, OpenAI or Sarvam key: the command and what Murmur reads to carry it out, the dictation it tidies, or what was said in a meeting",
    "Your audio, only if you pick Sarvam’s or OpenAI’s speech model",
    "What Murmur saw while you worked, only if you turn on reading with Claude or OpenAI",
    "Never banking, health, ID or password pages",
  ]],
];

// How it works, in the order it happens.
export const flow = [
  ["You hold the key and talk", "fn on a Mac, Ctrl and the Windows key on a PC. The capsule at the bottom of the screen shows it’s listening."],
  ["Your speech becomes text, on your computer", "Parakeet for English and Europe’s languages, Oriserve’s Apex for Hinglish. The audio is held in memory only while it’s transcribed."],
  ["Murmur decides what you meant", "Writing is typed straight away. Clear commands like “open Slack” or “volume 30” run at once, with no model at all."],
  ["Anything bigger is planned", "Murmur Agent, or your own Claude or OpenAI key, works out the steps and does them. It asks before it sends, deletes or runs anything."],
];

// Meetings, the 1.8 headline: a call played beat by beat on the laptop (Meetings.jsx). Made-up people. Each beat:
// who's speaking and their caption, and what Murmur's panel shows then.
export const meetingBeats = [
  { label: "It listens", clock: "12:04", speaker: "Arjun", tab: "live",
    caption: "So the release moves to Friday. QA found two blockers in checkout.",
    noted: "Noted: release moves to Friday",
    summary: "Both sides of the call are written down as they’re said, and what matters goes into the notes." },
  { label: "A question for you", clock: "12:31", speaker: "Priya", tab: "live", drafting: true,
    question: "How would you rate-limit the public API?",
    caption: "Before we go on: how would you rate-limit the public API?",
    summary: "Murmur hears that Priya asked you something, waits until she’s finished asking, and starts on an answer." },
  { label: "The answer, as it’s written", clock: "12:34", speaker: "You", tab: "live",
    question: "How would you rate-limit the public API?",
    answer: {
      headline: "I’d use a token bucket per API key, kept in Redis.",
      points: [
        "Each key gets a bucket that refills at a fixed rate, say 100 requests a minute.",
        "With no tokens left we return 429 with a Retry-After header.",
        "Redis keeps the counts shared across servers, updated in one atomic step.",
      ],
      also: "Ask what their peak traffic looks like.",
    },
    caption: "I’d use a token bucket per API key, kept in Redis. Each key gets a bucket…",
    summary: "The main point first, in a sentence you can say, then the details in the order you’d say them. You read it in your own voice." },
  { label: "About the shared screen", clock: "19:47", speaker: "Neha", tab: "live", screen: true,
    question: "What happened in week four on this chart?",
    answer: {
      headline: "Checkout conversion fell to 2.1% in week four, from about 3.4%.",
      points: [
        "It’s the only week under 3%, and it lines up with the payment-page release.",
        "Weeks five and six recover, so it looks like a bug that was fixed, not a trend.",
      ],
    },
    caption: "Can someone tell me what happened in week four on this chart?",
    summary: "Murmur looks at the meeting’s window, the slide or chart being shared, and answers from what’s on it." },
  { label: "Notes, kept", clock: "31:10", speaker: "Arjun", tab: "notes",
    caption: "Great, thanks everyone. Talk Friday.",
    notes: { title: "Weekly product sync", sections: [
      ["Decisions", ["Release moves to Friday (two QA blockers)", "Rate limits: token bucket per API key"]],
      ["Action items", ["You: share the rate-limit design by Monday", "Neha: retest checkout on Thursday"]],
    ] },
    summary: "When the call ends, the notes and the full transcript are saved, with a follow-up email drafted if you want one." },
];

export const meetingHidden = [
  ["On your own screen", "Visible", "—"],
  ["A screen you share in Zoom, Teams or Meet", "Visible", "Hidden"],
  ["A recording of the call", "Visible", "Hidden"],
  ["The list of people in the call", "No bot joins", "No bot joins"],
];

export const meetingApps = ["Zoom", "Microsoft Teams", "Google Meet", "Slack huddles", "Webex", "Discord", "WhatsApp calls"];

// The other meeting assistants, each with its guide (guides.js has the comparisons, dated).
export const meetingCompared = [
  ["Cluely", "/cluely-alternative/"], ["Granola", "/granola-alternative/"], ["Otter", "/otter-alternative/"],
  ["Fireflies", "/fireflies-alternative/"], ["Fathom", "/fathom-alternative/"], ["Final Round AI", "/final-round-ai-alternative/"],
];
