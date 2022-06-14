import banner from '../../img/banner.svg'
import bannerSmall from '../../img/bannerSmall.svg'

export default function Banner({ small }: { small?: boolean }) {
  return small ? (
    <a
      href='https://station.terra.money/validator/terravaloper1sextn6xd46edrc02tf6d2fysmqw62qu7ng3kkm'
      target='blank'
    >
      <img src={bannerSmall} alt='Stake with us!' className='banner' />
    </a>
  ) : (
    <a
      href='https://station.terra.money/validator/terravaloper1sextn6xd46edrc02tf6d2fysmqw62qu7ng3kkm'
      target='blank'
    >
      <img src={banner} alt='Stake with us!' className='banner' />
    </a>
  )
}
