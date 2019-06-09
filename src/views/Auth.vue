<template>
  <v-container text-xs-center fill-height>
    <v-layout align-center justify-center row fill-height>
      <v-flex xs12 sm6 md4>
        <p class="font-weight-bold display-3 custom-font">
          TDA
          <span class="font-weight-thin display-4 custom-font">/</span>H
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

<style lang="scss" scoped>
.custom-font {
  font-family: CircularStd !important;
  letter-spacing: -1px !important;
  user-select: none;

  span {
    margin: 0 -7px !important;
  }
}
</style>
