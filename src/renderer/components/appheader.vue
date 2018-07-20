<template>
    <div>
        <v-toolbar dark color="primary">
            <v-toolbar-side-icon></v-toolbar-side-icon>

            <v-toolbar-title class="white--text">BTCR Electron</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-toolbar-items class="sm-and-down">
                <router-link to='/resolver' tag='button' style='cursor:pointer;'>
                    <v-btn flat>Resolver</v-btn>
                </router-link>
                <router-link to='/createdid' tag='button' style='cursor:pointer;'>
                    <v-btn flat>Create DID</v-btn>
                </router-link>
            </v-toolbar-items>
        </v-toolbar>
    </div>
</template>

<script>
    export default {
      name: 'appheader'
    }
</script>

<style scoped>

</style>