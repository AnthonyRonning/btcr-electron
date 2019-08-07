<template>
    <div>
        <!-- wallet list -->
        <v-flex>
            <v-card>
                <v-list two-line>
                    <v-subheader
                            :key="header"
                    >
                        {{ header }}
                    </v-subheader>
                    <template v-for="(wallet, index) in addressList">

                        <v-divider
                                v-if="wallet.divider"
                                :key="index"
                        ></v-divider>

                        <v-list-tile
                                v-else
                                :key="wallet.address"
                                @click=""
                        >
                            <v-list-tile-content @click="copy(wallet.address)">
                                <v-list-tile-title v-html="wallet.address"></v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn color="error" @click="deleteWallet(wallet)">Delete</v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                    </template>
                </v-list>
            </v-card>
        </v-flex><br>

        <!-- wallet generate button -->
        <v-btn @click="generateNewAddress">
            Generate New Testnet Address
        </v-btn>
    </div>
</template>

<script>
  const Datastore = require('nedb-core')
  const bitcoin = require('bitcoinjs-lib')
  const { clipboard } = require('electron')

  const TESTNET = bitcoin.networks.testnet

  let db = new Datastore({ filename: '../store/data/wallet.db', autoload: true })
  export default {
    name: 'wallet',
    data () {
      return {
        addressList: [],
        header: 'Addresses'
      }
    },
    methods: {
      loadStore () {
      // Find all documents in the collection
        let self = this
        db.find({}, async function (err, wallets) {
          if (err) {
            console.log(err)
          } else {
            if (Object.keys(wallets).length === 0) {
              console.log('null database')
            }
            self.addressList = wallets
            console.log(self.addressList)
          }
        })
      },
      generateNewAddress () {
        let keyPair = bitcoin.ECPair.makeRandom({ network: TESTNET })
        let { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: TESTNET })
        let wif = keyPair.toWIF()
        let wallet = {
          address: address,
          wif: wif,
          testnet: true
        }
        this.addWallet(wallet)
      },
      addWallet (wallet) {
        let self = this
        db.insert(wallet, function (err, docu) {
          if (err) {
            console.log(err)
          } else {
            console.log(docu)
            self.addressList.push(docu)
          }
        })
      },
      deleteWallet (item) {
        let self = this
        db.remove({ _id: item._id }, {}, async function (err, numRemoved) {
          if (err) {
            console.log(err)
          } else {
            if (numRemoved === 1) {
              console.log('removed item')
              let index = self.addressList.indexOf(item)
              if (index > -1) {
                self.addressList.splice(index, 1)
              }
            } else {
              console.log('could not remove item: ' + item._id)
            }
          }
        })
      },
      copy (text) {
        clipboard.writeText(text, 'selection')
      }
    },
    created: function () {
      this.loadStore()
    }
  }
</script>

<style scoped>

</style>
