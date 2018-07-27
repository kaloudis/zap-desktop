import React from 'react'
import PropTypes from 'prop-types'
import Menu from './Menu'
import Fiat from './Fiat'
import styles from './Settings.scss'

const Settings = ({ settings, setActiveSubMenu }) => {
  const renderSettings = () => {
    switch (settings.activeSubMenu) {
      case 'fiat':
        return <Fiat />
      default:
        return <Menu setActiveSubMenu={setActiveSubMenu} />
    }
  }
  return <div className={styles.container}>{renderSettings()}</div>
}

Settings.propTypes = {
  settings: PropTypes.object.isRequired,
  setActiveSubMenu: PropTypes.func.isRequired
}

export default Settings
