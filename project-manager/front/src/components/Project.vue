<template>
  <div class="project">
    <img v-for="i in project.images" :key="i" :src="'api/image/' + i" alt="[image not available]">

    <div class="header">
      <h2>{{project.title}}</h2>
      <h4>{{project.subtitle}}</h4>

      <div class="actions" v-show="show_actions">
        <i @click="$emit('edit-project', project.uid)" class='fas fa-edit'></i>
        <i @click="$emit('delete-project', project.uid)" class='fas fa-trash'></i>
      </div>
    </div>
    <p>{{project.description}}</p>
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
    max-height: auto;
    border-radius: 10px;
    background-color: #ececec;
  }

  .project img {
    max-width: 40vw;
    max-height: auto;
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
