<template>
  <div class="home">
    <Statistics />
  </div>
</template>

<script>
// @ is an alias to /src
import Statistics from '@/components/Statistics.vue';

export default {
  name: 'home',
  components: {
    Statistics
  }
};
</script>
