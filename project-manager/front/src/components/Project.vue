<template>
  <div class="project">
    <img :src="project.url" alt="[image not available]">

    <div class="header">
      <h3>{{project.title}}</h3>

      <div class="actions" v-show="show_actions">
        <i @click="$emit('edit-project', project.uid)" class='fas fa-edit'></i>
        <i @click="$emit('delete-project', project.uid)" class='fas fa-trash'></i>
      </div>
    </div>
    <p>{{project.description}}</p>
    <footer>({{project.uid}})</footer>
  </div>
</template>

<script>
  export default {
    name: 'Project',
    props: {
      project: Object,
      show_actions: Boolean,
    },
    emits: ['edit-project', 'delete-project'],
  }
</script>

<style scoped>
  .project {
    margin: 1em;
    padding: 1em;
    max-width: 90vw;
    max-height: 90vh;
    border-radius: 10px;
    background-color: #ececec;
  }

  .header :is(h3, i) {
    display: inline;
  }

  .header i {
    padding: 0.2em;
  }

  .actions {
    float: right;
  }

  i.fa-edit {
    color: blue;
  }

  i.fa-trash {
    color: red;
  }
</style>
