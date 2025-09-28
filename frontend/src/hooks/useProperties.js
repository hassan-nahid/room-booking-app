import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertiesApi } from '../services/api'

// Query keys
export const QUERY_KEYS = {
  PROPERTIES: 'properties',
  PROPERTY: 'property',
}

// Custom hook to fetch all properties
export const useProperties = (params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROPERTIES, params],
    queryFn: () => propertiesApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// Custom hook to fetch single property
export const useProperty = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROPERTY, id],
    queryFn: () => propertiesApi.getById(id),
    enabled: !!id, // Only run query if ID exists
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  })
}

// Custom hook to search properties
export const usePropertySearch = (searchParams, enabled = true) => {
  // Filter out empty values
  const cleanedParams = Object.fromEntries(
    Object.entries(searchParams).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  );

  return useQuery({
    queryKey: [QUERY_KEYS.PROPERTIES, 'search', cleanedParams],
    queryFn: () => propertiesApi.search(cleanedParams),
    enabled: enabled && Object.keys(cleanedParams).length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    cacheTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  })
}

// If you need mutations for creating/updating properties later
export const useCreateProperty = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (propertyData) => propertiesApi.create(propertyData),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROPERTIES] })
    },
  })
}

export const useUpdateProperty = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => propertiesApi.update(id, data),
    onSuccess: (data, variables) => {
      // Update specific property cache
      queryClient.setQueryData([QUERY_KEYS.PROPERTY, variables.id], data)
      // Invalidate properties list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROPERTIES] })
    },
  })
}