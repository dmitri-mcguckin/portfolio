<template>
  <div class="content">
    <Projects @edit-project="onEditProject" @delete-project="onDeleteProject" :projects='projects' :show_actions='form_state == 3' />

    <div class="projects-actions">
      <Button :text="(form_state == 0) ? 'Edit Projects' : 'Close'" :color="(form_state == 3) ? 'red' : 'blue'" @click='toggleProjectActions' />
      <Button v-show="form_state == 0" text='New Project' color='green' @click='onAddProject' />
    </div>
  </div>

  <ProjectForm v-show="form_state == 1" @submit-form="onSubmitForm" @cancel-form="onCancelForm" />
  <ProjectForm v-show="form_state == 2" @submit-form="onSubmitForm" @cancel-form="onCancelForm" :project='selected_project' />
</template>

<script>
  import Projects from './components/Projects';
  import Button from './components/Button';
  import ProjectForm from './components/ProjectForm';
  const states = {
    CLOSED: 0,
    ADD_CONTENT: 1,
    EDIT_CONTENT: 2,
    EDIT_PROJECTS: 3,
  }

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
        projects: [],
        selected_project: null,
        form_state: states.CLOSED,
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
         this.form_state = (this.form_state == states.CLOSED) ? states.EDIT_PROJECTS : states.CLOSED;
      },
      onAddProject() {
        this.onCancelForm(); // Clear the form
        this.form_state = states.ADD_CONTENT; // Change state
      },
      onEditProject(uid) {
        this.onCancelForm(); // Clear the form

        this.form_state = states.EDIT_CONTENT; // Change state
        this.selected_project = this.projects.find(p => p.uid == uid); // Populate form with selected project
      },
      onDeleteProject(uid){
        this.onCancelForm(); // Clear the form

        const delete_project = this.projects.find(p => p.uid == uid); // Find the project to delete by UID

        // Delete the project
        this.apiDelete(delete_project).then(() => {
          this.uiDelete(delete_project.uid);
        }).catch((err) => {
          console.error(err);
        });
      },
      onSubmitForm(project, is_add) {
        this.onCancelForm(); // Clear the form

        if(is_add){ // Make an add request to the API
          this.apiAdd(project).then((resource) => {
            console.debug('Received from API: ' + resource);
            this.uiAdd(resource); // Add new card to the UI
          }).catch((err) => {
            console.error(err);
          });
        }
        else { // Make an update request to the API
          this.apiUpdate(project).then((resource) => {
            console.debug('Received from API: ' + resource);
            this.uiUpdate(resource); // Update the existing card in the UI
          }).catch((err) => {
            console.error(err);
          });
        }
      },
      onCancelForm() {
        this.form_state = states.CLOSED;
      },
      uiAdd(project) {
        this.projects.push(project);
      },
      uiUpdate(project) {
        var index = this.projects.findIndex(p => p.uid == project.uid);
        this.projects[index] = project;
      },
      uiDelete(uid) {
        this.projects = this.projects.filter(p => p.uid != uid);
      },
      async apiGetProjects() {
        const res =  await fetch('api/projects');
        if(!res.ok){
          throw Error('Got a ' + res.status + ' Response from server: ' + res.message);
        }

        return await res.json();
      },
      async apiAdd(project) {
        const req = new Request('api/project', {
          method: 'POST',
          mode: 'cors',
          headers:  {'content-type': 'application/json'},
          body: JSON.stringify(project),
        });

        const res = await fetch(req);
        if(!res.ok){
          throw Error('Got a ' + res.status + ' Response from server: ' + res.message);
        }
        const body = await res.json();
        return body.project;
      },
      async apiUpdate(project) {
        const req = new Request('api/project/' + project.uid, {
          method: 'PATCH',
          mode: 'cors',
          headers:  {'content-type': 'application/json'},
          body: JSON.stringify(project),
        });

        const res = await fetch(req);
        if(!res.ok){
          throw Error('Got a ' + res.status + ' Response from server: ' + res.message);
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
            throw Error('Got a ' + res.status + ' Response from server: ' + res.message);
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
