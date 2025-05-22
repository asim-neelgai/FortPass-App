import { useRef, useState } from 'react'
import { Alert } from 'react-native'
import { generateClient } from 'aws-amplify/api'

interface UseQueryReturnType<T> {
  data: T | null
  error: boolean
  loading: boolean
  request: (
    queryVariables?: Record<string, any>,
    callbackBeforeSettingResponse?: (responseToSetInData: T | null) => T | null
  ) => Promise<RequestReturnType<T>>
  nextTokenRef: React.MutableRefObject<string | null>
}

interface RequestReturnType<T> {
  data: T | null
  error: boolean
  nextTokenRef: React.MutableRefObject<string | null>
}

export interface QueryFunctionReturnType<T> {
  type: 'query' | 'mutation'
  name: string
  query: string
  returnType: T
}

export const parseGraphQueryError = (error: any): string => {
  if (error?.errors?.length > 0) {
    return error?.errors[0]?.message
  }
  return (typeof error?.message === 'string') ? error.message : 'Unknown error occurred'
}

export default function useQuery<T> (
  queryFunction: () => QueryFunctionReturnType<T>
): UseQueryReturnType<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const nextTokenRef = useRef<string | null>(null)

  const request = async (
    queryVariables?: Record<string, any>,
    callbackBeforeSettingResponse?: (responseToSetInData: T | null) => T | null
  ): Promise<RequestReturnType<T>> => {
    setLoading(true)
    const { name: queryName, query, type: queryType } = queryFunction()
    console.log(`Executing ${queryType} ${queryName}`)

    const API = generateClient()

    let response: any
    let apiError = false
    try {
      if (queryType === 'mutation') {
        response = await API.graphql({
          query,
          variables: { input: queryVariables }
        })
      } else if (queryType === 'query') {
        response = await API.graphql({
          query,
          variables: queryVariables
        })
      }

      const responseData = response.data[queryName]
      setData((callbackBeforeSettingResponse != null) ? callbackBeforeSettingResponse(responseData) : responseData)
      if (responseData?.nextToken != null) {
        nextTokenRef.current = responseData.nextToken
      }
    } catch (error: any) {
      apiError = true
      console.error(`Error while executing ${queryType} ${queryName}`, error)

      const errorMessage = parseGraphQueryError(error)
      Alert.alert('Something went wrong', errorMessage)
    }

    setLoading(false)
    setError(apiError)
    return { error: apiError, data: response?.data[queryName] !== undefined ? response.data[queryName] : null, nextTokenRef }
  }

  return { data, error, loading, request, nextTokenRef }
}
