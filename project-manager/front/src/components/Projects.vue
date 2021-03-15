<template>
  <div class='content' v-for="p in projects" :key='p.uid'>
    <Project @edit-project="$emit('edit-project', p.uid)" @delete-project="$emit('delete-project', p.uid)" :project='p' :show_actions="show_actions" />
  </div>
</template>

<script>
  import Project from './Project'

  export default {
    name: 'Projects',
    components: {
      Project,
    },
    props: {
      projects: {
        type: Array,
        default: null,
      },
      show_actions: Boolean,
    },
    emits: ['edit-project', 'delete-project'],
  }
</script>

<style scoped>
  .content {
    display: inline-flex;
  }
</style>
