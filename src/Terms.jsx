import React, { useState } from 'react'
import Layout from './components/Layout'

export default function Terms() {
  const [activeTab, setActiveTab] = useState('app')

  return (
    <Layout title="Terms — Grapevne">
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker"><i /> Legal</p>
          <h1 className="display">Terms</h1>
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
            Our terms of service reflect this collaborative approach, ensuring transparency, safety, and legal compliance while maintaining the community-driven spirit of Grapevne.
          </p>

          <div className="tabs" role="tablist">
            <button type="button" className={activeTab === 'app' ? 'active' : undefined} onClick={() => setActiveTab('app')}>App Terms of Service</button>
            <button type="button" className={activeTab === 'website' ? 'active' : undefined} onClick={() => setActiveTab('website')}>Website Terms of Service</button>
          </div>

          {activeTab === 'app' && (
            <div>
              <h2>Agreement to Terms</h2>
              <p>By accessing or using the Grapevne mobile application, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.</p>
              <h2>Use License</h2>
              <p>Permission is granted to download and use the Grapevne mobile application for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the application, use it for any commercial purpose, or attempt to decompile or reverse engineer any software contained in the Grapevne app.</p>
              <h2>User Conduct</h2>
              <p>You agree to use the Grapevne app only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the service. Prohibited behavior includes harassing or causing distress or inconvenience to any person, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our service.</p>
              <h2 id="food-safety">Food Safety and Liability</h2>
              <p>Grapevne serves as a platform for connecting users with free food opportunities. We do not prepare, handle, or distribute food. Users who share food are responsible for ensuring compliance with all applicable food safety regulations. Grapevne is not liable for any issues arising from food shared through the platform. Users consume food at their own risk and should exercise appropriate judgment regarding food safety.</p>
              <h2>Disclaimer</h2>
              <p>The Grapevne mobile application is provided on an 'as is' basis. Grapevne makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            </div>
          )}

          {activeTab === 'website' && (
            <div>
              <h2>Agreement to Terms</h2>
              <p>By accessing or using the Grapevne website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this website.</p>
              <h2>Use License</h2>
              <p>Permission is granted to temporarily access and view the Grapevne website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials, use the materials for any commercial purpose, or attempt to decompile or reverse engineer any software contained on the Grapevne website.</p>
              <h2>User Conduct</h2>
              <p>You agree to use the Grapevne website only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes harassing or causing distress or inconvenience to any person, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our website.</p>
              <h2>Disclaimer</h2>
              <p>The materials on the Grapevne website are provided on an 'as is' basis. Grapevne makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
