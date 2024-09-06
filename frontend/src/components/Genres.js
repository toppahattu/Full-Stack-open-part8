import { useQuery } from "@apollo/client"
import { ALL_GENRES } from "../queries"

const Genres = ({ setGenre }) => {
  const { loading, data } = useQuery(ALL_GENRES)
  if (loading)  {
    return <div>loading...</div>
  }
  const genres = data.allGenres
  return (
    <>
      {genres.map((g) => (
        <button key={g} onClick={ () => setGenre(g) }>{g}</button>
      ))}
      <button onClick={ () => setGenre(null) }>all genres</button>
    </>)
}

export default Genres