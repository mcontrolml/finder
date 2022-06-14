import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import axios from 'axios'

import { VictoryPie } from 'victory'
import { Loading } from './../../components/loading/Loading'

import COUNTRY from './country'
import nodesByCity from './filters/city'
import nodesByCountry from './filters/country'
import nodesByProvider from './filters/provider'

import './Network.css'
import Banner from '../../components/banner/Banner'
import MobileLogo from '../../components/logo/MobileLogo'

function TableItem({
  flag,
  txt,
  number,
}: {
  flag: string
  txt: string
  number: number
}) {
  return (
    <tr>
      <td className='flag__column'>{flag}</td>
      <td style={{ width: '100%' }}>{txt}</td>
      <td className='number__column'>{number}</td>
    </tr>
  )
}

function formatString(str: string, length = 10): string {
  return str.length <= length ? str : str.substring(0, length - 1) + '...'
}

interface NodeInterface {
  country: string
  country_code: string
  city: string
  pos: {
    lat: number
    lon: number
  }
  datacenter: string
  addr: {
    id: string
    ip: string
    port: number
  }
}

export default function Network() {
  const { tab } = useParams()

  const [isLoading, setLoading] = useState(true)
  const [list, setList] = useState<{
    data: NodeInterface[]
    updatedAt: number
  }>({
    data: [],
    updatedAt: 0,
  })

  useEffect(() => {
    ;(async () => {
      const { data } = await axios.get(
        'https://networks.mcontrol.ml/phoenix/nodelist.json',
      )
      setList(data)
      setLoading(false)
    })()
  }, [])

  return (
    <main className='content'>
      <MobileLogo />
      <h1>Network</h1>
      <div className='nav'>
        <NavLink
          to='/network/country'
          className={({ isActive }) =>
            isActive ? 'slink slink__active' : 'slink'
          }
        >
          Country
        </NavLink>
        <NavLink
          to='/network/provider'
          className={({ isActive }) =>
            isActive ? 'slink slink__active' : 'slink'
          }
        >
          Provider
        </NavLink>
        <NavLink
          to='/network/list'
          className={({ isActive }) =>
            isActive ? 'slink slink__active' : 'slink'
          }
        >
          List
        </NavLink>
      </div>
      <Banner />
      {tab !== 'list' && (
        <>
          <div className='content__box'>
            <h3>Nodes by {tab}</h3>
            This is the chat of <b>{(list.data || []).length} nodes</b> in our{' '}
            <b>phoenix-1</b> addrbook, divided for {tab}
            {isLoading ? (
              <Loading />
            ) : (
              <VictoryPie
                style={{
                  labels: {
                    fill: tab === 'provider' ? 'var(--text)' : 'white',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    fontSize: tab === 'provider' ? 12 : 20,
                  },
                }}
                colorScale={[
                  '#3100E0FF',
                  '#3100E0E0',
                  '#3100E0C0',
                  '#3100E0A0',
                  '#3100E080',
                  '#3100E060',
                ]}
                innerRadius={100}
                labelRadius={120}
                labels={({ datum }) => `${datum.flag || datum.name}`}
                data={
                  tab === 'provider'
                    ? nodesByProvider(list.data, 5)
                    : nodesByCountry(list.data, 5)
                }
              />
            )}
            <div className='warning'>
              <h4>
                <i className='bx bxs-info-circle'></i> Info
              </h4>
              <p>
                The data shown are only of nodes connected to our sentries.{' '}
                <br />
                Location may not be 100% accurate.
              </p>
            </div>
          </div>
          <div className='content__box'>
            <h3>{tab === 'provider' ? 'Top Providers' : 'Top Countries'}</h3>
            <table>
              <thead>
                <td></td>
                <td>Name</td>
                <td className='number__column' style={{ color: 'var(--text)' }}>
                  N°
                </td>
              </thead>
              <tbody>
                {tab === 'provider'
                  ? nodesByProvider(list.data).map((provider) => (
                      <TableItem
                        key={provider.name}
                        txt={provider.name}
                        flag='⚙️'
                        number={provider.y}
                      />
                    ))
                  : nodesByCountry(list.data).map((country) => (
                      <TableItem
                        key={country.code}
                        txt={country.name}
                        flag={country.flag}
                        number={country.y}
                      />
                    ))}
              </tbody>
            </table>
            <CSVLink
              className='download__button'
              headers={[
                {
                  label: tab === 'provider' ? 'Provider' : 'Country',
                  key: 'name',
                },
                { label: 'Nodes', key: 'y' },
              ]}
              data={
                tab === 'provider'
                  ? nodesByProvider(list.data)
                  : nodesByCountry(list.data)
              }
              filename='nodes.csv'
            >
              <i className='bx bxs-download'></i> Download as CSV
            </CSVLink>
          </div>
        </>
      )}

      {tab === 'list' && (
        <>
          <div className='content__box'>
            <h3>Full list</h3>
            <p>
              This is the full list of <b>{(list.data || []).length} nodes</b>{' '}
              in our <b>phoenix-1</b> addrbook
            </p>
            <table>
              <thead>
                <td></td>
                <td>City</td>
                <td>Provider</td>
                <td>IP</td>
              </thead>
              <tbody>
                {(list.data || []).map((node) => (
                  <tr key={node.addr.ip}>
                    <td className='flag__column'>
                      {COUNTRY[node.country_code].emoji}
                    </td>
                    <td>{formatString(node.city || '-', 9)}</td>
                    <td>{formatString(node.datacenter)}</td>
                    <td>{node.addr.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <CSVLink
              className='download__button'
              headers={[
                { label: 'Ip address', key: 'ip' },
                { label: 'Country', key: 'country' },
                { label: 'City', key: 'city' },
                { label: 'Provider', key: 'datacenter' },
              ]}
              data={(list.data || []).map((node) => {
                return { ip: node.addr.ip, ...node }
              })}
              filename='nodes.csv'
            >
              <i className='bx bxs-download'></i> Download as CSV
            </CSVLink>
          </div>
        </>
      )}

      {tab === 'country' && (
        <div className='content__box'>
          <h3>Top Cities</h3>
          <table>
            <thead>
              <td></td>
              <td>Name</td>
              <td className='number__column' style={{ color: 'var(--text)' }}>
                N°
              </td>
            </thead>
            <tbody>
              {nodesByCity(list.data).map((city) => {
                return (
                  <TableItem
                    key={city.name}
                    txt={city.name}
                    flag={city.flag}
                    number={city.y}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className='updatedAt'>
        Updated at <b>{new Date(list.updatedAt).toLocaleString()}</b>
      </p>
    </main>
  )
}
