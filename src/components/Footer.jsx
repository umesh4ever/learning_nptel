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

  if (name === 'wa') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M20.52 3.48A11.88 11.88 0 0 0 12.06 0C5.47 0 .11 5.35.1 11.94c0 2.1.55 4.15 1.6 5.96L0 24l6.25-1.64a11.9 11.9 0 0 0 5.8 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.49-8.41ZM12.06 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.71.97.99-3.62-.23-.37a9.85 9.85 0 0 1-1.51-5.25c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 7c0 5.45-4.44 9.88-9.91 9.88Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
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
  {
    label: 'Whatsapp',
    icon: 'wa',
    href: 'https://wa.me/919289253686?text=Hello%20Umesh.',
  },
]

export default function Footer() {
  return (
    <footer className="mt-2 w-full border-t border-[#263a49] bg-[#142536] px-5 py-4 text-[#c3d0da] sm:mt-12 sm:py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4">
        <p className="text-sm font-semibold">
          Connect with me
        </p>
        <nav aria-label="Social links" className="flex items-center gap-6">
          {socialLinks.map(({ label, icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${label} profile in a new tab`}
              className="grid size-11 place-items-center rounded-full border border-[#394c5b] bg-[#20384a] text-[#a9c6da] transition-transform hover:-translate-y-0.5 hover:bg-[#29475d] active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78a9c9]"
            >
              <SocialIcon name={icon} />
            </a>
          ))}
        </nav>
        <p className="text-xs font-medium text-[#8fa3b3]">© {currentYear} Umesh</p>
      </div>
    </footer>
  )
}
const currentYear = new Date().getFullYear()
