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
          <label for="image_file">Banner Image:</label><br>
          <input type="file" name="image_file" placeholder="Choose a file or drop here...">
        </div>

        <input type="submit" value="Save">
        <input @click="onCancelForm" type="button" value="Cancel">
      </fieldset>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'ProjectForm',
    data() {
      return {
        title: null,
        description: null,
        image_file: null,
      };
    },
    watch: {
      project: function(new_project) {
        this.title = new_project.title;
        this.description = new_project.description;
        this.image_file = new_project.image_file;
      },
    },
    props : {
       project: {
         type: Object,
         default: null,
       }
    },

    methods: {
      onSubmitForm(event) {
        event.preventDefault();

        if(!this.title) {
          alert('Title is a required field!');
        }
        else if(!this.description) {
          alert('Description is a required field!');
        }
        else {
          var pid = (this.project != null) ? this.project.id : Math.floor(Math.random() * 10000)
          const project = {
            id: pid,
            title: this.title,
            description: this.description,
            banner_img: this.image,
          }

          this.clearForm();
          this.$emit('submit-form', project, this.project === null);
        }
      },
      onCancelForm() {
        this.clearForm();
        this.$emit('cancel-form');
      },
      clearForm() {
        this.title = null;
        this.description = null;
        this.image = null;
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
</style>
