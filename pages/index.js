import { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

export default function Map() {
    console.log("i'm here")
  const mapRef = useRef(null)

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly'
    })

    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary("maps")
      const locations = await fetch('/api/locations').then(res => res.json())
      console.log(locations)
      
      const map = new Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
      })

      const bounds = new google.maps.LatLngBounds()
      
      // For each location, create a marker and extend bounds
      locations.forEach(async location => {
        // If you have addresses instead of coordinates, use Geocoding service
        const geocoder = new google.maps.Geocoder()
        
        geocoder.geocode({ address: location.place }, (results, status) => {
            console.log(results);
          if (status === 'OK') {
            const marker = new google.maps.Marker({
              map,
              position: results[0].geometry.location,
              title: location.name
            })
            
            bounds.extend(results[0].geometry.location)
            map.fitBounds(bounds)
          }
        })
      })
    })
  }, [])

  return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />
}