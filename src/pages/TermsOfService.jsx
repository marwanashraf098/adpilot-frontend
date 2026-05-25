function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <a href="/" className="text-xl font-bold">
          Ad<span className="text-blue-500">Pilot</span>
        </a>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-400 mb-12">Last updated: May 25, 2026</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using AdPilot ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service. These terms apply to all users, including businesses and individuals who connect their advertising accounts to AdPilot.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p>AdPilot is an AI-powered media buying platform that connects to your advertising accounts on Meta (Facebook/Instagram), Google Ads, and TikTok. The platform provides campaign monitoring, AI-generated recommendations, ad copy generation, creative suggestions, automated alerts, and performance analytics.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Account Registration</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate and complete information when creating an account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must notify us immediately of any unauthorized access to your account.</li>
              <li>You must be at least 18 years old to use AdPilot.</li>
              <li>One person or legal entity may not maintain more than one free account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Ad Account Access and Permissions</h2>
            <p className="mb-3">When you connect your advertising accounts to AdPilot:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You grant AdPilot permission to read and manage your advertising campaigns on your behalf.</li>
              <li>You remain fully responsible for all advertising spend and campaign decisions.</li>
              <li>AdPilot will only take automated actions within the limits and permissions you explicitly set.</li>
              <li>You can revoke AdPilot's access to your ad accounts at any time.</li>
              <li>You are responsible for ensuring your ad accounts comply with Meta, Google, and TikTok's policies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. AI Recommendations and Automation</h2>
            <p className="mb-3">Regarding our AI-powered features:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>AI recommendations are suggestions only — you retain full control over all campaign decisions.</li>
              <li>AdPilot is not responsible for the results of any campaign changes you make based on AI recommendations.</li>
              <li>Automated actions (if enabled) will only execute within the confidence thresholds and spending limits you configure.</li>
              <li>We do not guarantee specific advertising results, CPL targets, or ROAS outcomes.</li>
              <li>AI-generated ad copy should be reviewed before use to ensure it meets your brand standards and platform policies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Subscription and Payment</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>AdPilot offers subscription plans billed monthly or annually.</li>
              <li>All fees are exclusive of taxes unless stated otherwise.</li>
              <li>Subscriptions automatically renew unless cancelled before the renewal date.</li>
              <li>Refunds are provided at our discretion within 7 days of purchase for new subscribers.</li>
              <li>We reserve the right to change pricing with 30 days notice.</li>
              <li>During beta, some features may be offered free of charge — this may change upon full launch.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Acceptable Use</h2>
            <p className="mb-3">You agree not to use AdPilot to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create or run ads that violate Meta, Google, or TikTok advertising policies</li>
              <li>Advertise illegal products or services</li>
              <li>Engage in fraudulent advertising or click fraud</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to reverse engineer or copy our platform</li>
              <li>Share your account access with unauthorized third parties</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Intellectual Property</h2>
            <p>AdPilot and its original content, features, and functionality are owned by AdPilot and are protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works based on our platform without explicit written permission. AI-generated ad copy created using our platform may be used freely by you for your advertising purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
            <p>AdPilot shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or advertising spend, resulting from your use of or inability to use the service. Our total liability to you for any claims arising from these terms shall not exceed the amount you paid us in the 3 months prior to the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">10. Disclaimer of Warranties</h2>
            <p>AdPilot is provided "as is" without warranties of any kind. We do not warrant that the service will be uninterrupted, error-free, or that AI recommendations will achieve specific advertising results. Advertising performance depends on many factors outside our control including market conditions, ad platform algorithms, and creative quality.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">11. Termination</h2>
            <p>We reserve the right to suspend or terminate your account if you violate these terms. You may cancel your account at any time. Upon termination, your data will be deleted within 30 days except where we are required to retain it by law.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">12. Governing Law</h2>
            <p>These terms are governed by the laws of Egypt. Any disputes arising from these terms shall be resolved in the courts of Cairo, Egypt.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">13. Changes to Terms</h2>
            <p>We may update these Terms of Service at any time. We will notify you of significant changes via email. Continued use of AdPilot after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">14. Contact Us</h2>
            <p>For questions about these Terms of Service, contact us at:</p>
            <p className="mt-2 text-blue-400">legal@adpilot.io</p>
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

export default TermsOfService