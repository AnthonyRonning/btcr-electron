<template>
    <div id="wrapper">
        <v-app>
            <main>
                <appheader></appheader>
                <wallet></wallet>
            </main>
        </v-app>
    </div>
</template>

<script>
  import Appheader from '../components/appheader'
  import Wallet from '../components/wallet'

  export default {
    name: 'wallet-form',
    components: {
      Appheader,
      Wallet
    }
  }
</script>

<style scoped>

</style>
