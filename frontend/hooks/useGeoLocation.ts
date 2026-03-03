// GPS取得専用
//初回マウント時に自動取得


"use client"

import { useEffect, useState } from "react"

type GeoLocationState = {
  latitude: number | null
  longitude: number | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export const useGeoLocation = (): GeoLocationState => {
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported")
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )
  }

  // 初回マウント時に取得
  useEffect(() => {
    getLocation()
  }, [])

  return {
    latitude,
    longitude,
    loading,
    error,
    refetch: getLocation,
  }
}

// UI側の使い方
// navigator.geolocation.getCurrentPosition(
//   success,
//   error,
//   { enableHighAccuracy: true }
// )
