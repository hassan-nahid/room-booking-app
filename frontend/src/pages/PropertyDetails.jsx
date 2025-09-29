import { useState, useRef, useEffect } from "react"
import { useParams, Link } from "react-router"
import { useProperty } from "../hooks/useProperties"
import { useAuth } from "../hooks/useAuth"
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Share, 
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Coffee,
  Waves,
  Mountain,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Shield
} from "lucide-react"
import Button from "../components/Button/Button"
import PaymentModal from "../components/PaymentModal"
import LoginModal from "../components/LoginModal"
import { calculateBookingPrice } from "../services/paymentService"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const amenityIcons = {
  wifi: Wifi,
  free_parking: Car,
  kitchen: Coffee,
  ocean_view: Waves,
  mountain_view: Mountain,
  // Add more mappings as needed
}

export default function PropertyDetails() {
  const { id } = useParams()
  const { data: propertyResponse, isLoading, error } = useProperty(id)
  const { user } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [checkInDate, setCheckInDate] = useState(null)
  const [checkOutDate, setCheckOutDate] = useState(null)
  const [guests, setGuests] = useState(1)
  
  // Payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [pricing, setPricing] = useState(null)
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false)
  const [priceError, setPriceError] = useState('')
  
  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectingCheckOut, setSelectingCheckOut] = useState(false)
  const calendarRef = useRef(null)

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Calculate pricing when dates or guests change
  useEffect(() => {
    const calculatePricing = async () => {
      const property = propertyResponse?.data
      if (!property || !checkInDate || !checkOutDate || !guests) {
        setPricing(null)
        return
      }

      setIsCalculatingPrice(true)
      setPriceError('')

      try {
        const bookingData = {
          propertyId: property._id,
          checkIn: checkInDate.toISOString(),
          checkOut: checkOutDate.toISOString(),
          numberOfGuests: guests
        }

        const pricingResponse = await calculateBookingPrice(bookingData)
        
        // Extract pricing from the API response
        if (pricingResponse.success && pricingResponse.data) {
          setPricing(pricingResponse.data.pricing)
        } else {
          setPricing(null)
        }
      } catch (error) {
        console.error('Error calculating pricing:', error)
        setPriceError('Failed to calculate pricing. Please try again.')
      } finally {
        setIsCalculatingPrice(false)
      }
    }

    calculatePricing()
  }, [propertyResponse, checkInDate, checkOutDate, guests])

  // Calendar helper functions
  const generateCalendarDays = (month) => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 41)
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date))
    }
    
    return days
  }

  const handleDateSelect = (date) => {
    if (!selectingCheckOut && !checkInDate) {
      setCheckInDate(date)
      setSelectingCheckOut(true)
    } else if (selectingCheckOut && checkInDate) {
      if (date > checkInDate) {
        setCheckOutDate(date)
        setSelectingCheckOut(false)
        setShowCalendar(false)
      } else {
        setCheckInDate(date)
        setCheckOutDate(null)
        setSelectingCheckOut(true)
      }
    }
  }

  const formatDate = (date) => {
    if (!date) return 'Add date'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const handleReserve = async () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    if (!checkInDate || !checkOutDate) {
      alert('Please select check-in and check-out dates')
      return
    }

    if (!guests || guests < 1) {
      alert('Please select number of guests')
      return
    }

    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    // Optionally redirect to bookings page or show success message
    alert('Booking confirmed! Check your email for confirmation details.')
  }

  const handlePaymentClose = () => {
    setShowPaymentModal(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">Error loading property</p>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  if (!propertyResponse || !propertyResponse.data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl">Property not found</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  const property = propertyResponse.data

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate) return property.pricePerNight
    
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    
    return nights > 0 ? nights * property.pricePerNight : property.pricePerNight
  }

  const getNights = () => {
    if (!checkInDate || !checkOutDate) return 1
    return Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)))
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4 sm:gap-0">
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="text-sm sm:text-base">Back</span>
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base">
              <Share className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base"
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 ${
                  isFavorited ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-current text-gray-900 mr-1" />
            <span className="font-medium text-sm sm:text-base">{property.rating || "New"}</span>
            <span className="text-gray-500 ml-1 text-sm sm:text-base">
              ({property.reviewsCount || 0} reviews)
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm sm:text-base">{property.location.city}, {property.location.country}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="relative mb-8">
          <div className="w-full h-[50vh] min-h-[500px] max-h-[650px] rounded-xl overflow-hidden">
            <img
              src={property.images[currentImageIndex] || "/placeholder.svg"}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2">
            {/* Property Info */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight">
                    {property.propertyType} hosted by {property.host?.firstName ? `${property.host.firstName} ${property.host.lastName}` : property.host?.email?.split('@')[0] || 'Host'}
                  </h2>
                  {property.host?.hostInfo?.isSuperhost && (
                    <div className="flex items-center mt-2">
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                        ⭐ Superhost
                      </span>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600 mt-2">
                    <span className="flex items-center text-sm sm:text-base">
                      <Users className="w-4 h-4 mr-1" />
                      {property.maxGuests} guests
                    </span>
                    <span className="flex items-center text-sm sm:text-base">
                      <Bed className="w-4 h-4 mr-1" />
                      {property.bedrooms} bedrooms
                    </span>
                    <span className="flex items-center text-sm sm:text-base">
                      <Bath className="w-4 h-4 mr-1" />
                      {property.bathrooms} bathrooms
                    </span>
                  </div>
                </div>
                <img
                  src={property.host?.profileImage || "/placeholder.svg"}
                  alt="Host"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
                />
              </div>
              {property.host?.hostInfo && (
                <div className="text-sm text-gray-600 space-y-1">
                  {property.host.hostInfo.responseRate && (
                    <p>{property.host.hostInfo.responseRate}% response rate</p>
                  )}
                  {property.host.hostInfo.responseTime && (
                    <p>Responds {property.host.hostInfo.responseTime}</p>
                  )}
                  {property.host.hostInfo.languages?.length > 0 && (
                    <p>Speaks {property.host.hostInfo.languages.join(', ')}</p>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
              
              {/* Property Highlights */}
              {property.highlights?.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Property highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.highlights.map((highlight, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm capitalize"
                      >
                        {highlight.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Amenities */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">What this place offers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {property.amenities?.slice(0, 10).map((amenity, index) => {
                  const IconComponent = amenityIcons[amenity] || Wifi
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700 capitalize">
                        {amenity.replace(/_/g, ' ')}
                      </span>
                    </div>
                  )
                })}
              </div>
              {property.amenities?.length > 10 && (
                <button className="mt-4 text-gray-900 font-medium hover:underline">
                  Show all {property.amenities.length} amenities
                </button>
              )}
            </div>

            {/* Location Map */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Where you'll be</h3>
              <div className="mb-4">
                <p className="text-gray-700 font-medium">
                  {property.location.city}, {property.location.country}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {property.address?.street && `${property.address.street}, `}
                  {property.address?.city}, {property.address?.state} {property.address?.zipCode}
                </p>
              </div>
              <div className="h-96 rounded-xl overflow-hidden border border-gray-200">
                <MapContainer
                  center={[property.location.lat, property.location.lng]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-xl"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[property.location.lat, property.location.lng]}>
                    <Popup>
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-900">{property.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {property.location.city}, {property.location.country}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  Explore the neighborhood and nearby attractions. The exact location will be 
                  provided after booking confirmation.
                </p>
              </div>
            </div>

            {/* Rules */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">House rules</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span>Check-in: {property.rules?.checkIn || '3:00 PM'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span>Check-out: {property.rules?.checkOut || '11:00 AM'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span>
                    {property.rules?.smokingAllowed ? 'Smoking allowed' : 'No smoking'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span>
                    {property.rules?.petsAllowed ? 'Pets allowed' : 'No pets'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span>
                    {property.rules?.partiesAllowed ? 'Events allowed' : 'No parties or events'}
                  </span>
                </div>
              </div>
            </div>

            {/* Booking Policies */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Booking policies</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Stay requirements</h4>
                  <div className="text-gray-600 space-y-1">
                    <p>Minimum stay: {property.minimumStay} night{property.minimumStay > 1 ? 's' : ''}</p>
                    <p>Maximum stay: {property.maximumStay} nights</p>
                    {property.instantBook && <p>✅ Instant Book available</p>}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Cancellation</h4>
                  <p className="text-gray-600 capitalize">
                    {property.cancellationPolicy} cancellation policy
                  </p>
                </div>
                {(property.weeklyDiscount > 0 || property.monthlyDiscount > 0) && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Discounts</h4>
                    <div className="text-gray-600 space-y-1">
                      {property.weeklyDiscount > 0 && (
                        <p>Weekly discount: {property.weeklyDiscount}%</p>
                      )}
                      {property.monthlyDiscount > 0 && (
                        <p>Monthly discount: {property.monthlyDiscount}%</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <div className="border border-gray-300 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold">${property.pricePerNight}</span>
                    <span className="text-gray-600 ml-1">night</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 fill-current text-gray-900 mr-1" />
                    <span className="font-medium">{property.rating || "New"}</span>
                    <span className="text-gray-500 ml-1">
                      ({property.reviewsCount || 0})
                    </span>
                  </div>
                </div>

                {/* Booking Form */}
                <div className="space-y-4">
                  {/* Calendar Date Picker */}
                  <div className="relative" ref={calendarRef}>
                    <div className="grid grid-cols-2 gap-0 border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => {
                          setShowCalendar(true)
                          setSelectingCheckOut(false)
                        }}
                        className="p-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-r border-gray-300"
                      >
                        <div className="text-xs font-medium text-gray-900 mb-1">CHECK-IN</div>
                        <div className={`text-sm ${checkInDate ? 'text-gray-900' : 'text-gray-500'}`}>
                          {formatDate(checkInDate)}
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setShowCalendar(true)
                          setSelectingCheckOut(true)
                        }}
                        className="p-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      >
                        <div className="text-xs font-medium text-gray-900 mb-1">CHECK-OUT</div>
                        <div className={`text-sm ${checkOutDate ? 'text-gray-900' : 'text-gray-500'}`}>
                          {formatDate(checkOutDate)}
                        </div>
                      </button>
                    </div>

                    {/* Calendar Dropdown */}
                    {showCalendar && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 z-50 p-3 sm:p-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
                        <div className="flex items-center justify-center mb-4">
                          <div className="flex items-center space-x-4">
                            <button 
                              className={`px-3 py-1.5 rounded-full transition-colors text-sm ${
                                !selectingCheckOut ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'
                              }`}
                              onClick={() => setSelectingCheckOut(false)}
                            >
                              Check-in
                            </button>
                            <button 
                              className={`px-3 py-1.5 rounded-full transition-colors text-sm ${
                                selectingCheckOut ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'
                              }`}
                              onClick={() => setSelectingCheckOut(true)}
                            >
                              Check-out
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                          {/* Current Month Calendar */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <button 
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <h3 className="text-sm font-semibold">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </h3>
                              <button 
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Weekday headers */}
                            <div className="grid grid-cols-7 gap-1 mb-1">
                              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                                <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                                  {day}
                                </div>
                              ))}
                            </div>

                            {/* Calendar days */}
                            <div className="grid grid-cols-7 gap-1">
                              {generateCalendarDays(currentMonth).map((date, index) => {
                                const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
                                const isToday = date.toDateString() === new Date().toDateString()
                                const isPast = date < new Date().setHours(0, 0, 0, 0)
                                const isSelected = (checkInDate && date.toDateString() === checkInDate.toDateString()) ||
                                                 (checkOutDate && date.toDateString() === checkOutDate.toDateString())
                                const isInRange = checkInDate && checkOutDate && 
                                                date >= checkInDate && date <= checkOutDate

                                return (
                                  <button
                                    key={index}
                                    onClick={() => !isPast && handleDateSelect(date)}
                                    disabled={isPast}
                                    className={`
                                      w-8 h-8 text-xs rounded-full transition-colors
                                      ${!isCurrentMonth ? 'text-gray-300' : isPast ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}
                                      ${isToday ? 'ring-1 ring-gray-400' : ''}
                                      ${isSelected ? 'bg-gray-900 text-white' : ''}
                                      ${isInRange && !isSelected ? 'bg-gray-200' : ''}
                                    `}
                                  >
                                    {date.getDate()}
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          {/* Next Month Calendar */}
                          <div className="flex-1">
                            <div className="flex items-center justify-center mb-3">
                              <h3 className="text-sm font-semibold">
                                {new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </h3>
                            </div>

                            {/* Weekday headers */}
                            <div className="grid grid-cols-7 gap-1 mb-1">
                              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                                <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                                  {day}
                                </div>
                              ))}
                            </div>

                            {/* Calendar days for next month */}
                            <div className="grid grid-cols-7 gap-1">
                              {generateCalendarDays(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)).map((date, index) => {
                                const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
                                const isCurrentMonth = date.getMonth() === nextMonth.getMonth()
                                const isPast = date < new Date().setHours(0, 0, 0, 0)
                                const isSelected = (checkInDate && date.toDateString() === checkInDate.toDateString()) ||
                                                 (checkOutDate && date.toDateString() === checkOutDate.toDateString())
                                const isInRange = checkInDate && checkOutDate && 
                                                date >= checkInDate && date <= checkOutDate

                                return (
                                  <button
                                    key={index}
                                    onClick={() => !isPast && handleDateSelect(date)}
                                    disabled={isPast}
                                    className={`
                                      w-8 h-8 text-xs rounded-full transition-colors
                                      ${!isCurrentMonth ? 'text-gray-300' : isPast ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}
                                      ${isSelected ? 'bg-gray-900 text-white' : ''}
                                      ${isInRange && !isSelected ? 'bg-gray-200' : ''}
                                    `}
                                  >
                                    {date.getDate()}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Clear dates button */}
                        <div className="flex justify-center mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => {
                              setCheckInDate(null)
                              setCheckOutDate(null)
                              setSelectingCheckOut(false)
                            }}
                            className="text-sm text-gray-600 hover:text-gray-900 underline"
                          >
                            Clear dates
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-900 mb-1">
                      GUESTS
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      {Array.from({ length: property.maxGuests }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} guest{i > 0 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button 
                    label={isCalculatingPrice ? "Calculating..." : "Reserve"} 
                    onClick={handleReserve}
                    disabled={isCalculatingPrice || !checkInDate || !checkOutDate}
                  />

                  {priceError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm">{priceError}</p>
                    </div>
                  )}
                  
                  <p className="text-center text-sm text-gray-600">
                    You won't be charged yet
                  </p>

                  {/* Price Breakdown */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>${property.pricePerNight} x {getNights()} night{getNights() > 1 ? 's' : ''}</span>
                      <span>${calculateTotalPrice()}</span>
                    </div>
                    {property.cleaningFee > 0 && (
                      <div className="flex justify-between">
                        <span>Cleaning fee</span>
                        <span>${property.cleaningFee}</span>
                      </div>
                    )}
                    {property.extraGuestFee > 0 && guests > 1 && (
                      <div className="flex justify-between">
                        <span>Extra guest fee</span>
                        <span>${property.extraGuestFee * (guests - 1)}</span>
                      </div>
                    )}
                    {property.securityDeposit > 0 && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Security deposit (refundable)</span>
                        <span>${property.securityDeposit}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${calculateTotalPrice() + (property.cleaningFee || 0) + ((property.extraGuestFee || 0) * Math.max(0, guests - 1))}</span>
                    </div>
                    {property.securityDeposit > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        Security deposit of ${property.securityDeposit} will be held but refunded after checkout
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        property={property}
        bookingData={{
          propertyId: property._id,
          checkIn: checkInDate?.toISOString(),
          checkOut: checkOutDate?.toISOString(),
          numberOfGuests: guests
        }}
        pricing={pricing}
        onSuccess={handlePaymentSuccess}
        onClose={handlePaymentClose}
      />
    </div>
  )
}