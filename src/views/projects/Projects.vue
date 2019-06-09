<template>
  <div>
    <v-container>
      <ListManager :parent="null"/>
    </v-container>
  </div>
</template>

<script>
import ListManager from "@/components/ListManager.vue";

export default {
  name: "projects",
  components: {
    ListManager
  }
};
</script>
