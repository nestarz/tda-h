<template>
  <div>
    <v-toolbar flat fixed app :class="{ 'has-alert': !isOnline }">
      <v-toolbar-side-icon @click.stop="$emit('toggle')">
          <v-icon>more_vert</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title>
        {{ $route.meta.title }}
      </v-toolbar-title>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: 'toolbar'
}
</script>

<style scoped>
.has-alert {
  margin-top: 60px !important;
}
</style>
