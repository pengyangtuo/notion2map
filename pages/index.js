import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

export default function Map() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markers = useRef({})
  const [locations, setLocations] = useState({})

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations')
      const newLocations = await response.json()
      
      setLocations(newLocations)
    } catch (error) {
      console.error('Error polling locations:', error)
    }
  }

  // This effect will only run when locations state actually changes
  useEffect(() => {
    console.log('Locations updated:', locations)
    if (mapInstanceRef.current) {
      updateMarkers(locations)
    }
  }, [locations])

  // Function to update markers
  const updateMarkers = (locations) => {
    // Compare IDs between newLocations and existing markers
    const currentLocationIds = new Set(Object.keys(markers.current))
    const newLocationIds = new Set(Object.keys(locations))

    // Check if there are any differences
    const locationsIdsToRemove = [...currentLocationIds].filter(id => !newLocationIds.has(id))
    console.log('IDs to remove:', locationsIdsToRemove)
    const locationsIdsToAdd = [...newLocationIds].filter(id => !currentLocationIds.has(id))
    console.log('IDs to add:', locationsIdsToAdd)

    // Remove old markers
    removeMarkers(locationsIdsToRemove)

    // add new markers
    createMarkers(locationsIdsToAdd, locations)
  }

  const removeMarkers = (locationsIds) => {
    locationsIds.forEach(id => {
      if (markers.current[id]) {
        markers.current[id].setMap(null)
        delete markers.current[id]
      }
    })
  }

  // Create markers for new addresses
  const createMarkers = (locationsIdsToAdd, locations) => {
    const map = mapInstanceRef.current
    if (!map) return

    const geocoder = new google.maps.Geocoder()
    const bounds = new google.maps.LatLngBounds()

      // Add new markers
      Object.entries(locations).filter(([id]) => locationsIdsToAdd.includes(id)).map(([,location]) => {
        geocoder.geocode({ address: location.place }, (results, status) => {
          if (status === 'OK') {
            const marker = new google.maps.Marker({
              map,
              position: results[0].geometry.location,
              title: location.name,
              animation: google.maps.Animation.DROP
            })
            
            markers.current[location.id] = marker
            bounds.extend(results[0].geometry.location)
          } else {
            console.error('Geocoding failed for:', location.place, status)
          }
        })
      })

      // Only adjust bounds if we added new markers
      if (locations.length > 0) {
        map.fitBounds(bounds)
    }
  }

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly'
    })

    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary("maps")
      const map = new Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
      })
      mapInstanceRef.current = map
      
      // Initial fetch
      fetchLocations()

      // Set up polling to fetch locations every 1 second
      const interval = setInterval(fetchLocations, 1000)
      
      return () => clearInterval(interval)
    })
  }, [])

  return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />
}

