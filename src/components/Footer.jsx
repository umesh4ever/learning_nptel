function SocialIcon({ name }) {
  if (name === 'linkedin') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
      </svg>
    )
  }

  if (name === 'x') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.42L5.56 22H2.43l7.25-8.28L1.84 2h6.41l4.43 6.76L18.9 2Zm-1.1 17.86h1.73L7.31 4.03H5.45L17.8 19.86Z" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.5-1.3-1.26-1.65-1.26-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.02 1.74 2.66 1.24 3.3.95.1-.73.4-1.24.72-1.52-2.5-.28-5.13-1.25-5.13-5.57 0-1.23.44-2.24 1.17-3.03-.12-.28-.51-1.43.11-2.98 0 0 .96-.3 3.08 1.16a10.7 10.7 0 0 1 5.6 0c2.12-1.44 3.08-1.16 3.08-1.16.62 1.55.23 2.7.11 2.98.73.8 1.17 1.8 1.17 3.03 0 4.33-2.63 5.29-5.14 5.57.4.35.76 1.03.76 2.08v3.09c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8Z" />
    </svg>
  )
}

const socialLinks = [
  {
    label: 'LinkedIn',
    icon: 'linkedin',
    href: 'https://www.linkedin.com/in/umesh-b7066627b/',
  },
  {
    label: 'X',
    icon: 'x',
    href: 'https://x.com/umesh26710051?t=osNStRsMP5N1hCn3TWjRVg&s=09',
  },
  {
    label: 'GitHub',
    icon: 'github',
    href: 'https://github.com/umesh4ever',
  },
]

export default function Footer() {
  return (
    <footer className="mt-8 w-full border-t border-[#cbddeb] bg-[#dfeaf3] px-5 py-8 text-[#35516a] sm:mt-12 sm:py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4">
        <p className="text-sm font-semibold">
          Connect with me
        </p>
        <nav aria-label="Social links" className="flex items-center gap-5">
          {socialLinks.map(({ label, icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${label} profile in a new tab`}
              className="grid size-11 place-items-center rounded-full border border-[#c4d7e6] bg-[#eaf2f8] text-[#35658c] transition-transform hover:-translate-y-0.5 hover:bg-[#d5e5f1] active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#356da8]"
            >
              <SocialIcon name={icon} />
            </a>
          ))}
        </nav>
        <p className="text-xs font-medium text-[#71899c]">© {currentYear} Umesh</p>
      </div>
    </footer>
  )
}
const currentYear = new Date().getFullYear()
