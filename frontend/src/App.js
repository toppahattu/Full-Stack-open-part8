import { useState } from 'react'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from './queries'
import Authors from './components/Authors'
import Books from './components/Books'
import Login from './components/Login'
import Notify from './components/Notify'
import NewBook from './components/NewBook'
import Recommend from './components/Recommend'

export const updateCache = (cache, query, addedBook) => {
  const uniqueByTitleandAuthor = (books) => {
    let seen = new Set()
    return books.filter((b) => {
      let id = `${b.author.name}-${b.title}`
      return seen.has(id) ? false : seen.add(id)
    })
  }
  cache.updateQuery(query, (data) => {
    if (!data) {
      return { allBooks: [addedBook] }
    }
    const { allBooks } = data
    return {
      allBooks: uniqueByTitleandAuthor(allBooks.concat(addedBook))
    }
  })
}

const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')

  const result = useQuery(ALL_AUTHORS)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(`New book by ${addedBook.author.name} added: ${addedBook.title}`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
  })  

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }
  
  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <Notify errorMessage={errorMessage}/>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token ? (            
          <button onClick={() => setPage('login')}>login</button>
        ) : (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        )}
      </div>        

      <Authors authors={result.data.allAuthors} setError={notify} show={page === 'authors'} />

      <Books show={page === 'books'} />

      <Login setError={notify} setToken={setToken} setPage={setPage} show={page === 'login'} />

      <NewBook setError={notify} show={page === 'add'} />

      <Recommend show={page === 'recommend'} />
      
    </div>
  )
}

export default App
