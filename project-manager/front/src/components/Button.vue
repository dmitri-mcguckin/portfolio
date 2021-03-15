<template>
  <button :style="{background: color}">{{text}}</button>
</template>

<script>
  export default {
    name: 'Button',
    props: {
      text: {
        default: 'click me',
        type: String,
      },
      color: {
        default: 'black',
        type: String,
      },
      visible: {
        type: Boolean,
        default: true,
      }
    },
  }
</script>

<style scoped>
  button {
    font-weight: bold;
    padding: 1em;
    color: white;
    border-width: 0;
    border-style: none;
    border-radius: 10%;
  }

  button:hover,
  button:focus {
    opacity: 0.7;
  }
</style>
