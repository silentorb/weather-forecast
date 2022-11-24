import { getZones, RequestConfig } from '../web-services'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { ErrorHandler, Zone } from '../types'
import Select from 'react-select'
import { usProvinces } from '../data'
import { LoadingAnimation } from './loading-animation'
import * as _ from 'lodash'
import { Dictionary } from 'lodash'
import { isDebugging, setQueryParams } from '../utility'
import { ForecastReport } from './forecast-report'
import styled from 'styled-components'
import { HourlyPeriods } from './hourly-periods'

type ZoneDictionary = Dictionary<Zone[]>

function organizeZones(zones: Zone[]): ZoneDictionary {
  // It looks like forecasts can not be retrieved for zones that do not have any observation stations,
  // so filter those out.
  const filtered = zones.filter(zone => zone.properties.observationStations.length > 0)
  return _.groupBy(filtered, 'properties.id')
}

const getZoneCountSuffix = (count: number) =>
  count > 1 ? ` (${count} zones)` : ''

function formatZoneOptions(zones: ZoneDictionary) {
  const debugging = isDebugging()

  return Object.entries(zones)
    .map(entry => ({
      value: entry[0],
      label: debugging
        ? `${entry[1][0].properties.name}${getZoneCountSuffix(entry[1].length)} ${entry[1][0].properties.observationStations.length}`
        : entry[1][0].properties.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

const PanelStyle = styled.div`
  padding: 30px;
`

interface Props {
  province: string
  zone: string
  requestConfig: RequestConfig
  onError: ErrorHandler
  error?: Error
}

export const ZoneSelect = (props: Props) => {
  const { requestConfig, onError, error } = props
  const [province, setProvince] = useState<string | undefined>(props.province)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [zones, setZones] = useState<ZoneDictionary>({})
  const [zoneOptions, setZoneOptions] = useState<any[]>([])
  const [zone, setZone] = useState<string | undefined>(props.zone)

  useEffect(() => {
    async function fetch() {
      const newZones = await getZones(requestConfig, province)
      const groupedZones = organizeZones(newZones)
      setZones(groupedZones)
      setZoneOptions(formatZoneOptions(groupedZones))
      onError(undefined)
    }

    if (province) {
      fetch()
        .catch(onError)
    }
  }, [province])

  useEffect(() => {
    setQueryParams({ province, zone })
  }, [province, zone])

  const zoneRecords = zones[zone]

  const provinceOption = usProvinces.filter(p => p.value == province)[0]

  return <PanelStyle>
    <div>
      <Select
        placeholder="Select a State"
        value={provinceOption}
        options={usProvinces}
        onChange={option => {
          setProvince(option.value)
          setZone(undefined)
        }}
      />
    </div>
    <div style={{ marginTop: '30px' }}>
      {
        province && zones &&
        <Select
          placeholder={`Select a County or Zone within ${provinceOption?.label}`}
          value={zoneOptions.filter(z => z.value == zone)[0] || null} /* Select ignores undefined */
          options={zoneOptions}
          onChange={option => {
            onError(undefined)
            setZone(option.value)
          }}
        />
      }
    </div>
    {
      /* For right now just grab the first sub-zone */
      !error && zoneRecords && zoneRecords.length > 0 && <ForecastReport
        zone={zoneRecords[0]}
        requestConfig={requestConfig}
        onError={onError}
      />
    }
    {isLoading && <LoadingAnimation/>}
  </PanelStyle>
}
