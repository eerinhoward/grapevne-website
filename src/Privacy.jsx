import React, { useState } from 'react'
import Layout from './components/Layout'

export default function Privacy() {
  const [activeTab, setActiveTab] = useState('app')

  return (
    <Layout title="Privacy — Grapevne">
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker"><i /> Legal</p>
          <h1 className="display">Privacy</h1>
        </div>
      </section>
      <section className="section legal" style={{ paddingTop: 12 }}>
        <div className="wrap">
          <h2>Preface</h2>
          <p>
            Our legal framework is built in partnership with the <a href="https://entrepreneurship.mit.edu/bu-law-clinic/" target="_blank" rel="noopener noreferrer">BU/MIT Student Innovations Law Clinic</a> (SILC), which provides legal advice to student entrepreneurs. The clinic is staffed by BU Law students under law faculty supervision across three practice groups: Intellectual Property & Media; Privacy, Security & Health; and Venture & Finance. SILC has been involved since the beginning of Grapevne's conceptualization and formation, providing ongoing compliance guidance and legal oversight.
          </p>
          <p>
            Given that Grapevne facilitates the sharing of food on campus, we work closely with the clinic to address food safety regulations, liability considerations, and compliance requirements. This includes guidance on food handling standards and campus-specific regulations that protect both those sharing food and those receiving it. The clinic's early involvement has helped shape our platform design and user safety measures from the ground up.
          </p>
          <p>
            SILC's expertise in intellectual property, information privacy, corporate law, and platform liability helps us navigate the complex legal landscape of operating a platform that connects students, universities, and brands around food sharing. Their guidance on user conduct policies, platform protections, and regulatory compliance has been integral to Grapevne's development.
          </p>
          <p>
            Our privacy policy reflects this collaborative approach, ensuring transparency, safety, and legal compliance while maintaining the community-driven spirit of Grapevne.
          </p>

          <div className="tabs" role="tablist">
            <button type="button" className={activeTab === 'app' ? 'active' : undefined} onClick={() => setActiveTab('app')}>App Privacy Policy</button>
            <button type="button" className={activeTab === 'website' ? 'active' : undefined} onClick={() => setActiveTab('website')}>Website Privacy Policy</button>
          </div>

          {activeTab === 'app' && (
            <div>
              <h2>Information We Collect</h2>
              <p>We collect information that you provide directly to us, such as when you create an account, post content, or contact us for support. We also automatically collect certain information about your device and how you interact with our service.</p>
              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you technical notices and support messages, and to communicate with you about products, services, and events that may be of interest to you.</p>
              <h2>Information Sharing</h2>
              <p>We may share aggregated, anonymized data with partner universities and brands to help them understand campus-level patterns and engagement. We do not sell your personal information to third parties.</p>
              <h2>Data Security</h2>
              <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              <h2>Your Rights</h2>
              <p>You have the right to access, update, or delete your personal information at any time. You can also opt out of certain data collection practices through your account settings.</p>
            </div>
          )}

          {activeTab === 'website' && (
            <div>
              <h2>Information We Collect</h2>
              <p>When you visit the Grapevne website, we may collect information about your device, browser, and how you interact with our website. This includes information such as your IP address, browser type, and pages you visit.</p>
              <h2>Cookies and Tracking</h2>
              <p>We use cookies and similar tracking technologies to collect and use information about your interaction with our website. You can control cookie preferences through your browser settings.</p>
              <h2>Third-Party Services</h2>
              <p>Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
