<template>
    <div>
        <v-card
                color="grey lighten-4"
                flat
                height="200px"
        >
            <v-toolbar color="grey darken-1" dark>
                <v-toolbar-side-icon></v-toolbar-side-icon>

                <v-menu :nudge-width="100">
                    <v-toolbar-title slot="activator">
                        <span>All</span>
                        <v-icon dark>arrow_drop_down</v-icon>
                    </v-toolbar-title>

                    <v-list>
                        <v-list-tile
                                :key="Resolver"
                                @click=""
                        >
                            <v-list-tile-title v-text="Resolver"></v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile
                                :key="Wallet"
                                @click=""
                        >
                            <v-list-tile-title v-text="Wallet"></v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>

                <v-spacer></v-spacer>

                <v-btn icon>
                    <v-icon>search</v-icon>
                </v-btn>

                <v-btn icon>
                    <v-icon>favorite</v-icon>
                </v-btn>

                <v-btn icon>
                    <v-icon>more_vert</v-icon>
                </v-btn>
            </v-toolbar>
        </v-card>
    </div>
</template>

<script>
    export default {
        name: "appheader",
        data: () => ({
            items: [
                'All', 'Family', 'Friends', 'Coworkers'
            ]
        })
    }
</script>

<style scoped>

</style>