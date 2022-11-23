import axios from 'axios'
import { Zone } from '../types'
import { ForecastResponse, GridPointResponse } from './responses'

declare const WEATHER_URL: string

export interface RequestConfig {
  baseUrl: string
  limit: number
}

export const formatUrl = (config: RequestConfig, urlPath: string) =>
  `${config.baseUrl}/${urlPath}`

export const simpleGet = async (config: RequestConfig, urlPath: string) => {
  const response = await axios.get(formatUrl(config, urlPath))
  if (response.status != 200) {
    throw new Error(response.statusText)
  }
  return response.data
}

export async function getAllItems(requestLimit: number, propertyKey: string, url: string, accumulator: Zone[] = []): Promise<Array<Zone>> {
  const response = await axios.get(url)
  if (response.status == 200) {
    let items = response.data[propertyKey]
    let nextAccumulator = accumulator.concat(items)
    if (items.length < requestLimit)
      return nextAccumulator

    return getAllItems(requestLimit, propertyKey, response.data.pagination.next, nextAccumulator)
  } else {
    throw new Error(response.statusText)
  }
}

export function getZones(config: RequestConfig, province: string) {
  return getAllItems(config.limit, 'features', formatUrl(config, `zones?area=${province}`))
}

export async function getForecastFromGridPoints(config: RequestConfig, office: string, x: number, y: number): Promise<ForecastResponse> {
  return (await simpleGet(config, `gridpoints/${office}/${x},${y}/forecast`)) as ForecastResponse
}

export async function getZoneDetails(config: RequestConfig, zoneId: string): Promise<Zone> {
  return (await simpleGet(config, `zones/forecast/${zoneId}`)) as Zone
}

export async function getForecastFromLatLong(config: RequestConfig, lat: number, long: number): Promise<ForecastResponse> {
  // There is a bug with the weather API where the longitude and latitude parameters are backwards.
  // If the arguments are provided in the order the API specifies then the API returns a 400.
  // This bug is confirmed in that the output coordinates (response data)
  // have the opposite order of the input coordinates (request data).
  // https://api.weather.gov/points/39.8573,-105.1933 leads to returned coordinates of ~ -105.1933,39.8573

  // https://www.weather.gov/documentation/services-web-api#/default/point is the link to
  // the relevant API documentation except that website is currently broken
  // and won't actually navigate to that tab and anchor.
  const gridPointData = (await simpleGet(config, `points/${long},${lat}`)) as GridPointResponse
  const { gridId, gridX, gridY } = gridPointData.properties
  return getForecastFromGridPoints(config, gridId, gridX, gridY)
}

export function defaultRequestConfig(): RequestConfig {
  return {
    baseUrl: WEATHER_URL,
    limit: 500,
  }
}
