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
    // Location data for grouping
    city: apiProperty.location.city,
    country: apiProperty.location.country,
    district: apiProperty.location.district || apiProperty.location.city,
  }
}

// Group properties by location and create dynamic sections
const createDynamicSections = (properties) => {
  const sections = []
  
  // Group by district/city
  const cityGroups = {}
  const countryGroups = {}
  
  properties.forEach(property => {
    const city = property.city
    const country = property.country
    const district = property.district
    
    // Group by city/district
    const locationKey = district || city
    if (!cityGroups[locationKey]) {
      cityGroups[locationKey] = []
    }
    cityGroups[locationKey].push(property)
    
    // Group by country
    if (!countryGroups[country]) {
      countryGroups[country] = []
    }
    countryGroups[country].push(property)
  })
  
  // Create sections based on property count
  Object.entries(cityGroups).forEach(([location, locationProperties]) => {
    if (locationProperties.length >= 5) {
      sections.push({
        title: `Popular homes in ${location}`,
        properties: locationProperties.slice(0, 7),
        type: 'city'
      })
    }
  })
  
  // If we have less than 2 city-based sections, create country-based sections
  if (sections.length < 2) {
    Object.entries(countryGroups).forEach(([country, countryProperties]) => {
      if (countryProperties.length >= 3 && sections.length < 2) {
        sections.push({
          title: `Available next month in ${country}`,
          properties: countryProperties.slice(0, 7),
          type: 'country'
        })
      }
    })
  }
  
  // If still not enough sections, use remaining properties
  if (sections.length === 0 && properties.length > 0) {
    sections.push({
      title: 'Featured Properties',
      properties: properties.slice(0, 7),
      type: 'featured'
    })
  }
  
  if (sections.length === 1 && properties.length > 7) {
    const usedPropertyIds = new Set(sections[0].properties.map(p => p.id))
    const remainingProperties = properties.filter(p => !usedPropertyIds.has(p.id))
    
    if (remainingProperties.length > 0) {
      sections.push({
        title: 'More Great Places to Stay',
        properties: remainingProperties.slice(0, 7),
        type: 'additional'
      })
    }
  }
  
  return sections
}

export default function Home() {
  // Fetch properties from API
  const { data: propertiesResponse, isLoading, error } = useProperties()

  // Transform the API data
  const properties = propertiesResponse?.data ? propertiesResponse.data.map(transformPropertyData) : []

  // Create dynamic sections based on property distribution
  const dynamicSections = createDynamicSections(properties)

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
                {/* Dynamic Sections */}
                {dynamicSections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className={sectionIndex < dynamicSections.length - 1 ? "mb-12" : ""}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                      <button 
                        className="text-gray-900 hover:underline font-medium"
                        onClick={() => {
                          // Navigate to search results with location filter
                          const searchQuery = section.type === 'city' ? 
                            section.title.replace('Popular homes in ', '').replace('Available next month in ', '') :
                            section.type === 'country' ?
                            section.title.replace('Available next month in ', '').replace('Popular homes in ', '') :
                            'all'
                          window.location.href = `/search?location=${encodeURIComponent(searchQuery)}`
                        }}
                      >
                        Show all
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
                      {section.properties.map((property) => (
                        <PropertyCard key={property.id} {...property} />
                      ))}
                    </div>
                  </div>
                ))}

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

                {/* Show all properties button if there are many properties */}
                {properties.length > 14 && (
                  <div className="text-center mt-12">
                    <button 
                      onClick={() => window.location.href = '/search'}
                      className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      Explore All Properties ({properties.length})
                    </button>
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
