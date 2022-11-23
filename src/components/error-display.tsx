import * as React from 'react'
import styled from 'styled-components'
import { AxiosError } from 'axios'

interface Props {
  error: AxiosError
}

const ErrorBlock = styled.div`
  font-size: 24px;
  text-align: center;
  margin: 50px;
`

export const HttpErrorDisplay = (props: Props) => {
  const { error } = props
  const { status } = error.response
  const message = status >= 400 && status < 500
    ? 'the app has run into an error'
    : 'the app is unable to connect to the weather server'

  return <ErrorBlock>
    We're sorry, {message}
  </ErrorBlock>
}
