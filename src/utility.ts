import * as queryString from 'query-string'
import { Coordinate, Geometry } from './types'
import * as _ from 'lodash'

export function getQueryParams(): any {
  return queryString.parse(location.search)
}

export function setQueryParams(args: any) {
  window.history.pushState({}, '', '?' + queryString.stringify(args))
}

export function getAverageCenter(geometry: Geometry): Coordinate {
  // Coordinates can be stored in one of two formats, maybe more.
  const coordinates: Coordinate[] = geometry.type == 'MultiPolygon'
    ? _.flatten(geometry.coordinates).map(item => item[0])
    : geometry.coordinates[0]

  const reduce = (axis: number) =>
    coordinates.reduce((a, b) => a + b[axis], 0) / coordinates.length

  return [reduce(0), reduce(1)]
}

export function isDebugging() {
  return getQueryParams().debug == 'true'
}
