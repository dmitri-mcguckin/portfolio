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
          <label for="description">Description:</label><br>
          <textarea name="description" v-model.trim="description" rows="8" max-rows="9" cols="80" max-cols="85" placeholder="Add Description"></textarea>
        </div>

        <div class="form-control">
          <label for="image_file">Project Image:</label><br>

          <div class="dropbox">
            <input @change="selectedFile($event)" :enabled="!is_uploading" type="file" ref="fileInput" name="project_image" accept="image/*" class='input-file'>
            <p v-if="no_file">Drag-n-drop or click to select files.</p>
            <p v-if="is_uploading && !uploaded">Uploading image...</p>
            <p v-if="uploaded">Uploaded {{image}}!</p>
          </div>
          <input v-if="!is_uploading" @click="uploadFile()" type="button" value="Upload">
        </div>

        <input type="submit" value="Save">
        <input @click="onCancelForm" type="button" value="Cancel">
      </fieldset>
    </form>
  </div>
</template>

<script>
  const axios = require('axios')
  export default {
    name: 'ProjectForm',
    data() {
      return {
        uid: null,
        title: null,
        description: null,
        no_file: true,
        is_uploading: false,
        uploaded: false
      };
    },
    watch: {
      project: function(new_project) {
        this.clearForm();
        this.uid = new_project.uid;
        this.title = new_project.title;
        this.description = new_project.description;
        this.image = null;
        this.image_age = -1;
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
        this.no_file = false;
      },
      async uploadFile() {
        this.is_uploading = true;
        const form_data = new FormData();
        form_data.append('file', this.form_file);

        axios.post('api/image/' + this.form_file.name, form_data).then(async (res) => {
          this.image = res.data.url;
          this.image_age = res.data.age;
          console.log(this.image);
        }).catch(err => console.error(err));
        this.uploaded = true;
      },
      onSubmitForm(event) {
        event.preventDefault();

        const project = {
          uid: this.uid,
          title: this.title,
          description: this.description,
          url: this.image,
          age: this.image_age,
        }

        this.clearForm();
        this.$emit('submit-form', project, this.project === null);
      },
      onCancelForm() {
        this.clearForm();
        this.$emit('cancel-form');
      },
      clearForm() {
        this.title = null;
        this.description = null;
        this.image = null;
        this.image_age = -1;
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
