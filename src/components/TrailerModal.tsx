import { X } from "lucide-react"

// Fungsi helper untuk mengekstrak ID video dari URL YouTube
const getYouTubeEmbedUrl = (url: string) => {
  let videoId = ""
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.slice(1)
    } else if (urlObj.hostname === "www.youtube.com" || urlObj.hostname === "youtube.com") {
      videoId = urlObj.searchParams.get("v") || ""
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`
  } catch (e) {
    console.error("Invalid trailer URL:", url)
    return ""
  }
}

const TrailerModal = ({ trailerUrl, onClose }: { trailerUrl: string; onClose: () => void }) => {
  const embedUrl = getYouTubeEmbedUrl(trailerUrl)

  if (!embedUrl) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl aspect-video bg-black rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white text-black rounded-full p-1 z-10 hover:scale-110 transition-transform"
        >
          <X size={24} />
        </button>
        <iframe
          width="100%"
          height="100%"
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg"
        ></iframe>
      </div>
    </div>
  )
}

export default TrailerModal
