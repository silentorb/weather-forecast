import { ForecastPeriod } from '../types'

export interface GridPointResponse {
  properties: {
    gridId: string
    gridX: number
    gridY: number
  }
}

export interface ForecastResponse {
  properties: {
    periods: ForecastPeriod[]
  }
}
