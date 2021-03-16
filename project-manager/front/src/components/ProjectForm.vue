<template>
  <div class="content">
    <form @submit="onSubmitForm" class="add-form">
      <fieldset>
        <legend>{{(project == null) ? "Add New" : "Edit"}} Project:</legend>

        <div class="form-control">
          <label for="title">Title:</label><br>
          <input type="text" v-model.trim="title" name="title" placeholder="Add Title">
        </div>

        <div class="form-control">
          <label for="subtitle">Subtitle:</label><br>
          <input type="text" v-model.trim="subtitle" name="subtitle" placeholder="Add Subtitle">
        </div>

        <div class="form-control">
          <label for="description">Description:</label><br>
          <textarea name="description" v-model.trim="description" rows="8" max-rows="9" cols="80" max-cols="85" placeholder="Add Description"></textarea>
        </div>

        <div class="form-control">
          <label for="image_file">Project Images:</label><br>

          <div class="dropbox">
            <input @change="selectedFile($event)" :enabled="upload_state != 1" type="file" ref="fileInput" name="project_image" accept="image/*" class='input-file'>
            <p v-if="upload_state == 0">Drag-n-drop or click to select files.</p>
            <p v-if="upload_state == 1">Uploading image...</p>
            <p v-if="upload_state == 2 || upload_state == 3">Uploaded {{images}}!</p>
          </div>
          <input v-if="upload_state != 1" @click="uploadFile()" type="button" value="Upload">
        </div>

        <input type="submit" value="Save">
        <input @click="onCancelForm" type="button" value="Cancel">
      </fieldset>
    </form>
  </div>
</template>

<script>
  const states = {
    NOT_STARTED: 0,
    STARTED: 1,
    SUCCESS: 2,
    FAILED: 3,
  };
  const axios = require('axios');
  export default {
    name: 'ProjectForm',
    data() {
      return {
        uid: null,
        title: null,
        subtitle: null,
        description: null,
        images: [],
        upload_state: states.NOT_STARTED,
      };
    },
    watch: {
      project: function(edit_project) {
        this.clearForm();
        this.uid = edit_project.uid;
        this.title = edit_project.title;
        this.subtitle = edit_project.subtitle;
        this.description = edit_project.description;
        this.images = edit_project.images;
        this.upload_state = states.SUCCESS;
      },
    },
    props : {
       project: {
         type: Object,
         default: null,
       }
    },

    methods: {
      selectedFile(event) {
        this.form_file = event.target.files[0]
      },
      async uploadFile() {
        this.upload_state = states.STARTED; // Change state

        // Create the form data
        const form_data = new FormData();
        form_data.append('file', this.form_file);

        // Send the form data to the API
        axios.post('api/image/' + this.form_file.name, form_data)
             .then((res) => {
          console.debug('Image upload response:', res);
          this.upload_state = states.SUCCESS; // Change state
          this.images = res.data.images;
        }).catch((err) => {
          this.upload_state = states.FAILED; // Change state
          console.error(err);
        });
      },
      onSubmitForm(event) {
        event.preventDefault();

        const project = {
          uid: this.uid,
          title: this.title,
          subtitle: this.subtitle,
          description: this.description,
          images: this.images,
        };


        this.clearForm();
        this.$emit('submit-form', project, this.project === null);
      },
      onCancelForm() {
        this.clearForm();
        this.$emit('cancel-form');
      },
      clearForm() {
        this.uid = null;
        this.title = null;
        this.subtitle = null;
        this.description = null;
        this.images = [];
        this.upload_state = states.NOT_STARTED;
      }
    },
    emits: ['submit-form', 'cancel-form'],
  }
</script>

<style scoped>
  .content {
    position: absolute;
    background-color: #ececec;
    top: 25vh;
    left: 25vw;
    z-index: 128;
    margin: 0 auto;
    max-width: 50vw;
  }

  input,
  textarea {
    margin-bottom: 2em;
  }

  textarea {
    padding: 0.5em;
    margin-bottom: 2em;

    min-width: 10vw;
    min-height: 10vh;
    max-width: 45vw;
    max-height: 30vh;
  }

  .input-file {
    opacity: 0;
    width: 100%;
    min-height: 15em;
    cursor: pointer;
  }

  .dropbox {
    outline: 3px dashed gray;
    outline-offset: -1em;
    position: relative;
    max-height: 12em;
    padding: 0.5em;
    color: dimgray;
    background: lightgreen;
    border-radius: 10px;
  }

  .dropbox:hover {
    background: lightblue;
  }

  .dropbox p {
    position: relative;
    bottom: 8em;
    margin: 0;
    text-align: center;
  }
</style>
