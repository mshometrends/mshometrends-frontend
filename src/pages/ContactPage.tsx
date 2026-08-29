import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SEOHead } from '../components/SEOHead';
import { buildStoreOrganizationSchema, buildBreadcrumbSchema } from '../utils/seoSchemas';
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast, navigateToPage } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please complete all required fields', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your message has been received by our Concierge Desk.', 'success');
  };

  const faqs = [
    {
      q: 'Is MS Home Trends bone china dishwasher and microwave safe?',
      a: 'Our white porcelain and bone china without gold rims are 100% dishwasher and microwave safe. Sets featuring 24k gold or platinum gilding should be hand washed or cleaned on delicate cycle without extreme heat.',
    },
    {
      q: 'How are fragile crockery orders shipped to prevent breakage?',
      a: 'We custom-pack every set inside high-density foam molds enclosed in reinforced wooden crates. In the rare event of transit damage, we issue immediate free replacements within 48 hours.',
    },
    {
      q: 'Do you offer custom corporate or wedding gift registry services?',
      a: 'Yes! Our Concierge team handles custom monogramming, gift wrapping in velvet trunks, and personalized wedding registries. Contact us for custom quotes.',
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'We offer a 30-day effortless return window. Items must be in original condition and packaging.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-16 text-slate-800">
      <SEOHead
        title="Contact Us & Private Concierge Desk"
        description="Get in touch with MS Home Trends tableware concierge. Inquire about custom bridal dinner sets, wholesale orders, fragile shipping, or visit our Karachi flagship boutique."
        keywords="contact MS Home Trends, crockery store Karachi, tableware showroom DHA Karachi, bridal gift registry, fine china concierge"
        canonicalUrl="/contact"
        jsonLd={[
          buildStoreOrganizationSchema(),
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Contact Concierge', url: '/contact' },
          ]),
        ]}
      />
      <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest uppercase text-[#B45309]">
            Private Concierge
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif-title font-bold text-[#0A3825]">
            We Are At Your Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-light">
            Have questions regarding table styling, trade orders, or care instructions?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Side */}
          <div className="space-y-8 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm h-fit">
            <h3 className="text-xl font-serif-title font-bold text-[#0A3825] border-b border-slate-200 pb-4">
              Showrooms & Concierge
            </h3>

            <div className="space-y-6 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#0A3825] block text-sm font-serif-title">Karachi Flagship Showroom</strong>
                  <p className="text-slate-500 mt-0.5">Shop #4, Zamzama Commercial Lane 3, Phase V, DHA Karachi, Pakistan</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                <Phone className="w-5 h-5 text-[#B45309] shrink-0" />
                <div>
                  <strong className="text-[#0A3825] block">Direct Concierge</strong>
                  <a href="tel:+923242303895" className="text-slate-600 hover:text-[#0A3825] font-medium">
                    +92 324 2303895
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#B45309] shrink-0" />
                <div>
                  <strong className="text-[#0A3825] block">Concierge Email</strong>
                  <a href="mailto:concierge@mshometrends.pk" className="text-slate-600 hover:text-[#0A3825]">
                    concierge@mshometrends.pk
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-200">
                <Clock className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#0A3825] block">Showroom Hours</strong>
                  <span className="text-slate-500">Mon - Sat: 11:00 AM - 9:30 PM (PKT)</span>
                </div>
              </div>

              <div className="pt-3">
                <a
                  href="https://wa.me/923242303895"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp (+92 324 2303895)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
            <h3 className="text-xl font-serif-title font-bold text-[#0A3825] mb-6">Send Concierge Inquiry</h3>

            {submitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
                <h4 className="text-lg font-serif-title font-bold text-[#0A3825]">Inquiry Received</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you, <strong className="text-[#0A3825]">{formData.name}</strong>. Our table styling specialist will contact you at <strong className="text-[#0A3825]">{formData.email}</strong> within 12 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Victoria Sterling"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="victoria@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Inquiry Topic</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Wedding Registry">Wedding Registry</option>
                      <option value="Trade & Interior Design">Trade & Interior Design</option>
                      <option value="Care & Gilding Guide">Care & Gilding Guide</option>
                      <option value="Order Tracking">Order Tracking</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Message *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="How may our concierge team assist your tableware selection today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#0A3825] hover:bg-[#062418] text-white font-semibold px-8 py-3.5 rounded-xl shadow-md border border-[#D4AF37]/30 flex items-center gap-2 text-xs transition-all"
                >
                  <Send className="w-4 h-4 text-amber-300" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-6 pt-10 border-t border-slate-200">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B45309]">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl font-serif-title font-bold text-[#0A3825]">
              Crockery Care & Ordering Guidance
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-serif-title font-bold text-sm text-[#0A3825] hover:text-[#B45309] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-[#B45309]' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 font-light leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => navigateToPage('faq')}
              className="bg-[#0A3825] hover:bg-[#062418] text-amber-300 font-semibold px-6 py-3 rounded-xl border border-[#D4AF37]/40 text-xs transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Explore Complete FAQs & Help Center &rarr;</span>
            </button>
            <button
              onClick={() => navigateToPage('shipping')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-6 py-3 rounded-xl border border-slate-300 text-xs transition-all shadow-xs inline-flex items-center gap-2"
            >
              <span>View Full Shipping & Delivery Policy &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
