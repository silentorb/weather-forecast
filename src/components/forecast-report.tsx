import * as React from 'react'
import { useEffect, useState } from 'react'
import { ErrorHandler, ForecastPeriods, Zone } from '../types'
import { getAverageCenter } from '../utility'
import { getForecastFromLatLong, getZoneDetails, RequestConfig } from '../web-services/requests'
import styled from 'styled-components'

interface Props {
  zone: Zone
  requestConfig: RequestConfig
  onError: ErrorHandler
}

const PeriodsContainer = styled.div`
  display: flex;
  gap: 30px;
`

const PeriodBlock = styled.div`
  background-color: #FFF;
  margin: 30px 0 30px 0;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 30px;
  
  h3 {
    font-size: 32px;
  }
`

const TemperatureBlock = styled.div`
margin: 20px 0 20px 0;
`

const TemperatureValue = styled.span`
  font-weight: bold;
  font-size: 24px;
`

export const ForecastReport = (props: Props) => {
  const { requestConfig, onError, zone } = props
  const [periods, setPeriods] = useState<ForecastPeriods>([])

  useEffect(() => {
    async function fetch() {
      const geometry = zone.geometry || (await getZoneDetails(requestConfig, zone.properties.id))?.geometry
      if (!geometry)
        throw new Error(`Could not get geometry for zone ${zone.properties.id}`)

      const coordinates = getAverageCenter(geometry)
      const forecast = await getForecastFromLatLong(requestConfig, coordinates[0], coordinates[1])
      setPeriods(forecast.properties.periods)
      onError(undefined)
    }

    fetch()
      .catch(onError)
  }, [zone?.properties?.id])

  const periodBlocks = periods
    .filter(p => p.isDaytime)
    .slice(0, 5)
    .map(period => (
      <PeriodBlock key={period.number}>
        <h3>{period.name}</h3>
        <div><img src={period.icon.replace(/size=medium/, 'size=large')} alt=''/></div>
        <TemperatureBlock>
          <TemperatureValue>{period.temperature}{period.temperatureUnit}</TemperatureValue> {period.temperatureTrend}
        </TemperatureBlock>
        <div>Wind speed: {period.windSpeed} {period.windDirection}</div>
      </PeriodBlock>
    ))

  return <PeriodsContainer>
    {periodBlocks}
  </PeriodsContainer>
}
