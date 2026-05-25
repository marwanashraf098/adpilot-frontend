function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <a href="/" className="text-xl font-bold">
          Ad<span className="text-blue-500">Pilot</span>
        </a>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-400 mb-12">Last updated: May 25, 2026</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
            <p>AdPilot ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our AI-powered media buying platform at adpilot.io and related services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Information We Collect</h2>
            <p className="mb-3">We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Account information:</strong> Name, email address, business name, and industry when you register.</li>
              <li><strong className="text-white">Ad account data:</strong> Campaign performance metrics, spend, impressions, clicks, and other advertising data from connected Meta, Google, and TikTok ad accounts.</li>
              <li><strong className="text-white">Usage data:</strong> How you interact with our platform, features you use, and actions you take.</li>
              <li><strong className="text-white">Communication data:</strong> Messages you send through our AI chat assistant and support channels.</li>
              <li><strong className="text-white">Payment information:</strong> Billing details processed securely through Stripe (we do not store card details).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and improve our AI media buying services</li>
              <li>To analyze your campaign performance and generate AI recommendations</li>
              <li>To send WhatsApp and email alerts about your campaign performance</li>
              <li>To generate ad copy and creative suggestions using AI</li>
              <li>To send you product updates, tips, and marketing communications (you can opt out at any time)</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Meta Platform Data</h2>
            <p className="mb-3">When you connect your Meta (Facebook/Instagram) ad account, we access the following data through the Meta Marketing API:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Campaign names, objectives, and status</li>
              <li>Ad set and ad performance metrics (impressions, clicks, spend, CPL, ROAS)</li>
              <li>Audience targeting configurations</li>
              <li>Ad creative information</li>
            </ul>
            <p className="mt-3">We use this data solely to provide our campaign optimization services. We do not sell your ad account data to third parties. We comply with Meta's Platform Terms and Data Policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Data Storage and Security</h2>
            <p>Your data is stored securely on Railway cloud infrastructure. All OAuth tokens are encrypted at rest using AES-256 encryption. We implement industry-standard security measures including HTTPS encryption, secure API authentication, and regular security audits. We never store your Meta, Google, or TikTok passwords.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Data Sharing</h2>
            <p className="mb-3">We share your data only with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">OpenAI:</strong> Campaign data is sent to OpenAI's GPT-4 API to generate recommendations and ad copy. OpenAI does not use this data to train their models.</li>
              <li><strong className="text-white">Twilio:</strong> Your phone number is used to send WhatsApp alerts via Twilio's API.</li>
              <li><strong className="text-white">Stripe:</strong> Payment processing only.</li>
              <li><strong className="text-white">Meta, Google, TikTok:</strong> We interact with their APIs on your behalf to manage your campaigns.</li>
            </ul>
            <p className="mt-3">We do not sell your personal data to any third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and all associated data</li>
              <li>Disconnect your ad accounts at any time</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Cookies</h2>
            <p>We use essential cookies to keep you logged in and remember your preferences. We also use the Meta Pixel to track visits to our marketing website for advertising purposes. You can disable cookies in your browser settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. Children's Privacy</h2>
            <p>AdPilot is not directed at children under 18. We do not knowingly collect personal information from children.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a notice on our platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">11. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or how we handle your data, contact us at:</p>
            <p className="mt-2 text-blue-400">privacy@adpilot.io</p>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 px-8 py-6 text-center mt-16">
        <p className="text-gray-600 text-sm">© 2026 AdPilot. Your AI media buyer. Built for Egypt and the Middle East.</p>
      </footer>

    </div>
  )
}

export default PrivacyPolicy