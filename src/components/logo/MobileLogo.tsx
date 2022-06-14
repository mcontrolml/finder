import { useRecoilValue } from 'recoil'
import STATE from '../../state'

import mcontrolSvg from '../../img/mcontrol.svg'
import mcontrolWhiteSvg from '../../img/mcontrolWhite.svg'

export default function MobileLogo() {
  const darkMode = useRecoilValue(STATE.darkMode)
  return (
    <a href='https://mcontrol.ml' target='blank'>
      <img
        src={darkMode ? mcontrolWhiteSvg : mcontrolSvg}
        alt='MissionControl'
        className='logo__mobile'
      />
    </a>
  )
}
