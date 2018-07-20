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
            <v-text-field
                    v-model="inputBTCAddress"
                    label="Input Bitcoin Address"
                    required
            ></v-text-field>
            <v-text-field
                    v-model="outputBTCAddress"
                    label="Output Bitcoin Address"
                    required
            ></v-text-field>
            <v-text-field
                    v-model="wif"
                    label="WIF (Secret Key)"
                    required
            ></v-text-field>
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

    let db = new Datastore({ filename: '../store/data/tx.db', autoload: true })

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
          header: 'Created DIDs'
        }
  },

  methods: {
        handleSubmit () {
          try {
            let self = this
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
                  db.insert(item, function (err, docu) {
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
        clear () {
          this.inputBTCAddress = ''
          this.outputBTCAddress = ''
          this.wif = ''
          this.continuationLink = ''
          this.btcrDid = ''
        },
        loadStore () {
          // Find all documents in the collection
          let self = this
          db.find({}, async function (err, docs) {
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
        deleteItem (item) {
          let self = this
          db.remove({ _id: item._id }, {}, async function (err, numRemoved) {
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
        this.loadStore()
  }
}
</script>

<style scoped>

</style>