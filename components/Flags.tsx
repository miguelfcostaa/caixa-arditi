export function PortugalFlag({
  className = "h-3.5 w-5 rounded-[2px] shrink-0 shadow-xs overflow-hidden",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 600 400"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="240" height="400" fill="#006600" />
      <rect x="240" width="360" height="400" fill="#FF0000" />
      {/* Esfera Armilar */}
      <circle cx="240" cy="200" r="75" fill="#FFCC00" />
      <circle cx="240" cy="200" r="60" fill="none" stroke="#006600" strokeWidth="8" />
      {/* Escudo Português */}
      <path
        d="M210 155 h60 v45 c0 25 -30 45 -30 45 s-30 -20 -30 -45 z"
        fill="#FF0000"
      />
      <path
        d="M220 165 h40 v35 c0 18 -20 30 -20 30 s-20 -12 -20 -30 z"
        fill="#FFFFFF"
      />
      {/* Quinas */}
      <circle cx="240" cy="192" r="5" fill="#002B7F" />
      <circle cx="230" cy="182" r="4" fill="#002B7F" />
      <circle cx="250" cy="182" r="4" fill="#002B7F" />
      <circle cx="230" cy="202" r="4" fill="#002B7F" />
      <circle cx="250" cy="202" r="4" fill="#002B7F" />
    </svg>
  );
}

export function UKFlag({
  className = "h-3.5 w-5 rounded-[2px] shrink-0 shadow-xs overflow-hidden",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 60 40"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fundo Azul */}
      <rect width="60" height="40" fill="#012169" />
      {/* Cruz Diagonal Branca */}
      <path
        d="M0 0 L60 40 M60 0 L0 40"
        stroke="#FFFFFF"
        strokeWidth="8"
      />
      {/* Cruz Diagonal Vermelha (St. Patrick) */}
      <path
        d="M0 0 L60 40 M60 0 L0 40"
        stroke="#C8102E"
        strokeWidth="4.5"
      />
      {/* Cruz Reta Branca */}
      <path d="M30 0 v40 M0 20 h60" stroke="#FFFFFF" strokeWidth="13" />
      {/* Cruz Reta Vermelha (St. George) */}
      <path d="M30 0 v40 M0 20 h60" stroke="#C8102E" strokeWidth="7.5" />
    </svg>
  );
}
