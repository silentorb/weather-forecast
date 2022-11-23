import axios from 'axios'
import { Zone } from './types'

declare const WEATHER_URL: string

export interface RequestConfig {
  baseUrl: string
  limit: number
}

export const formatUrl = (config: RequestConfig, urlPath: string) =>
  `${config.baseUrl}/${urlPath}`

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

export function defaultRequestConfig(): RequestConfig {
  return {
    baseUrl: WEATHER_URL,
    limit: 500,
  }
}
