// @flow

import grpc from 'grpc'
import { loadSync } from '@grpc/proto-loader'
import { BrowserWindow } from 'electron'
import LndConfig from './config'
import { getDeadline, validateHost, createSslCreds, createMacaroonCreds } from './util'
import methods from './methods'
import { mainLog } from '../utils/log'
import subscribeToTransactions from './subscribe/transactions'
import subscribeToInvoices from './subscribe/invoices'
import subscribeToChannelGraph from './subscribe/channelgraph'

// Type definition for subscriptions property.
type LightningSubscriptionsType = {
  channelGraph: any,
  invoices: any,
  transactions: any
}

/**
 * Creates an LND grpc client lightning service.
 * @returns {Lightning}
 */
class Lightning {
  mainWindow: BrowserWindow
  lnd: any
  subscriptions: LightningSubscriptionsType

  constructor() {
    this.mainWindow = null
    this.lnd = null
    this.subscriptions = {
      channelGraph: null,
      invoices: null,
      transactions: null
    }
  }

  /**
   * Connect to the gRPC interface and verify it is functional.
   * @return {Promise<rpc.lnrpc.Lightning>}
   */
  async connect(lndConfig: LndConfig) {
    const { rpcProtoPath, host, cert, macaroon } = lndConfig

    // Verify that the host is valid before creating a gRPC client that is connected to it.
    return await validateHost(host).then(async () => {
      // Load the gRPC proto file.
      // The following options object closely approximates the existing behavior of grpc.load.
      // See https://github.com/grpc/grpc-node/blob/master/packages/grpc-protobufjs/README.md
      const options = {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      }
      const packageDefinition = loadSync(rpcProtoPath, options)

      // Load gRPC package definition as a gRPC object hierarchy.
      const rpc = grpc.loadPackageDefinition(packageDefinition)

      // Create ssl and macaroon credentials to use with the gRPC client.
      const [sslCreds, macaroonCreds] = await Promise.all([
        createSslCreds(cert),
        createMacaroonCreds(macaroon)
      ])
      const credentials = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds)

      // Create a new gRPC client instance.
      const lnd = new rpc.lnrpc.Lightning(host, credentials)

      // Call the getInfo method to ensure that we can make successful calls to the gRPC interface.
      return new Promise((resolve, reject) => {
        lnd.getInfo({}, { deadline: getDeadline(2) }, err => {
          if (err) {
            return reject(err)
          }
          this.lnd = lnd
          return resolve(lnd)
        })
      })
    })
  }

  /**
   * Discomnnect the gRPC service.
   */
  disconnect() {
    this.unsubscribe()
    if (this.lnd) {
      this.lnd.close()
    }
  }

  /**
   * Gracegfully shutdown the gRPC service.
   */
  shutdown() {
    this.unsubscribe()
    return new Promise((resolve, reject) => {
      this.lnd.stopDaemon({}, (err, data) => {
        if (err) {
          reject(err)
        }
        resolve(data)
      })
    })
  }

  /**
   * Hook up lnd restful methods.
   */
  lndMethods(event: Event, msg: string, data: any) {
    return methods(this.lnd, mainLog, event, msg, data)
  }

  /**
   * Subscribe to all bi-directional streams.
   */
  subscribe(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow

    this.subscriptions.channelGraph = subscribeToChannelGraph.call(this)
    this.subscriptions.invoices = subscribeToInvoices.call(this)
    this.subscriptions.transactions = subscribeToTransactions.call(this)
  }

  /**
   * Unsubscribe from all bi-directional streams.
   */
  unsubscribe() {
    this.mainWindow = null
    Object.keys(this.subscriptions).forEach(subscription => {
      if (this.subscriptions[subscription]) {
        this.subscriptions[subscription].cancel()
        this.subscriptions[subscription] = null
      }
    })
  }
}

export default Lightning
