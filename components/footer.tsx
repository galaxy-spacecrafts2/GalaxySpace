"use client"

import { Rocket, Youtube, Twitter, Github } from 'lucide-react'
import Link from 'next/link'

const footerLinks = {
  resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'Tutorials', href: '/tutorials' },
    { label: 'Blog', href: '/blog' },
    { label: 'Mission Control', href: '/' },
  ],
  community: [
    { label: 'YouTube', href: 'https://youtube.com/@galaxy.spacecrafts', external: true },
    { label: 'Discord', href: '#', external: true },
    { label: 'GitHub', href: '#', external: true },
    { label: 'Twitter', href: '#', external: true },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'License', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-background" />
              </div>
              <div>
                <span className="text-lg font-bold text-foreground tracking-tight block">
                  Galaxy.SpaceCrafts
                </span>
                <span className="text-[10px] text-muted-foreground font-mono tracking-widest">
                  ROCKET SYSTEMS
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Open-source rocket telemetry and control systems for the maker community.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://youtube.com/@galaxy.spacecrafts" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-4">
              Community
            </h4>
            <ul className="space-y-2">
              {footerLinks.community.map(link => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono">
            &copy; {new Date().getFullYear()} Galaxy.SpaceCrafts. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            Made with precision for the stars.
          </p>
        </div>
      </div>
    </footer>
  )
}
