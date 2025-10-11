import { Link } from "react-router-dom"

const StatsCard = ({ title, value, icon, color, to }: any) => {
  const cardContent = (
    <div className={`p-5 rounded-lg shadow-md flex items-center justify-between ${color}`}>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className="p-3 bg-white/50 rounded-full">{icon}</div>
    </div>
  )

  // Jika ada prop 'to', bungkus dengan Link. Jika tidak, gunakan div biasa.
  return to ? (
    <Link to={to} className="transition-transform transform hover:-translate-y-1">
      {cardContent}
    </Link>
  ) : (
    <div>{cardContent}</div>
  )
}

export default StatsCard
