<template>
  <div id="app">
    <!-- <router-view/> -->
    <HomePage />
  </div>
</template>

<script>

import HomePage from './components/HomePage'

export default {
  name: 'App',
  components: {
    HomePage
  },
}
</script>

<style>
  /* reset css */
  body, p, h1, h2, h3, h4, h5, h6, ul, ul > li {
    padding: 0;
    margin: 0;
  }
  #app {
    width: 100%;
    height: 100vh;
    padding: 0 10px;
    box-sizing: border-box;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background: #eeeeee;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
