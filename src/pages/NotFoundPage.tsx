import { Link } from "react-router-dom"
import { Clapperboard, ArrowLeft } from "lucide-react"

const NotFoundPage = () => {
  return (
    <div className="bg-background text-white min-h-screen flex flex-col items-center justify-center text-center p-4">
      <div className="relative flex items-center justify-center mb-8">
        <Clapperboard className="w-32 h-32 text-primary opacity-20 transform -rotate-12" />
        <h1
          className="absolute text-8xl md:text-9xl font-black text-white"
          style={{ textShadow: "0 0 15px rgba(0,0,0,0.5)" }}
        >
          404
        </h1>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mt-4">Halaman Tidak Ditemukan</h2>
      <p className="mt-4 max-w-md text-gray-400">
        Maaf, halaman yang Anda cari sepertinya hilang di ruang proyektor. Mari kita kembali ke
        lobi.
      </p>
      <Link
        to="/"
        className="mt-8 flex items-center gap-2 px-6 py-3 text-lg bg-primary hover:bg-primary-dark transition rounded-full font-semibold cursor-pointer"
      >
        <ArrowLeft size={20} />
        Kembali ke Beranda
      </Link>
    </div>
  )
}

export default NotFoundPage
