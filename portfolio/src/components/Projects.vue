<template>
  <div class='content' :key='p.id' v-for="p in projects">
    <Project @edit-project="$emit('edit-project', p.id)" @delete-project="$emit('delete-project', p.id)" :project='p' :show_actions="show_actions" />
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
      projects: Array,
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
