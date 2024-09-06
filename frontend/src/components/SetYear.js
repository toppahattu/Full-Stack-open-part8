import { useState } from 'react'
import { useMutation } from '@apollo/client'
import Select from 'react-select'
import { ALL_AUTHORS, SET_YEAR } from '../queries'

const SetYear = ({ authors, setError }) => {
  const [author, setAuthor] = useState({})
  const [born, setBorn] = useState('')

  const [ updateAuthor, result ] = useMutation(SET_YEAR, {
    onError: (err) => {
      setError(err.graphQLErrors[0].message)
    },
    refetchQueries: [ ALL_AUTHORS ]
  })

  const submit = async (event) => {
    event.preventDefault()

    updateAuthor({ variables: { name: author.name, setBornTo: born } })

    setAuthor({})
    setBorn('')
  }

  return (
    <div>
      <h2>
        Set birthyear
      </h2>
      <form onSubmit={submit}>
        <Select
          options={authors}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.name}
          value={author}
          onChange={(option) => setAuthor(option)}
        />
        <div>
          born
          <input
            type='number'
            value={born}
            onChange={({ target }) => setBorn(parseInt(target.value))}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default SetYear