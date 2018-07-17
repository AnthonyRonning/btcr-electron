<template>
    <div>
        <h2>Enter a DID Method</h2>
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
                    v-model="did"
                    label="DID Method"
                    required
            ></v-text-field>
            <v-radio-group v-model="network" :mandatory="true">
                <v-radio label="testnet" value="testnet"></v-radio>
                <v-radio label="mainnet" value="mainnet"></v-radio>
            </v-radio-group>

            <v-btn
                    :disabled="!valid"
                    @click="handleSubmit"
            >
                submit
            </v-btn>
            <v-btn @click="clear">clear</v-btn>
        </v-form>
        <v-app id="inspire">
            <v-container fluid grid-list-md>
                <v-textarea
                        name="input-7-1"
                        box
                        label="Label"
                        auto-grow
                        v-model="didResult"
                ></v-textarea>
            </v-container>
        </v-app>
    </div>
</template>

<script>
    let ddoResolver = require('../libraries/btcr-did-tools-js/ddoResolver');
    export default {
        name: "did-input",
        data() {
            return {
                did: '',
                didResult: '',
                network: 'testnet',
                radios: 'testnet'
            }
        },

        methods: {
            handleSubmit() {
                if (this.did) {
                    try {
                        let self = this;
                        ddoResolver.resolveFromTxref(this.did, this.didResult)
                            .then(function(result) {
                                self.didResult = JSON.stringify(result, null, 4);

                                console.log(result);
                            }, function(err) {
                                console.log('error retrieving data from URL');
                                self.didResult = err.message;
                            })
                            .catch(function(err) {
                                console.log(err);
                            });
                    } catch (err) {
                        this.didResult = err;
                    }
                }
                else {
                    this.message = 'Missing DID'
                }
            },
            clear() {
                this.did = '';
                this.didResult = '';
            }
        }
    }
</script>

<style scoped>

</style>