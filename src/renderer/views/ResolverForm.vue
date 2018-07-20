<template>
    <div id="wrapper">
        <v-app>
            <main>
                <appheader></appheader>
                <resolver></resolver>
            </main>
        </v-app>
    </div>
</template>

<script>
    import Appheader from '../components/appheader'
    import Resolver from '../components/resolver'

export default {
      name: 'resolver-form',
      components: {
        Appheader,
        Resolver }
    }
</script>

<style scoped>

</style>