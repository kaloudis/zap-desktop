import React from 'react'
import PropTypes from 'prop-types'
import FaAngleLeft from 'react-icons/lib/fa/angle-left'
import styles from './Fiat.scss'

const Fiat = ({ fiatTicker, fiatTickers, disableSubMenu, setFiatTicker }) => {
  return (
    <div>
      <header className={styles.submenuHeader} onClick={disableSubMenu}>
        <FaAngleLeft />
        <span>Fiat currency</span>
      </header>
      <ul>
        {fiatTickers.map(ft => (
          <li
            key={ft}
            className={fiatTicker === ft && styles.active}
            onClick={() => setFiatTicker(ft)}
          >
            {ft}
          </li>
        ))}
      </ul>
    </div>
  )
}

Fiat.propTypes = {
  fiatTicker: PropTypes.string.isRequired,
  fiatTickers: PropTypes.array.isRequired,
  disableSubMenu: PropTypes.func.isRequired,
  setFiatTicker: PropTypes.func.isRequired
}

export default Fiat
