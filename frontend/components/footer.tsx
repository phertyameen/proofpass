import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#features"
                  className="hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/style-guide"
                  className="hover:text-foreground transition-colors"
                >
                  Brand
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={"/icon.png"}
              alt="proofpass logo icon"
              width={100}
              height={100}
              className="w-10 h-10 md:hidden"
            />
            <Image
              src={"/logo.png"}
              alt="proofpass logo"
              width={100}
              height={100}
              priority
              className="w-full hidden md:block"
            />
          </Link>

          <p className="text-sm text-muted-foreground">
            © 2025 ProofPass. Built on Base. Where Proof Meets Profit.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="sr-only">Twitter</span>𝕏
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="sr-only">GitHub</span>
              GitHub
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="sr-only">Discord</span>
              Discord
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
