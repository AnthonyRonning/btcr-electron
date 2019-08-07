<template>
    <div>
        <!-- did list -->
        <v-flex>
            <v-card>
                <v-list two-line>
                    <v-subheader
                            :key="header"
                    >
                        {{ header }}
                    </v-subheader>
                    <template v-for="(item, index) in items">

                        <v-divider
                                v-if="item.divider"
                                :key="index"
                        ></v-divider>

                        <v-list-tile
                                v-else
                                :key="item.title"
                        >
                            <v-list-tile-content @click="">
                                <v-list-tile-title v-html="item.title"></v-list-tile-title>
                                <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn color="error" @click="deleteItem(item)">Delete</v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                    </template>
                </v-list>
            </v-card>
        </v-flex><br>

        <h2>Create DID</h2>
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-select
                    v-model="inputBTCAddress"
                    :options="publicAddressList"
                    placeholder="Input Bitcoin Address"
                    required
            ></v-select>
            <v-select
                    v-model="outputBTCAddress"
                    :options="publicAddressList"
                    placeholder="Output Bitcoin Address"
                    required
            ></v-select>
            <v-text-field
                    v-model="continuationLink"
                    label="Optional Continuation Link"
            ></v-text-field>
            <v-radio-group v-model="network" :mandatory="true">
                <v-radio label="testnet" value="testnet"></v-radio>
                <v-radio label="mainnet" value="mainnet" disabled="true"></v-radio>
            </v-radio-group>

            <v-btn
                    :disabled="!valid"
                    @click="handleSubmit"
            >
                submit
            </v-btn>
            <v-btn @click="clear">clear</v-btn>
        </v-form>

        <v-container fluid grid-list-md>
            <v-textarea
                    name="TXID"
                    box
                    label="TX ID"
                    auto-grow
                    v-model="txId"
                    readonly
            ></v-textarea>
        </v-container>
    </div>
</template>

<script>
    let createBtcrDid = require('../../../libraries/btcr-did-tools-js/createBtcrDid')
    const Datastore = require('nedb-core')

    let txDb = new Datastore({ filename: '../store/data/tx.db', autoload: true })
    let addressDb = new Datastore({ filename: '../store/data/wallet.db', autoload: true })

export default {
  name: 'didcreater',
  data () {
        return {
          inputBTCAddress: '',
          outputBTCAddress: '',
          wif: '',
          continuationLink: '',
          network: 'testnet',
          radios: 'testnet',
          valid: true,
          txId: '',
          btcFee: 0.001,
          items: [
            { header: 'Created TXs' }
          ],
          header: 'Created DIDs',
          addressList: [],
          publicAddressList: []
        }
  },

  methods: {
        handleSubmit () {
          try {
            let self = this

            self.setWifFromSelectedPublicKey()

            createBtcrDid.createBtcrDid(this.inputBTCAddress, this.outputBTCAddress, this.network, this.wif, this.continuationLink, this.btcFee)
              .then(function (result) {
                let jsonResult = JSON.parse(result)
                if (jsonResult.status !== 'success') {
                  self.txId = status
                  console.log(status)
                } else {
                  self.txId = jsonResult.data.txid
                  let item = {
                    title: self.txId,
                    subtitle: 'Input: ' + self.inputBTCAddress + ' | output: ' + self.outputBTCAddress
                  }
                  txDb.insert(item, function (err, docu) {
                    if (err) {
                      console.log(err)
                    } else {
                      console.log(docu)
                      self.items.push(docu)
                    }
                  })
                }
                console.log(result)
              }, function (err) {
                console.log('error retrieving data from URL:' + err)
                self.didResult = 'Error creating DID: ' + err.message
              })
          } catch (err) {
            this.didResult = err.message
            console.log(err)
          }
        },
        setWifFromSelectedPublicKey () {
          let self = this
          let selectedAddress = this.addressList.find(function (address) {
            return address.address === self.inputBTCAddress
          })
          self.wif = selectedAddress.wif
        },
        clear () {
          this.inputBTCAddress = ''
          this.outputBTCAddress = ''
          this.wif = ''
          this.continuationLink = ''
          this.btcrDid = ''
        },
        loadTxStore () {
          // Find all documents in the collection
          let self = this
          txDb.find({}, async function (err, docs) {
            if (err) {
              console.log(err)
            } else {
              if (Object.keys(docs).length === 0) {
                console.log('null database')
              }
              self.items = docs
              console.log(self.items)
            }
          })
        },
        loadAddressStore () {
          let self = this
          addressDb.find({}, async function (err, wallets) {
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
        deleteItem (item) {
          let self = this
          txDb.remove({ _id: item._id }, {}, async function (err, numRemoved) {
            if (err) {
              console.log(err)
            } else {
              if (numRemoved === 1) {
                console.log('removed item')
                let index = self.items.indexOf(item)
                if (index > -1) {
                  self.items.splice(index, 1)
                }
              } else {
                console.log('could not remove item: ' + item._id)
              }
            }
          })
        }
  },
  created: function () {
        this.loadTxStore()
        this.loadAddressStore()
  },
  computed: {
        publicKeyList: function () {
          return this.addressList.map(function (item) {
            return item['address']
          })
        }
  },
  watch: {
        addressList: function (val) {
          this.publicAddressList = this.addressList.map(function (item) {
            return item['address']
          })
        }
  }
}
</script>

<style scoped>

</style>
