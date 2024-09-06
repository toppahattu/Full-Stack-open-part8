import { useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import { LOGIN } from "../queries"

const Login = ( { setError, setToken, setPage, show} ) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const [login, result] = useMutation(LOGIN, {
    onError: (err) => {
      setError(err.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('books-user-token', token)
    }
  }, [result.data])

  const submit = async (e) => {
    e.preventDefault()
    login({ variables: { username, password } })
    setPage('books')
  }

  if (!show) {
    return null
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label>
          Username:
          <input type="text" name="user" onChange={({ target }) => setUsername(target.value)} />
        </label>        
      </div>
      <div>
        <label>
          Password:
          <input type="password" name="pwd" onChange={({ target }) => setPassword(target.value)} />
        </label>
        
      </div>
      <div>
        <input type="submit" value="Login"/>
      </div>
    </form>
  )
}

export default Login