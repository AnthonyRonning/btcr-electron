<!-- did:btcr:xyv2-xzyq-qqm5-tyke -->
<!-- did:btcr:xut7-szgq-qqhm-r4fl -->
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
                                    @click=""
                            >
                                <v-list-tile-content @click="loadDid(item.title)">
                                    <v-list-tile-title v-html="item.title"></v-list-tile-title>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                    <v-btn color="error" @click="deleteItem(item)">Delete</v-btn>
                                </v-list-tile-action>
                            </v-list-tile>
                        </template>
                    </v-list>
                </v-card>
            </v-flex><br>

        <!-- DID form -->
        <h2>Resolve DID Method</h2>

        <v-form ref="form" v-model="valid" lazy-validation>

            <v-container fluid grid-list-xl>
                <v-layout wrap align-center>
                    <v-flex xs12 sm6 d-flex>
                        <v-select label="Method Type"
                                  box
                                  v-model="resolverOption"
                                  :options="['txRef','txId']"></v-select>
                    </v-flex>
                </v-layout>
            </v-container>

            <v-text-field
                    v-model="txRef"
                    label="TX Ref"
                    v-if="resolverOption === 'txRef'"
            ></v-text-field>
            <v-text-field
                    v-model="txId"
                    label="TX ID"
                    v-if="resolverOption === 'txId'"
            ></v-text-field>
            <!--  blockheight disabled
                      <v-text-field
                                v-model="blockHeight"
                                label="Block Height"
                                v-if="resolverOption === 'blockHeight'"
                        ></v-text-field>
                        <v-text-field
                                v-model="position"
                                label="Position"
                                v-if="resolverOption === 'blockHeight'"
            ></v-text-field>-->
            <v-radio-group v-model="network" :mandatory="false" v-if="resolverOption === 'txId' || resolverOption === 'blockHeight'">
                <v-radio label="testnet" value="testnet"></v-radio>
                <v-radio label="mainnet" value="mainnet"></v-radio>
            </v-radio-group>
            <v-btn
                    :disabled="!valid"
                    @click="handleSubmit"
            >
                submit
            </v-btn>
            <v-btn @click="clear">Reset</v-btn>
            <v-btn @click="save" v-if="didPhase3">Save</v-btn>
        </v-form>

        <!-- did phases -->
<!--        <v-container fluid grid-list-md>
            <v-textarea
                    name="didPhase1"
                    box
                    label="DID Phase 1"
                    auto-grow
                    v-if="didPhase1"
                    v-model="didPhase1"
                    readonly
            ></v-textarea>
        </v-container>
        <v-container fluid grid-list-md>
            <v-textarea
                    name="didPhase2"
                    box
                    label="DID Phase 2"
                    auto-grow
                    v-if="didPhase2"
                    v-model="didPhase2"
                    readonly
            ></v-textarea>
        </v-container>-->
        <v-container fluid grid-list-md>
            <v-textarea
                    name="didPhase3"
                    box
                    label="Final DID"
                    auto-grow
                    v-if="didPhase3"
                    v-model="didPhase3"
                    readonly
            ></v-textarea>
        </v-container>
    </div>
</template>

<script>
let ddoResolver = require('../../../libraries/btcr-did-tools-js/ddoResolver')
const Datastore = require('nedb-core')

let db = new Datastore({ filename: '../store/data/datafile2.db', autoload: true })

export default {
  name: 'did-input',
  data () {
    return {
      txRef: '',
      txId: '',
      blockHeight: '',
      position: '',
      didResult: '',
      network: 'testnet',
      valid: true,
      didPhase1: '',
      didPhase2: '',
      didPhase3: '',
      resolverOption: 'Select Resolver Option',
      items: [
        { }
      ],
      header: 'Saved DIDs'
    }
  },
  methods: {
    handleSubmit () {
      if (this.resolverOption === 'txRef' && this.txRef) {
        try {
          let self = this
          ddoResolver.resolveFromTxref(this.txRef)
            .then(function (result) {
              console.log(result)
              self.didResult = JSON.stringify(result, null, 4)
              self.didPhase1 = JSON.stringify(result.ddophase1, null, 4)
              self.didPhase2 = JSON.stringify(result.ddophase2, null, 4)
              self.didPhase3 = JSON.stringify(result.ddophase3, null, 4)
            }, function (err) {
              console.log('error retrieving data from URL:' + err)
              self.didResult = err.message
            })
        } catch (err) {
          this.didResult = err.message
          console.log(err) // todo better error handling
        }
      } else if (this.resolverOption === 'txId' && this.txId && this.network) {
        try {
          let self = this
          ddoResolver.resolveFromTxid(this.txId, this.network)
            .then(function (result) {
              self.didResult = JSON.stringify(result, null, 4)
              self.didPhase1 = JSON.stringify(result.ddophase1, null, 4)
              self.didPhase2 = JSON.stringify(result.ddophase2, null, 4)
              self.didPhase3 = JSON.stringify(result.ddophase3, null, 4)
            }, function (err) {
              console.log('error retreiving data from URL:' + err)
              self.didResult = err.message
            })
        } catch (err) {
          this.didResult = err.message
          console.log(err) // todo better error handling
        }
      } else {
        this.didResult = 'Error with form' // todo better error handling
        console.log('Error with form')
      }
    },
    clear () {
      this.txRef = ''
      this.txId = ''
      this.blockHeight = ''
      this.position = ''
      this.didResult = ''
      this.didPhase1 = ''
      this.didPhase2 = ''
      this.didPhase3 = ''
      this.resolverOption = 'Select Resolver Option'
    },
    save () {
      let item = {
        title: this.txRef
      }
      let self = this
      db.insert(item, function (err, docu) {
        if (err) {
          console.log(err)
        } else {
          console.log(docu)
          self.items.push(docu)
        }
      })
    },
    loadDid (loadedTxRef) {
      this.txRef = loadedTxRef
      this.resolverOption = 'txRef'
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