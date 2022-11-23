import * as React from 'react'
import { useState } from 'react'
import * as ReactDOM from 'react-dom/client'
import { getQueryParams } from './utility'
import { defaultRequestConfig } from './web-services'
import { HttpErrorDisplay, ZoneSelect } from './components'
import { createGlobalStyle } from 'styled-components'
import { AxiosError } from 'axios'

const GlobalStyle = createGlobalStyle`  
  body {
    margin: 0;
    font-family: Verdana, sans-serif;
    background-color: #EEE;
  }

  h1 {
    text-align: center;
    margin: 0;
    padding: 20px 0 20px 0;
    font-size: 42px;
    background-color: #FFF;
  }
`

const App = () => {
  const params = getQueryParams()
  const [error, setError] = useState<Error | AxiosError | undefined>(undefined)
  return <div>
    <GlobalStyle/>
    <h1>Weather Caster</h1>
    <ZoneSelect
      province={params.province}
      zone={params.zone}
      requestConfig={defaultRequestConfig()}
      onError={setError}
      error={error}
    />
    {
      error && 'response' in error && <HttpErrorDisplay error={error}/>
    }
  </div>
}

function main() {
  const root = ReactDOM.createRoot(
    document.getElementById('app')
  )
  root.render(<App/>)
}

main()
