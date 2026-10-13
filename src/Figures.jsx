// Field-guide figures, drawn as SVG: the field marks (keys) and the range map (where your data lives).

function Key({ x, y, w = 56, label, tone, mark }) {
  const fill = { coral: "var(--coral)", yellow: "var(--yellow)", teal: "var(--teal)" }[tone] || "#fff";
  const ink = tone === "teal" ? "#fff" : "var(--ink)";
  return (
    <g>
      <rect x={x} y={y + 4} width={w} height="56" rx="9" fill="rgba(23,25,30,.16)" />
      <rect x={x} y={y} width={w} height="56" rx="9" fill={fill} stroke="var(--ink)" strokeWidth="1.5" />
      <text x={x + 10} y={y + 42} fill={ink} fontSize="17" fontFamily="var(--sans)">{label}</text>
      {mark && (
        <g>
          <circle cx={x + w - 12} cy={y + 13} r="10" fill="var(--ink)" />
          <text x={x + w - 12} y={y + 18} fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="var(--sans)">{mark}</text>
        </g>
      )}
    </g>
  );
}

export function FieldMarks() {
  const top = ["z", "x", "c", "v", "b", "n", "m"];
  return (
    <svg className="field-marks" viewBox="0 0 720 300" role="img"
      aria-label="The bottom left of a Mac keyboard. The fn key is marked 1, Control is marked 2, and Shift, Command and Space are marked 3. Above, the Murmur capsule is marked 4.">
      {/* The capsule at the bottom of the screen */}
      <g transform="translate(250 6)">
        <rect width="220" height="44" rx="22" fill="var(--ink)" />
        <g transform="translate(14 8) scale(0.32)">
          <path d="M30 58 L12 47 L16 67 Z" fill="#E2554A" transform="translate(-10 -26)" />
          <ellipse cx="38" cy="34" rx="24" ry="19" fill="var(--coral)" />
          <circle cx="56" cy="16" r="13" fill="var(--coral)" />
          <path d="M68 14.5 L79 18 L68 21.5 Z" fill="var(--yellow)" />
        </g>
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={52 + i * 6} y={22 - [5, 10, 14, 8, 4][i]} width="3" height={[5, 10, 14, 8, 4][i] * 2} rx="1.5" fill="var(--coral)" />)}
        <text x="96" y="27" fill="#f4f1ee" fontSize="14" fontFamily="var(--sans)">Listening</text>
        <circle cx="232" cy="8" r="10" fill="var(--ink)" stroke="#fff" strokeWidth="2" />
        <text x="232" y="13" fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="var(--sans)">4</text>
      </g>
      <line x1="0" y1="78" x2="720" y2="78" stroke="var(--rule)" strokeDasharray="3 5" />
      <g transform="translate(0 112)">
        <Key x={0} y={0} w={128} label="⇧ shift" tone="teal" mark="3" />
        {top.map((k, i) => <Key key={k} x={136 + i * 64} y={0} label={k} />)}
        <Key x={0} y={64} label="fn" tone="coral" mark="1" />
        <Key x={64} y={64} label="⌃" tone="yellow" mark="2" />
        <Key x={128} y={64} label="⌥" />
        <Key x={192} y={64} w={76} label="⌘" tone="teal" />
        <Key x={276} y={64} w={300} label="space" tone="teal" />
        <Key x={584} y={64} w={76} label="⌘" />
        <Key x={668} y={64} w={52} label="⌥" />
      </g>
    </svg>
  );
}

export function RangeMap() {
  return (
    <svg className="range-map" viewBox="0 0 760 440" role="img"
      aria-label="Range map. Your Mac is shaded solid: your voice, transcripts, file index and history live there. A dotted area outside is visited only if you add a Claude or OpenAI key, and then only for command words, the front app's name and selected text.">
      <defs>
        <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="var(--yellow-ink)" />
        </pattern>
        <pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="9" height="9" fill="var(--teal)" />
          <line x1="0" y1="0" x2="0" y2="9" stroke="#2c8a83" strokeWidth="3" />
        </pattern>
      </defs>
      {/* Occasional range: the provider's cloud, only with your own key */}
      <path d="M470 70 C520 20 610 28 640 80 C700 78 740 130 718 180 C750 230 700 280 650 268 C620 310 540 312 510 270 C460 286 420 240 436 196 C400 170 414 100 470 70 Z"
        fill="url(#dots)" stroke="var(--yellow-ink)" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
      <text x="490" y="140" fontSize="22" fontFamily="var(--serif)" fill="var(--ink)">Claude or OpenAI</text>
      <text x="490" y="166" fontSize="15" fontFamily="var(--sans)" fill="var(--ink)">only with your own key</text>
      {/* Resident range: your Mac */}
      <rect x="40" y="96" width="400" height="250" rx="16" fill="url(#hatch)" stroke="var(--ink)" strokeWidth="2" />
      <rect x="0" y="346" width="480" height="22" rx="8" fill="var(--ink)" />
      <rect x="66" y="122" width="348" height="120" rx="8" fill="#fff" />
      <text x="84" y="164" fontSize="28" fontFamily="var(--serif)" fill="var(--ink)">Your Mac</text>
      <text x="84" y="194" fontSize="15" fontFamily="var(--sans)" fill="var(--ink)">voice, transcripts, file index,</text>
      <text x="84" y="216" fontSize="15" fontFamily="var(--sans)" fill="var(--ink)">history, API keys (in Keychain)</text>
      {/* The one crossing */}
      <path d="M414 200 C 450 210 460 210 470 206" stroke="var(--ink)" strokeWidth="2" fill="none" strokeDasharray="5 5" />
      <path d="M462 200 l10 6 -11 4" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x="474" y="226" fontSize="14" fontFamily="var(--sans)" fill="var(--ink)">command words, app name,</text>
      <text x="474" y="244" fontSize="14" fontFamily="var(--sans)" fill="var(--ink)">selected text</text>
      {/* Never recorded outside */}
      <text x="40" y="410" fontSize="15" fontFamily="var(--sans)" fill="var(--graphite)">Never recorded outside your Mac: audio, files.</text>
    </svg>
  );
}
