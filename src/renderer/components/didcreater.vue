<template>
    <div>
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
                    name="BTCRDID"
                    box
                    label="BTCR DID"
                    auto-grow
                    v-model="btcrDid"
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
          btcrDid: '',
          btcFee: 0.001
        }
  },

  methods: {
        handleSubmit () {
          try {
            let self = this
            createBtcrDid.createBtcrDid(this.inputBTCAddress, this.outputBTCAddress, this.network, this.wif, this.continuationLink, this.btcFee)
              .then(function (result) {
                self.btcrDid = result
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