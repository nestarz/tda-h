<template>
  <v-layout row wrap>
    <v-flex text-xs-center class="container-a">
      <!-- header -->
      <!-- main -->
      <v-card class="mt-3" flat :elevation="0">
        <v-progress-linear class="my-0" v-model="progressPercentage"/>
        <v-card-actions class="px-3" v-show="todos.length">
          <span class="primary--text">{{ remaining }} {{ remaining | pluralize('item') }} left</span>
          <v-spacer></v-spacer>
          <v-btn-toggle class="elevation-0" mandatory v-model="visibility" v-show="todos.length">
            <v-btn
              :key="key"
              :to="key"
              :value="key"
              class="mx-0"
              color="primary"
              flat
              small
              v-for="(val, key) in filters"
            >{{ key | capitalize }}</v-btn>
          </v-btn-toggle>
        </v-card-actions>
        <v-list class="pa-0">
          <template v-for="(todo, index) in filteredTodos">
            <v-divider :key="todo.id ? `${todo.id}-divider` : `${index}-cache-divider`"></v-divider>
            <ListItem
              :key="todo.id ||`${index}-cache`"
              :todo="todo"
              @toggleDone="checkItem"
              @delete="deleteItem"
            />
          </template>
          <v-card flat>
            <v-list class="pa-0">
              <v-list-tile>
                <!--                 <v-list-tile-action>
                  <v-checkbox
                    :input-value="allChecked"
                    @change="toggleAll(!allChecked)"
                    color="primary"
                    v-if="todos.length > 0"
                  ></v-checkbox>
                  <v-icon color="primary" v-else>check</v-icon>
                </v-list-tile-action>-->
                <v-text-field
                  :label="'New todo input'"
                  @keydown.enter="addItem"
                  autofocus
                  browser-autocomplete="off"
                  clearable
                  color="primary"
                  flat
                  hide-details
                  maxlength="1023"
                  placeholder="What needs to be done?"
                  solo
                  v-model="newItem"
                ></v-text-field>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-list>
      </v-card>
      <v-btn
        @click="clearCompleted"
        block
        class="mt-3"
        color="primary"
        depressed
        round
        v-show="todos.length > remaining"
      >Clear completed</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import gql from "graphql-tag";
import ListItem from "../components/ListItem.vue";
import shortid from "shortid";

import { mapState } from "vuex";

