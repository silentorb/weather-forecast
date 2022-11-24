import * as React from 'react'
import styled from 'styled-components'
import { ForecastPeriod } from '../types'

const HourlyPeriodsContainer = styled.div`
  display: flex;
  gap: 30px;
  overflow: auto;
`

const HourlyPeriodsItem = styled.div`
  background-color: #FFF;
  margin: 30px 0 30px 0;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    font-size: 24px;
  }
`

const TemperatureBlock = styled.div`
  margin: 20px 0 20px 0;
`

const TemperatureValue = styled.span`
  font-weight: bold;
  font-size: 24px;
`

interface Props {
  periods: ForecastPeriod[]
}

function getHourlyPeriodName(period: ForecastPeriod): string {
  const hour = new Date(period.startTime).getHours()
  const suffix = hour > 12 ? 'pm' : 'am'
  const radialHour = hour % 12
  const withTwelve = radialHour == 0 ? 12 : radialHour
  return `${withTwelve}${suffix}`
}

export const HourlyPeriods = (props: Props) => {
  const { periods } = props
  const items = periods.slice(0, 24)
    .map(period => (
      <HourlyPeriodsItem key={period.number}>
        <h3>{getHourlyPeriodName(period)}</h3>
        <div><img src={period.icon.replace(/size=medium/, 'size=large')} alt=""/></div>
        <TemperatureBlock>
          <TemperatureValue>{period.temperature}{period.temperatureUnit}</TemperatureValue> {period.temperatureTrend}
        </TemperatureBlock>
      </HourlyPeriodsItem>
    ))

  return <HourlyPeriodsContainer>
    {items}
  </HourlyPeriodsContainer>
}
