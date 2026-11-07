// The guides: one page each for what people search for when they're looking for something like Murmur. Each is
// pre-rendered to its own address with its own title and description (scripts/prerender.mjs), listed in the sitemap,
// and linked from every page's footer. Facts about Murmur come from content.js; facts about other apps are dated.

// As checked on their own sites and pricing pages; say when, and check again before changing the numbers.
export const comparedOn = "November 2026";

export const guides = [
  {
    path: "/wispr-flow-alternative/",
    nav: "A free Wispr Flow alternative",
    title: "Murmur: a free, open-source Wispr Flow alternative",
    description: "Murmur is a free, open-source Wispr Flow alternative for Mac and Windows: dictation in any app with no word limit, its speech recognised on your computer.",
    kicker: "Free and open source, for Mac and Windows",
    h1: "A free, open-source alternative to",
    hi: "Wispr Flow",
    lede: "Murmur does what you’d use Wispr Flow for, hold a key, talk, and it’s typed where your cursor is, in any app, and it’s free with no word limit. Your speech is turned into text on your own computer, not in the cloud, and the source is open for anyone to read.",
    sections: [
      {
        h2: "What you get, free",
        points: [
          ["Dictation in any app", "Hold fn on a Mac, or Ctrl and the Windows key on a PC, and talk. It’s typed in Slack, Mail, Notes, a browser or a code editor, with no weekly word limit."],
          ["Your words, as you said them", "By default nothing is reworded. Turn on AI cleanup and the ums and false starts go, and “no, make that Friday” is applied for you."],
          ["English, Hinglish and 25 more languages", "Mix Hindi and English and it’s typed in English letters. Or speak English, or any of 25 European languages."],
          ["More than dictation", "Ask about what’s on your screen, find a file by what’s in it, or hand it a whole job across your apps. On a Mac it also remembers who’s who and what you promised."],
        ],
      },
      {
        h2: "Murmur and the others, side by side",
        table: {
          head: ["", "Price", "Source code", "Where your speech becomes text"],
          rows: [
            ["Murmur", "Free, no word limit", "Open source (MIT)", "On your computer"],
            ["Wispr Flow", "Free up to 2,000 words a week, Pro $15 a month", "Closed", "In the cloud"],
            ["Superwhisper", "Free with local models, Pro $8.49 a month or $249.99 once", "Closed", "On your computer, or cloud models on Pro"],
            ["Apple Dictation", "Free, built into macOS", "Closed", "On your Mac or Apple’s servers, depending on the language"],
          ],
          note: `Prices as listed on each app’s own site in ${comparedOn}. Check theirs for the latest.`,
        },
      },
      {
        h2: "Where Murmur is different",
        paragraphs: [
          "Nothing you say leaves your computer to be transcribed. English runs on NVIDIA’s Parakeet, on the Mac’s Neural Engine; Hinglish runs on Oriserve’s Whisper Hindi2Hinglish Apex. Each model downloads once, and after that Murmur works offline.",
          "There’s no account and nothing to pay for, and the whole app is open source under the MIT licence, so you can read every line, build it yourself, or send a fix.",
          "And it does more than type. “Open Slack”, “volume 30” and “PDF kholo” run at once. Bigger jobs, such as finding your resume and sending it to someone, are planned by Murmur Agent, a small model that runs on your Mac, or by your own Claude or OpenAI key if you prefer.",
        ],
      },
      {
        h2: "Where Wispr Flow may suit you better",
        paragraphs: [
          "Murmur has no phone app; it’s for your Mac and your PC. On a Mac it needs Apple silicon and macOS 14 or later. On Windows it does dictation, AI cleanup, voice commands and file search; reading your screen, sending messages and memory are on the Mac for now. If you dictate mostly on your phone, a service that syncs across devices may suit you better.",
        ],
      },
    ],
    faq: [
      ["Is Murmur really free?", "Yes. There’s no account, no subscription and no word limit, and it’s open source under the MIT licence."],
      ["Does Murmur need the internet?", "Only to download it and the models you choose. After that, dictation, cleanup, file search and quick commands work offline."],
      ["Can I use Murmur on Windows?", "Yes, on 64-bit Windows 10 and 11, with dictation, AI cleanup, voice commands and file search."],
      ["Does it type Hinglish?", "Yes. Mix Hindi and English as you speak and it’s typed in English letters."],
    ],
  },
  {
    path: "/voice-typing-mac/",
    nav: "Voice typing on Mac",
    title: "Voice typing on Mac: free dictation in any app | Murmur",
    description: "Free voice typing for Mac: hold fn, talk, and Murmur types in any app, in English, Hinglish or 25 more languages. It runs on your Mac, with no account.",
    kicker: "For Macs with Apple silicon, on macOS 14 or later",
    h1: "Voice typing on your Mac,",
    hi: "in any app",
    lede: "Hold fn, say what you want to write, and let go. Murmur types it where your cursor is: an email, a Slack message, a document, a search box, a line of code. It’s free, and the speech model runs on your Mac.",
    sections: [
      {
        h2: "How it works",
        steps: [
          ["Hold fn and talk.", "A small capsule at the bottom of the screen shows Murmur is listening. Double-tap fn to talk hands-free, and tap again to stop."],
          ["Let go.", "Your speech becomes text on the Neural Engine, with NVIDIA’s Parakeet for English. The audio is held in memory only while it’s transcribed."],
          ["It’s typed where your cursor is.", "Murmur fits the spacing, the capital letter and the full stop to the sentence around your cursor, so it reads as if you’d typed it."],
        ],
      },
      {
        h2: "More than the Mac’s own dictation",
        points: [
          ["AI cleanup, if you want it", "Off until you turn it on. Then the ums and false starts go, and corrections like “no, Thursday” are applied, without rewording what you said."],
          ["Hinglish, typed in English letters", "Speak the way you talk at work, Hindi and English mixed, and it’s typed as you said it."],
          ["Commands with the same key", "“Open Slack”, “volume 30”, “summarise this page”: clear commands run at once, and Murmur tells writing from asking on its own."],
          ["Rewrite what you’ve selected", "Select text and say “make this shorter” or “translate this to Hindi”."],
        ],
      },
      {
        h2: "Works where you write",
        paragraphs: [
          "Murmur types into any app that takes text, through the Mac’s Accessibility features: Mail, Messages, Slack, WhatsApp, Notion, Google Docs in a browser, Xcode, Visual Studio Code and Terminal. You allow Accessibility once, when you set it up.",
          "The Mac’s own dictation is fine for a quick sentence. Murmur adds cleanup, Hinglish, commands, file search and a memory of your work, and keeps all of it on your Mac.",
        ],
      },
      {
        h2: "Set up in five minutes",
        steps: [
          ["Download Murmur and open it.", "It’s signed and notarized by Apple, and it moves itself to your Applications folder."],
          ["Choose how you speak.", "English, Hinglish or one of 25 European languages. Only that model downloads."],
          ["Allow the microphone and Accessibility.", "Then hold fn and talk."],
        ],
      },
    ],
    faq: [
      ["Which Macs does Murmur work on?", "Macs with Apple silicon (M1 or later) on macOS 14 or later."],
      ["Does voice typing work offline?", "Yes. Once the speech model has downloaded, dictation works without the internet."],
      ["Does Murmur listen all the time?", "No. Only while you hold the key, or after you double-tap it for hands-free, until you tap again. Esc cancels."],
      ["Can I change the key?", "Yes. In Settings, the talk key can be fn, Right ⌥ or Right ⌘."],
    ],
  },
  {
    path: "/voice-typing-windows/",
    nav: "Voice typing on Windows",
    title: "Free voice typing for Windows 10 and 11 | Murmur",
    description: "Free, open-source voice typing for Windows 10 and 11: hold Ctrl and the Windows key, talk, and Murmur types in any app. Its speech models run on your PC.",
    kicker: "For 64-bit Windows 10 and 11",
    h1: "Voice typing for Windows,",
    hi: "free and private",
    lede: "Hold Ctrl and the Windows key, say what you want to write, and let go. Murmur types it in whatever app you’re in. Its speech models run on your PC, it installs for your account without admin rights, and it updates itself.",
    sections: [
      {
        h2: "What Murmur does on Windows",
        points: [
          ["Dictation in any app", "Outlook, Teams, Word, Slack, a browser, a code editor: wherever your cursor is."],
          ["AI cleanup", "Turn it on and the ums and false starts go, without rewording what you said."],
          ["Voice commands", "Open apps, change settings, control media and volume, or rewrite, translate or summarise the text you’ve selected."],
          ["File search", "Find a file by what’s inside it, and words in images too."],
        ],
      },
      {
        h2: "On Windows and on a Mac",
        parity: true,
      },
      {
        h2: "Installing it",
        steps: [
          ["Download the installer and run it.", "It installs for your account, with no admin rights needed."],
          ["If Windows warns you, choose to keep it.", "The installer isn’t code-signed yet. In Chrome’s downloads, choose Keep; if SmartScreen says it protected your PC, click More info, then Run anyway."],
          ["Choose how you speak, and hold Ctrl and the Windows key.", "English, Hinglish or one of 25 European languages. Only that model downloads."],
        ],
      },
    ],
    faq: [
      ["Is Murmur free on Windows?", "Yes, with no account and no subscription. It’s open source under the MIT licence."],
      ["How is it different from Windows voice typing (Win + H)?", "Windows’ own voice typing is fine for a quick note. Murmur adds AI cleanup, Hinglish, voice commands and file search, and its speech models run on your PC."],
      ["Does it work offline?", "Yes, once the speech model you chose has downloaded."],
      ["Why does Windows warn about the installer?", "It isn’t code-signed yet. The source is open on GitHub, and the Mac app is signed and notarized by Apple."],
    ],
  },
  {
    path: "/hinglish-voice-typing/",
    nav: "Hinglish voice typing",
    title: "Hinglish voice typing on Mac and Windows, free | Murmur",
    description: "Speak Hindi and English mixed, the way you talk, and Murmur types it in English letters in any app, on Mac and Windows. Free, and it runs on your computer.",
    kicker: "Hindi and English, mixed as you speak",
    h1: "Voice typing that keeps",
    hi: "your Hinglish",
    lede: "Most dictation makes you pick Hindi or English. Murmur doesn’t: say “kal ki meeting 3 baje shift kar do” and that’s what’s typed, in English letters, in WhatsApp, Slack, an email or a document. It’s free, on Mac and Windows, and the model runs on your own computer.",
    sections: [
      {
        h2: "Typed the way you said it",
        examples: [
          ["Kal ki meeting 3 baje shift kar do, aur Priya ko bhi bata dena.", "In a Slack message"],
          ["Bhai, deck thoda late hoga, client ka feedback abhi aaya hai.", "In WhatsApp"],
          ["Invoice next week tak bhej denge, please confirm kar dijiye.", "In an email"],
        ],
      },
      {
        h2: "How Murmur does it",
        paragraphs: [
          "When you choose Hinglish, Murmur downloads Oriserve’s Whisper Hindi2Hinglish Apex, a speech model trained on Hindi and English spoken together, about 1 GB. It runs on your computer, so what you say isn’t sent anywhere to be transcribed.",
          "It types in English letters, the way most people write Hinglish in chats and email. Commands understand it too: “PDF kholo” opens the PDF, and “Slack kholo” opens Slack.",
        ],
      },
      {
        h2: "Where it helps",
        paragraphs: [
          "Most of us don’t write the way we talk. A quick reply to a colleague, a note to the family group, a reminder to yourself: in Hinglish they’re faster to say than to type, and Murmur keeps the words you chose, in English letters, spelled the way you’d write them in a chat.",
          "It works in any app you can type in, on a Mac with fn and on Windows with Ctrl and the Windows key, so the same habit carries from WhatsApp Web to Gmail to a work document.",
        ],
      },
      {
        h2: "Setting it up",
        steps: [
          ["Download Murmur and open it.", "On a Mac or a Windows PC. There’s no account to make."],
          ["Choose Hinglish as how you speak.", "The Hinglish model, about 1 GB, downloads once. You can switch to English later in Settings."],
          ["Hold the key and talk.", "fn on a Mac, Ctrl and the Windows key on a PC. Let go, and it’s typed where your cursor is."],
        ],
      },
      {
        h2: "Also in Murmur",
        points: [
          ["AI cleanup", "Takes out the ums and applies your corrections, without rewording what you said."],
          ["English and 25 European languages", "Switch to English, or one of 25 European languages, in Settings."],
          ["Commands and file search", "Open apps, change the volume, or find a file by what’s in it, with the same key."],
        ],
      },
    ],
    faq: [
      ["Does Murmur type in Devanagari?", "No. Hinglish is typed in English letters, the way it’s usually written in chats and email."],
      ["Does Hinglish work on Windows?", "Yes, on Windows 10 and 11 as well as on a Mac."],
      ["Does it work offline?", "Yes, once the Hinglish model has downloaded."],
      ["Is it free?", "Yes. Murmur is free and open source, with no account."],
    ],
  },
  {
    path: "/offline-speech-to-text/",
    nav: "Offline, private speech to text",
    title: "Offline, private speech to text for Mac and Windows | Murmur",
    description: "Murmur turns speech into text on your own computer, with no account and no upload. Free and open source for Mac and Windows; it works offline once set up.",
    kicker: "Nothing you say is uploaded to be transcribed",
    h1: "Speech to text that",
    hi: "stays on your computer",
    lede: "Murmur turns your speech into text on your own Mac or PC. There’s no account, nothing you say is uploaded to be transcribed, and once its models have downloaded it works offline. It’s free and open source, so you don’t have to take our word for it.",
    sections: [
      {
        h2: "Which models run where",
        models: true,
      },
      {
        h2: "What never leaves your computer",
        points: [
          ["Your voice", "The audio is held in memory only while it’s transcribed, then it’s gone."],
          ["Your files", "File search indexes only the folders you choose, on your computer."],
          ["Your memory", "What Murmur remembers is kept on your Mac. Your other AI tools can read it only if you connect them."],
        ],
      },
      {
        h2: "When the cloud is used, and only if you choose",
        paragraphs: [
          "Dictation, cleanup, file search and quick commands never need it. For bigger jobs, Murmur Agent plans the steps on your Mac; if you’d rather, you can give Murmur your own Claude or OpenAI key, and then what the job needs goes to that provider.",
          "On a Mac, Murmur can also read what you worked on with your own key, to remember it better. Email addresses, phone and account numbers and booking references are taken out first, and banking, health, ID and password pages are never sent.",
        ],
      },
    ],
    faq: [
      ["Does Murmur listen all the time?", "No. Only while you hold the key, or after you double-tap it for hands-free, until you tap again."],
      ["Does it work without the internet?", "Yes. After the models you chose have downloaded, dictation, cleanup, file search and quick commands work offline."],
      ["Can I check what it does?", "Yes. Murmur is open source under the MIT licence; every line is on GitHub."],
      ["Does it record my screen?", "No video, ever. Only if you turn on Remember what I work on does it read the text of the window you’re working in, on your Mac."],
    ],
  },
];
