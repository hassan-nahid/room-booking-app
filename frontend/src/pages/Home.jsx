import PropertyCard from "../components/PropertyCard"
import { useProperties } from "../hooks/useProperties"

// Transform API data to match PropertyCard component props
const transformPropertyData = (apiProperty) => {
  return {
    id: apiProperty._id,
    images: apiProperty.images || [],
    title: apiProperty.title,
    location: `${apiProperty.location.city}, ${apiProperty.location.country}`,
    price: apiProperty.pricePerNight,
    rating: apiProperty.rating || 0,
    nights: apiProperty.minimumStay || 1,
    isGuestFavorite: apiProperty.isGuestFavorite || false,
    // Additional data that might be useful
    propertyType: apiProperty.propertyType,
    category: apiProperty.category,
    maxGuests: apiProperty.maxGuests,
    bedrooms: apiProperty.bedrooms,
    bathrooms: apiProperty.bathrooms,
  }
}

export default function Home() {
  // Fetch properties from API
  const { data: propertiesResponse, isLoading, error } = useProperties()

  // Transform the API data
  const properties = propertiesResponse?.data ? propertiesResponse.data.map(transformPropertyData) : []

  // Split properties into two sections like the original design
  const firstSectionProperties = properties.slice(0, 7) // First 7 properties for "Popular homes"
  const secondSectionProperties = properties.slice(7, 14) // Next 7 properties for "Available next month"

  return (
    <div className="min-h-screen bg-white">
      {/* <Header /> */}
      <main>
        <div className="relative">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8">
            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="flex items-center justify-center min-h-[400px] flex-col">
                <div className="text-red-500 text-xl font-semibold mb-4">
                  Failed to load properties
                </div>
                <div className="text-gray-600 mb-4">
                  {error.message || 'Something went wrong. Please try again later.'}
                </div>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Main content - only show when not loading and no error */}
            {!isLoading && !error && (
              <>
                {/* First Section - Popular homes */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Popular homes in Dhaka District</h2>
                  <button className="text-gray-900 hover:underline font-medium">Show all</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-12">
                  {firstSectionProperties.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>

                {/* Second Section - Available next month */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Available next month in Kuala Lumpur</h2>
                  <button className="text-gray-900 hover:underline font-medium">Show all</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
                  {secondSectionProperties.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>

                {/* Empty state */}
                {properties.length === 0 && (
                  <div className="flex items-center justify-center min-h-[400px] flex-col">
                    <div className="text-gray-500 text-xl font-semibold mb-4">
                      No properties available
                    </div>
                    <div className="text-gray-400">
                      Check back later for new listings.
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  )
}
