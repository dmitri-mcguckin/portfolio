<template>
  <div class="content">
    <Projects @edit-project="onEditProject" @delete-project="onDeleteProject" :projects='projects' :show_actions='show_actions' />

    <div class="projects-actions" v-show="!adding_project">
      <Button :text="(!show_actions) ? 'Edit Projects' : 'Done'" color='blue' @click='toggleProjectActions' />
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
    },
    data() {
      return {
        adding_project: false,
        editing_project: false,
        show_actions: false,
        edit_selected: null,
        projects: [],
      }
    },
    async created() {
      this.apiGetProjects().then((projects) => {
        this.projects = projects;
      }).catch((err) => {
        console.log(err);
        this.projects = [];
      });
    },
    methods: {
      toggleProjectActions() {
         this.show_actions = !this.show_actions;
      },
      onAddProject() {
        this.onCancelForm();

        this.adding_project = true;
        this.show_actions = false;
      },
      onEditProject(uid) {
        this.onCancelForm();

        this.editing_project = true;
        this.edit_selected = this.projects.find(p => p.uid == uid);
      },
      onDeleteProject(uid){
        this.onCancelForm();

        const deleted_project = this.projects.find(p => p.uid == uid);
        this.apiDelete(deleted_project).then((is_deleted) => {
          if(is_deleted) {
            this.uiDelete(deleted_project.uid);
          }
          else {
            console.error('The project was not deleted!');
          }
        });
      },
      onSubmitForm(project, is_add) {
        this.onCancelForm();
        try{
          if(is_add){
            this.apiAdd(project).then((resource) => {
              this.uiAdd(resource);
            }).catch(err => console.error(err));
          }
          else {
            this.apiUpdate(project).then((resource) => {
              this.uiUpdate(resource);
            }).catch(err => console.error(err));
          }
        }
        catch(err) {
          console.log('An error occured:', err);
        }
      },
      onCancelForm() {
        this.adding_project = false;
        this.editing_project = false;
      },
      async apiGetProjects() {
        const res =  await fetch('api/projects');
        if(!res.ok){
          throw Error('' + res.status, 'Response:', res.message);
        }

        const data = await res.json();
        return data;
      },
      uiAdd(project) {
        this.projects.push(project);
      },
      uiUpdate(project) {
        this.uiDelete(project.uid);
        this.uiAdd(project);
      },
      uiDelete(uid) {
        this.projects = this.projects.filter(p => p.uid != uid);
      },
      async apiAdd(project) {
        const options = {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'appliction/json',
            'title': project.title,
            'description': project.description,
            'url': project.url,
            'age': project.age,
          }),
        };

        const request = new Request('api/project', options);
        const res = await fetch(request);

        if(!res.ok){
          throw Error('' + res.status + 'Response:', res.message);
        }
        const body = await res.json();
        return body.project;
      },
      async apiUpdate(project) {
        const options = {
          method: 'PATCH',
          headers: new Headers({
            'Content-Type': 'appliction/json',
            'title': project.title,
            'description': project.description,
            'url': project.url,
            'age': project.age,
          }),
        };

        const request = new Request('api/project/' + project.uid, options);
        const res = await fetch(request);

        if(!res.ok){
          throw Error('' + res.status + 'Response:', res.message);
        }
        const body = await res.json();
        return body.project;
      },
      async apiDelete(project) {
        const options = {
          method: 'DELETE',
          headers: new Headers({'Content-Type': 'appliction/json'}),
        };
        const request = new Request('api/project/' + project.uid, options);

        if(confirm('Are you sure?')){
          const res = await fetch(request);
          if(!res.ok){
            throw Error('' + res.status, 'Response:', res.message);
          }

          return true;
        }
        return false;
      },
    },
  };
</script>

<style>
  #app {
    font-family: Helvetica, Arial, sans-serif;
  }

  .content {
    display: block;
  }

  .projects-actions button {
    display: inline-block;
    margin: 0.5em;
  }
</style>
