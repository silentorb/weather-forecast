import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { useEffect, useState } from 'react'
import { defaultRequestConfig, getZones } from './query'
import Select from 'react-select'
import { usProvinces } from './data'
import { LoadingAnimation } from './loading-animation'
import { Zone } from './types'
import * as _ from 'lodash'

function formatZoneOptions(zones: Zone[]) {
  const grouped = Object.entries(_.groupBy(zones, 'properties.id'))
  return grouped
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(entry => ({
      value: entry[0],
      label: entry[1][0].properties.name,
    }))
}

const App = () => {
  const requestConfig = defaultRequestConfig()
  const [province, setProvince] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [zones, setZones] = useState<Zone[]>([])
  const [selectedZone, setSelectedZone] = useState<Zone | undefined>(undefined)

  useEffect(() => {
    async function process() {
      // setIsLoading(true)
      const zones = await getZones(requestConfig, province)
      console.log('stations', province, zones.length)
      setZones(zones)
      // setIsLoading(false)
    }

    if (province) {
      process()
    }
  }, [province])

  return <div>
    <div>
      <Select
        options={usProvinces}
        onChange={option => setProvince(option.value)
        }
      />
    </div>
    <div>
      {
        province && zones &&
        <Select
          options={formatZoneOptions(zones)}
          onChange={option =>
            setSelectedZone(zones.filter(z => z.properties.id == option.value)[0])
          }
        />
      }
    </div>
    <div>
      {
        JSON.stringify(selectedZone, undefined, 2)
      }
    </div>
    {isLoading && <LoadingAnimation/>}
  </div>
}

function main() {
  const root = ReactDOM.createRoot(
    document.getElementById('app')
  )
  root.render(<App/>)
}

main()
