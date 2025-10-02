import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Globe, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image src="/gkf-logo.webp" alt="GKF Logo" width={40} height={40} className="h-10 w-10 object-contain" />
              <div>
                <div className="text-lg font-bold">IV</div>
                <div className="text-xs text-muted-foreground">Interns & Volunteers</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting volunteers with meaningful opportunities worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/opportunities" className="text-muted-foreground hover:text-primary transition-colors">
                  Find Opportunities
                </Link>
              </li>
              <li>
                <Link href="/join-ivy" className="text-muted-foreground hover:text-primary transition-colors">
                  Join IV
                </Link>
              </li>
              <li>
                <Link 
                href="https://gkfmadurai.in/about-us/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* GKF Information */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">About GKF</h3>
             <ul className="space-y-2 text-sm">
              <li>
              <Link 
                href="https://gkfmadurai.in/about-us/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                  Grace Kennett Foundation
                </Link>
              </li>
              <li>
            <Link
              href="https://gkfmadurai.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <Globe className="h-3 w-3" />
              Visit GKF Website
            </Link>
            </li>
          </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Connect With Us</h3>
            <div className="flex gap-4">
              <Link
                href="https://www.facebook.com/gkfindia/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/gkfmadurai/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://chat.whatsapp.com/KDd1RLyrpsqD3KIGVtysyc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Grace Kennett Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
