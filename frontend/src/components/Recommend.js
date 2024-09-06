import { useQuery } from "@apollo/client"
import { ME, ALL_BOOKS } from '../queries'
import { useEffect, useState } from "react"

const Recommend = ({ show }) => {
  const { data: meData, loading: meLoading } = useQuery(ME, {
    skip: !show
  })
  const [ favorite, setFavorite ] = useState(null)
  
  useEffect(() => {
    if (meData && meData.me) {
      setFavorite(meData.me.favoriteGenre)
    }
  }, [meData])

  const { data: bookData, loading: bookLoading } = useQuery(ALL_BOOKS, {
    variables: { genre: favorite },
    skip: !favorite
  })

  if (meLoading || bookLoading)  {
    return <div>loading...</div>
  }

  if (!show) {
    return null
  }

  const books = bookData ? bookData.allBooks : []

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{favorite}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend