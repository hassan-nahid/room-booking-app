import { useState } from "react"
import { Link } from "react-router"
import { Heart, Star } from "lucide-react"


export default function PropertyCard({
  id,
  images,
  title,
  location,
  price,
  rating,
  nights,
  isGuestFavorite = false,
}) {
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <Link to={`/property/${id}`} className="group cursor-pointer block">
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
        <img
          src={images[0] || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Guest favorite badge */}
        {isGuestFavorite && (
          <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
            Guest favourite
          </div>
        )}

        {/* Heart icon */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault() // Prevent navigation when clicking heart
            setIsFavorited(!isFavorited)
          }}
          className="absolute top-3 right-3 p-2 hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-6 h-6 ${isFavorited ? "fill-red-500 text-red-500" : "fill-black/50 text-white stroke-2"}`}
          />
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 truncate">{title}</h3>
          <div className="flex items-center space-x-1 ml-2">
            <Star className="w-4 h-4 fill-current text-gray-900" />
            <span className="text-sm text-gray-900">{rating}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm">{location}</p>
        <div className="flex items-baseline space-x-1">
          <span className="font-semibold text-gray-900">${price}</span>
          <span className="text-gray-600 text-sm">for {nights} nights</span>
        </div>
      </div>
    </Link>
  )
}
