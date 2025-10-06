import React from "react"
import { Award, Film, Users } from "lucide-react"

const AboutPage = () => {
  return (
    <div className="bg-background text-white min-h-screen pt-16">
      <div className="relative bg-gray-800 py-20 md:py-32">
        <div className="absolute inset-0">
          <img
            src="https://ik.imagekit.io/yxctvbjvh/sydcinema.jpeg?updatedAt=1753893720737"
            alt="Bioskop"
            className="w-full h-full object-bottom opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Tentang Surya Yudha Cinema
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
            Menghadirkan pengalaman menonton terbaik dengan teknologi terdepan dan kenyamanan tak
            tertandingi sejak 2010.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mb-16">
          <Feature
            icon={<Film size={40} className="text-primary" />}
            title="Teknologi Terkini"
            description="Nikmati kualitas gambar dan suara terbaik dengan proyektor 4K dan sound system Dolby Atmos."
          />
          <Feature
            icon={<Users size={40} className="text-primary" />}
            title="Kenyamanan Utama"
            description="Kursi ergonomis dan ruang kaki yang luas memastikan Anda bisa rileks dan menikmati film."
          />
          <Feature
            icon={<Award size={40} className="text-primary" />}
            title="Layanan Terbaik"
            description="Staf kami yang ramah siap membantu Anda dari pembelian tiket hingga akhir film."
          />
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Perjalanan Kami</h2>
          <p className="text-gray-400 leading-relaxed text-justify">
            Berawal dari sebuah mimpi untuk membawa hiburan kelas dunia ke kota kami, Surya Yudha
            Cinema didirikan pada tahun 2010. Kami memulai dengan satu studio sederhana, namun
            dengan visi yang besar: menjadi lebih dari sekadar tempat menonton film, tetapi menjadi
            pusat komunitas di mana cerita dan imajinasi bertemu. Selama lebih dari satu dekade,
            kami terus berinovasi, menambahkan studio baru, mengadopsi teknologi terbaru, dan yang
            terpenting, mendengarkan setiap masukan dari Anda, para penikmat film. Kami bangga telah
            menjadi bagian dari momen-momen tak terlupakan Anda, dari tawa, tangis, hingga
            ketegangan yang Anda rasakan di kegelapan bioskop.
          </p>
        </div>
      </div>
    </div>
  )
}

const Feature = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) => (
  <div>
    <div className="flex justify-center items-center mb-4 w-20 h-20 mx-auto bg-gray-800 rounded-full">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
)

export default AboutPage
