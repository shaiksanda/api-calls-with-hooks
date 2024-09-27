import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import LeaderboardTable from '../LeaderboardTable'

import {
  LeaderboardContainer,
  LoadingViewContainer,
  ErrorMessage,
} from './styledComponents'

const Leaderboard = () => {
  // Your code goes here...
  const [data, setData] = useState([])
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const url = 'https://apis.ccbp.in/leaderboard' // Intentionally incorrect URL
      const options = {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU',
        },
      }

      try {
        const response = await fetch(url, options)
        if (!response.ok) {
          throw new Error('Failed to fetch data') // Throw an error for non-2xx responses
        }
        const responseData = await response.json()
        const updatedData = responseData.leaderboard_data.map(each => ({
          id: each.id,
          name: each.name,
          language: each.language,
          score: each.score,
          rank: each.rank,
          profileImgUrl: each.profile_image_url,
          timeSpent: each.time_spent,
        }))

        setData(updatedData)
      } catch (error) {
        // Set error state with the error message
        setIsError(true)
        setErrorMsg(error.message) // Capture the error message from the catch block
      } finally {
        // Ensure loading state is reset
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const renderLoaderView = () => (
    <LoadingViewContainer>
      <Loader type="ThreeDots" />
    </LoadingViewContainer>
  )

  const renderSuccessView = () => <LeaderboardTable leaderboardData={data} />
  const renderFailureView = () => <ErrorMessage>{errorMsg}</ErrorMessage>
  const renderLeaderboard = () => {
    // Your code goes here...
    switch (true) {
      case isLoading:
        return renderLoaderView()
      case isError:
        return renderFailureView()
      default:
        return renderSuccessView()
    }
  }

  return <LeaderboardContainer>{renderLeaderboard()}</LeaderboardContainer>
}

export default Leaderboard
