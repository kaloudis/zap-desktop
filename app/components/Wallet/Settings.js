import React from 'react'
import styles from './Settings.scss'

const Settings = () => {
  return (
    <div className={styles.container}>
      <ul>
        <li className={styles.fiat}>
          <span>Fiat Currency</span>
        </li>
      </ul>
    </div>
  )
}

export default Settings
