<template>
    <div>
        <!-- did list -->
        <v-flex>
            <v-card>
                <v-list two-line>
                    <template v-for="(item, index) in items">
                        <v-subheader
                                v-if="item.header"
                                :key="item.header"
                        >
                            {{ item.header }}
                        </v-subheader>

                        <v-divider
                                v-else-if="item.divider"
                                :key="index"
                        ></v-divider>

                        <v-list-tile
                                v-else
                                :key="item.title"
                        >
                            <v-list-tile-content>
                                <v-list-tile-title v-html="item.title"></v-list-tile-title>
                                <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                            </v-list-tile-content>
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
          ]
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
                  self.items.push(item)
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
        }
  }
}
</script>

<style scoped>

</style>