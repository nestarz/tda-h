<template>
  <v-container text-xs-center fill-height>
    <v-layout align-center justify-center row fill-height>
      <v-flex xs12 sm6 md4>
        <p class="font-weight-bold display-3">
          TDA
          <span class="font-weight-light display-4">/</span>H
        </p>
        <v-spacer></v-spacer>
        <router-view/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "auth"
};
</script>
