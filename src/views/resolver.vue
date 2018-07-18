<!-- did:btcr:xyv2-xzyq-qqm5-tyke -->
<!-- did:btcr:xut7-szgq-qqhm-r4fl -->
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
<!--
        <div>
                <v-tabs
                        slot="extension"
                        v-model="tabModel"
                        centered
                        slider-color="yellow"
                >
                    <v-tab
                            v-for="(value, i) in didObject"
                            :key="i"
                            :href="`#tab-${i}`"
                    >
                        Phase {{ i + 1 }}
                    </v-tab>
                </v-tabs>

            <v-tabs-items v-model="tabModel">
                <v-tab-item
                        v-for="(value, i) in didObject"
                        :id="`tab-${i}`"
                        :key="i"
                        :lazy="true"
                >{{ didObject[i].didPhase}}
                </v-tab-item>
            </v-tabs-items>
        </div>-->
            <v-container fluid grid-list-md>
                <v-textarea
                        name="'input-' + i"
                        box
                        label="Result"
                        auto-grow
                        v-model="didObject[0].didPhase"
                        readonly
                ></v-textarea>
            </v-container>
            <v-container fluid grid-list-md>
                <v-textarea
                        name="'input-' + i"
                        box
                        label="Result"
                        auto-grow
                        v-model="didObject[1].didPhase"
                        readonly
                ></v-textarea>
            </v-container>
            <v-container fluid grid-list-md>
                <v-textarea
                        name="'input-' + i"
                        box
                        label="Result"
                        auto-grow
                        v-model="didObject[2].didPhase"
                        readonly
                ></v-textarea>
            </v-container>
    </div>
</template>

<script>
    let ddoResolver = require('../../libraries/btcr-did-tools-js/ddoResolver');
    export default {
        name: "did-input",
        data() {
            return {
                did: '',
                didResult: '',
                network: 'testnet',
                radios: 'testnet',
                didObject: [
                    {didPhase: 'test'},
                    {didPhase: 'test1'},
                    {didPhase: 'test2'}
                ],
                tabModel: 'phase-tab'
            }
        },

        methods: {
            handleSubmit() {
                if (this.did) {
                    try {
                        let self = this;
                        ddoResolver.resolveFromTxref(this.did)
                            .then(function(result) {
                                self.didResult = JSON.stringify(result, null, 4);
                                self.didObject[0].didPhase = JSON.stringify(result.ddophase1, null, 4);
                                self.didObject[1].didPhase = JSON.stringify(result.ddophase2, null, 4);
                                self.didObject[2].didPhase = JSON.stringify(result.ddophase3, null, 4);

                                console.log(result);
                            }, function(err) {
                                console.log('error retrieving data from URL');
                                self.didResult = err.message;
                            })
                    } catch (err) {
                        this.didResult = err.message;
                    }
                }
                else {
                    this.didResult = 'Missing DID'
                }
            },
            clear() {
                this.did = '';
                this.didResult = '';
                this.didObject[0].didPhase = '';
                this.didObject[1].didPhase = '';
                this.didObject[2].didPhase = '';
            }
        }
    }
</script>

<style scoped>

</style>