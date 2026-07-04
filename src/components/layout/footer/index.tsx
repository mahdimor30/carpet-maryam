import type { FooterSection } from '@/type'
import { FOOTER_SECTIONS, LEGAL_LINKS } from './data'
import { FooterBrand } from './footer-brand'

function FooterSection({ title, links }: FooterSection) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-white">{title}</h4>

      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-xs transition-colors hover:text-white">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-sm text-neutral-400">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-10 grid grid-cols-2 gap-8 md:grid-cols-4">
          <FooterBrand />

          {FOOTER_SECTIONS.map((section) => (
            <FooterSection
              key={section.title}
              title={section.title}
              links={section.links}
            />
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-neutral-800 pt-6 sm:flex-row">
          <p className="text-xs text-neutral-600">
            © ۱۴۰۴ فرش‌سرا — تمامی حقوق محفوظ است
          </p>

          <div className="flex gap-4 text-xs">
            {LEGAL_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="transition-colors hover:text-white"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
