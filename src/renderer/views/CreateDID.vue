<template>
    <div id="wrapper">
        <v-app>
            <main>
                <appheader></appheader>
                <didcreater></didcreater>
            </main>
        </v-app>
    </div>
</template>

<script>
    import Appheader from '../components/appheader'
    import Didcreater from '../components/didcreater'

export default {
      name: 'create-did',
      components: {
        Appheader,
        Didcreater}
    }
</script>

<style scoped>

</style>