const GET_TODOS = gql`
  query getTodos($userId: String, $parentId: String) {
    todos(
      where: { user_id: { _eq: $userId }, parent_id: { _eq: $parentId } }
      order_by: [{ id: desc }]
    ) {
      id
      text
      is_completed
      user_id
      parent_id
    }
  }
`;
export default {
  components: {
    ListItem
  },
  props: {
    parent: String
  },
  data() {
    return {
      newItem: "",
      visibility: "all",
      todos: [],
      filters: {
        all: todos => todos,
        active: todos => todos.filter(todo => !todo.is_completed),
        completed: todos => todos.filter(todo => todo.is_completed)
      }
    };
  },
  computed: {
    ...mapState(["currentUser", "userProfile"]),
    allChecked() {
      return this.todos.every(todo => todo.is_completed);
    },
    filteredTodos() {
      return this.filters[this.visibility](this.todos);
    },
    completed() {
      return this.todos.filter(todo => todo.is_completed);
    },
    remaining() {
      return this.todos.filter(todo => !todo.is_completed).length;
    },
    progressPercentage() {
      const len = this.todos.length;
      return ((len - this.remaining) * 100) / len;
    }
  },
  filters: {
    pluralize: (n, w) => (n === 1 ? w : w + "s"),
    capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
  },
  apollo: {
    todos: {
      query: GET_TODOS,
      variables() {
        return {
          userId: this.currentUser.uid,
          parentId: this.parent || null
        };
      },
      skip() {
        return !this.currentUser.uid;
      }
    }
  },
  methods: {
    addItem({ parent_id = null }) {
      if (parent_id && this.todos.some(todo => todo.id !== parent_id)) {
        console.error("Parent ID doesnt exists");
        return;
      }

      this.$apollo
        .mutate({
          mutation: gql`
            mutation(
              $id: String
              $text: String
              $userId: String
              $parent_id: String
              $is_completed: Boolean = false
            ) {
              insert_todos(
                objects: {
                  id: $id
                  text: $text
                  user_id: $userId
                  is_completed: $is_completed
                  parent_id: $parent_id
                }
              ) {
                returning {
                  id
                  text
                  user_id
                  is_completed
                  parent_id
                }
              }
            }
          `,
          variables: {
            text: this.newItem,
            userId: this.currentUser.uid,
            is_completed: false,
            id: shortid.generate(),
            parent_id
          },
          update: (cache, { data: { insert_todos } }) => {
            const { todos } = cache.readQuery({
              query: GET_TODOS,
              variables: {
                userId: this.currentUser.uid,
                parentId: this.parent || null
              }
            });
            todos.push(insert_todos.returning[0]);
            cache.writeQuery({
              query: GET_TODOS,
              data: { todos },
              variables: {
                userId: this.currentUser.uid,
                parentId: this.parent || null
              }
            });
          }
        })
        .catch(error => console.error(error));
    },
    deleteItem(id) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($todoId: String, $userId: String) {
              delete_todos(
                where: { id: { _eq: $todoId }, user_id: { _eq: $userId } }
              ) {
                returning {
                  id
                }
              }
            }
          `,
          variables: {
            userId: this.currentUser.uid,
            todoId: id
          },
          update: (cache, { data: { delete_todos } }) => {
            const { todos } = cache.readQuery({
              query: GET_TODOS,
              variables: {
                userId: this.currentUser.uid,
                parentId: this.parent || null
              }
            });
            const deleteIndexes = [];
            delete_todos.returning.forEach(delete_todo =>
              todos.some((todo, index) => {
                const removable = delete_todo.id === todo.id;
                if (removable) {
                  deleteIndexes.push(index);
                }
                return removable;
              })
            );
            cache.writeQuery({
              query: GET_TODOS,
              variables: {
                userId: this.currentUser.uid,
                parentId: this.parent || null
              },
              data: {
                todos: todos.filter(
                  (todo, index) => deleteIndexes.indexOf(index) === -1
                )
              }
            });
          },
          optimisticResponse: {
            __typename: "Mutation",
            delete_todos: {
              __typename: "todos_mutation_response",
              returning: [
                {
                  __typename: "todos",
                  id
                }
              ]
            }
          }
        })
        .catch(error => console.error(error));
    },
    checkItem(id, is_completed) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation update_todos(
              $todoId: String
              $is_completed: Boolean
              $userId: String
            ) {
              update_todos(
                _set: { is_completed: $is_completed }
                where: { id: { _eq: $todoId }, user_id: { _eq: $userId } }
              ) {
                returning {
                  id
                  is_completed
                }
              }
            }
          `,
          variables: {
            userId: this.currentUser.uid,
            todoId: id,
            is_completed: !is_completed
          },
          update: (cache, { data: { update_todos } }) => {
            const { todos } = cache.readQuery({
              query: GET_TODOS,
              variables: {
                userId: this.currentUser.uid,
                parentId: this.parent || null
              }
            });
            cache.writeQuery({
              query: GET_TODOS,
              variables: {
                userId: this.currentUser.uid,
                parentId: this.parent || null
              },
              data: {
                todos: todos.map((todo, index) =>
                  todo.id === id
                    ? {
                        ...todo,
                        is_completed: !todo.is_completed
                      }
                    : todo
                )
              }
            });
          },
          optimisticResponse: {
            __typename: "Mutation",
            update_todos: {
              __typename: "todos_mutation_response"
            }
          }
        })
        .catch(error => console.error(error));
    },
    toggleAll(allChecked) {
      this.todos.forEach(({ id }) => this.checkItem(id, allChecked));
    },
    clearCompleted() {
      this.completed.forEach(({ id }) => this.deleteItem(id));
    }
  }
};
</script>
