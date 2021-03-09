<template>
  <div class="content">
    <Projects @edit-project="onEditProject" @delete-project="onDeleteProject" :projects='projects' :show_actions='show_actions' />

    <div class="projects-actions" v-show="!adding_project">
      <Button :text="(!show_actions) ? 'Edit Projects' : 'Update'" color='blue' @click='toggleProjectActions' />
      <Button v-show="!show_actions" text='New Project' color='green' @click='onAddProject' />
    </div>
  </div>

  <ProjectForm v-show="adding_project" @submit-form="onSubmitForm" @cancel-form="onCancelForm" />
  <ProjectForm v-show="editing_project" @submit-form="onSubmitForm" @cancel-form="onCancelForm" :project='edit_selected' />
</template>

<script>
  import Projects from './components/Projects';
  import Button from './components/Button';
  import ProjectForm from './components/ProjectForm';

  export default {
    name: 'App',
    components: {
      Button,
      Projects,
      ProjectForm,
    },
    watch: {
      projects: function() {
        this.projects = this.projects.sort(p => p.id);
      }
    },
    data() {
      return {
        adding_project: false,
        editing_project: false,
        show_actions: false,
        edit_selected: null,
        projects: []
      }
    },
    created() {
      this.projects = [
        {
          id: 0,
          title: 'Project 1',
          description: 'Something related to 1...',
          banner_img: 'project-1.png',
        },
        {
          id: 1,
          title: 'Project 2',
          description: 'Something related to 2...',
          banner_img: 'project-2.png',
        },
        {
          id: 2,
          title: 'Project 3',
          description: 'Something related to 3...',
          banner_img: 'project-3.png',
        }];
    },
    methods: {
      toggleProjectActions() {
         this.show_actions = !this.show_actions;
         if(!this.show_actions) {
           this.updatePersistence();
         }
      },
      onAddProject() {
        this.onCancelForm();

        this.adding_project = true;
        this.show_actions = false;
      },
      onEditProject(id) {
        this.onCancelForm();

        this.editing_project = true;
        this.edit_selected = this.projects.find(p => p.id == id);

        console.log(this.edit_selected);
      },
      onDeleteProject(id){
        if(confirm('Are you sure?')){
          this.projects = this.projects.filter(p => p.id != id);
        }
      },
      onSubmitForm(project, is_add) {
        this.onCancelForm();
        if(!is_add){ // If it's an edit, remove the outdated project first
          this.projects = this.projects.filter(p => p.id != project.id);
        }
        this.projects.push(project);
        this.updatePersistence();
      },
      onCancelForm() {
        this.adding_project = false;
        this.editing_project = false;
      },
      updatePersistence() {
        console.log('Forwarding changes to firebase...');
      },
    },
  };
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }

  .content {
    display: block;
  }

  .projects-actions button {
    display: inline-block;
    margin: 0.5em;
  }
</style>
