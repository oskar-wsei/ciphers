<script lang="ts">
  import { Route, Router } from 'svelte-routing';
  import Home from './routes/Home.svelte';
  import Header from './lib/components/Header.svelte';
  import { ciphers } from './lib/data/ciphers';
</script>

<Router>
  <Header />
  <Route path="/ciphers" component={Home} />
  
  {#each ciphers as cipher}
    <Route path={`/ciphers/${cipher.key}`} component={cipher.component} />
  {/each}
</Router>
