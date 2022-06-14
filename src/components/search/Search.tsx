import { useNavigate, useParams } from 'react-router-dom'
import './Search.css'

export default function Search() {
  const { network } = useParams()
  const navigate = useNavigate()

  function search(e: any) {
    e.preventDefault()
    const search = document.getElementById('search') as HTMLInputElement
    const searchValue = search.value
    if (searchValue.startsWith('terra1')) {
      navigate(`/${network}/wallet/${searchValue}`)
    } else {
      navigate(`/${network}/tx/${searchValue.toUpperCase()}`)
    }
  }

  return (
    <form className='search' onSubmit={search}>
      <i className='bx bx-search'></i>
      <input
        type='text'
        placeholder='Search txhash/address'
        id='search'
        autoComplete='off'
      />
    </form>
  )
}
