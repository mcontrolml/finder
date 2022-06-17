import { Route, Routes, Navigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import STATE from './state'

import TopToggle from './components/darkMode/TopToggle'
import Network from './pages/network/Network'
import './App.css'
import { Header } from './components/header/Header'
import Endpoint from './pages/endpoint/Endpoint'
import Validators from './pages/validators/Validators'
import Ibc from './pages/ibc/Ibc'
import Explorer from './pages/explorer/Explorer'
import Address from './pages/explorer/address/Address'
import Tx from './pages/explorer/tx/Tx'
import Validator from './pages/explorer/validator/Validator'

function App() {
  const darkMode = useRecoilValue(STATE.darkMode)

  return (
    <div className={darkMode ? 'app dark' : 'app light'}>
      <TopToggle />
      <Header />
      <Routes>
        <Route path='/validators' element={<Validators />} />
        <Route path='/ibc' element={<Ibc />} />
        <Route path='/network/:tab' element={<Network />} />
        <Route path='/endpoints/:chain' element={<Endpoint />} />
        <Route path='/:network/validator/:address' element={<Validator />} />
        <Route path='/:network/tx/:txhash' element={<Tx />} />
        <Route path='/:network/wallet/:address' element={<Address />} />
        <Route path='/:network' element={<Explorer />} />
        <Route path='*' element={<Navigate to='/mainnet' replace={true} />} />
      </Routes>
    </div>
  )
}

export default App
