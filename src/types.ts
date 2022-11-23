export type Coordinate = [number, number]

export interface PolygonGeometry {
  type: 'Polygon'

  // There seems to be a bug in the weather API where coordinates are wrapped in an extra array
  coordinates: [Coordinate[]]
}

export interface MultiPolygonGeometry {
  type: 'MultiPolygon'

  // There seems to be a bug in the weather API where coordinates are wrapped in an extra array
  coordinates: Array<[Coordinate[]]>
}

export type Geometry = PolygonGeometry | MultiPolygonGeometry

export interface ZoneProperties {
  id: string
  name: string
  observationStations: string[]
}

export interface Zone {
  geometry: Geometry
  properties: ZoneProperties
}

export interface ForecastPeriod {
  number: number
  name: string
  startTime: string
  endTime: string
  isDaytime: boolean
  temperature: number,
  temperatureUnit: string
  temperatureTrend: string
  windSpeed: string
  windDirection: string
  icon: string
  shortForecast: string
  detailedForecast: string
}

export type ForecastPeriods = ForecastPeriod[]

export type ErrorHandler = (error: Error | undefined) => void
