import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import Genres from './Genres'

const Books = ({ show }) => {
  const [ genre, setGenre ] = useState(null)
  const { loading, data, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !show
  })
  
  useEffect(() => { refetch() }, [genre])

  if (loading)  {
    return <div>loading...</div>
  }

  if (!show) {
    return null
  }

  const books = data.allBooks

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Genres setGenre={setGenre} />
    </div>
  )
}

export default Books
