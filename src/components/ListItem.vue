<template>
  <v-list-group class="todo-item" :class="{ 'editing': editing }">
    <v-list-tile slot="activator">
      <v-list-tile-action>
        <v-checkbox
          :input-value="todo.is_completed"
          @click="$emit('toggleDone', todo.id, todo.is_completed)"
          color="primary"
          v-if="!editing"
        ></v-checkbox>
        <v-icon color="primary" v-else>edit</v-icon>
      </v-list-tile-action>
      <template v-if="!editing">
        <v-list-tile-content
          :class="{ 'primary--text': todo.is_completed }"
          @dblclick="editing = true"
        >{{ todo.text }}</v-list-tile-content>
        <v-list-tile-action>
          <v-btn color="red lighten-3" flat icon @click="$emit('delete', todo.id)">
            <v-icon>close</v-icon>
          </v-btn>
        </v-list-tile-action>
      </template>
      <v-text-field
        :value="todo.text"
        clearable
        color="primary"
        flat
        hide-details
        maxlength="1023"
        ref="input"
        solo
        v-else
        v-focus="editing"
      ></v-text-field>
    </v-list-tile>
    <ListManager :parent="todo.id" class="padding"/>
  </v-list-group>
  <!-- <v-list-tile class="todo-item" :class="{ 'editing': editing }">
    <v-list-tile-action>
      <v-checkbox
        :input-value="todo.is_completed"
        @click="$emit('toggleDone', todo.id, todo.is_completed)"
        color="primary"
        v-if="!editing"
      ></v-checkbox>
      <v-icon color="primary" v-else>edit</v-icon>
    </v-list-tile-action>
    <template v-if="!editing">
      <v-list-tile-content
        :class="{ 'primary--text': todo.is_completed }"
        @dblclick="editing = true"
      >{{ todo.text }}</v-list-tile-content>
      <v-list-tile-action>
        <v-btn color="red lighten-3" flat icon @click="$emit('delete', todo.id)">
          <v-icon>close</v-icon>
        </v-btn>
      </v-list-tile-action>
    </template>
    <v-text-field
      :value="todo.text"
      clearable
      color="primary"
      flat
      hide-details
      maxlength="1023"
      ref="input"
      solo
      v-else
      v-focus="editing"
    ></v-text-field>
    <ListManager :parent="todo.id"/>
  </v-list-tile>-->
</template>

<script>
export default {
  props: ["todo"],
  components: {
    ListManager: () => import("../components/ListManager.vue")
  },
  data() {
    return {
      editing: false
    };
  },
  directives: {
    focus(el, { value }, { context }) {
      if (value) {
        context.$nextTick(() => {
          context.$refs.input.focus();
        });
      }
    }
  }
};
</script>

<style lang="stylus">
.padding {
  padding: 0 1rem 1rem 1rem;
  margin: 0;
}
.todo-item {
  .v-list__tile {
    height: auto;
    padding-top: 12px;
    padding-bottom: 12px;
  }

  &.editing .v-list__tile {
    height: 48px;
  }
}
</style>
