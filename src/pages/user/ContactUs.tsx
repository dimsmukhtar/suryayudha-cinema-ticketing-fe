import React from "react"
import { Mail, Phone, MapPin } from "lucide-react"

const ContactUs = () => {
  return (
    <div className="bg-background text-white min-h-screen pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Hubungi Kami</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            Punya pertanyaan atau masukan? Kami siap mendengarkan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Contact Info & Map */}
          <div>
            <div className="space-y-6 mb-8">
              <ContactInfo
                icon={<MapPin />}
                title="Alamat"
                lines={[
                  "Jl. Raya Rejasa No.KM. 1, Rejasa, Kecamatan Madukara, Kabupaten Banjarnegara, Jawa Tengah 53482",
                ]}
              />
              <ContactInfo icon={<Phone />} title="Telepon" lines={["(0281) 123-456"]} />
              <ContactInfo icon={<Mail />} title="Email" lines={["support@suryayudhacinema.com"]} />
            </div>
            <div className="rounded-lg overflow-hidden h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.973959141973!2d109.67388837588386!3d-7.35682617235281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7aa964d3596795%3A0x1d3315231aa8a52!2sSurya%20Yudha%20Park!5e0!3m2!1sen!2sid!4v1722356715893!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800/50 p-8 rounded-lg">
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                  Pesan
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const ContactInfo = ({
  icon,
  title,
  lines,
}: {
  icon: React.ReactNode
  title: string
  lines: string[]
}) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 text-primary mt-1">{icon}</div>
    <div>
      <h4 className="font-semibold text-lg">{title}</h4>
      {lines.map((line, index) => (
        <p key={index} className="text-gray-400">
          {line}
        </p>
      ))}
    </div>
  </div>
)

export default ContactUs
