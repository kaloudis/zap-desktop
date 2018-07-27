import React from 'react'
import FaAngleLeft from 'react-icons/lib/fa/angle-left'
import styles from './Fiat.scss'

const Fiat = () => {
  return (
    <div>
      <header className={styles.submenuHeader}>
        <FaAngleLeft />
        <span>Fiat currency</span>
      </header>
      <ul>
        <li>USD</li>
        <li>JPY</li>
        <li>CNY</li>
        <li>SGD</li>
        <li>HKD</li>
        <li>CAD</li>
      </ul>
    </div>
  )
}

export default Fiat
