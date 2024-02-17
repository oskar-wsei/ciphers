<script lang="ts">
  import { Link } from 'svelte-routing';
  import { ciphers } from '../data/ciphers';
</script>

<header>
  <ul>
    <li>
      <Link class="nav-link p-3" to="/ciphers">Strona główna</Link>
    </li>
    {#each ciphers as cipher}
      <li>
        <Link class="nav-link p-3" to={`/ciphers/${cipher.key}`}>{cipher.name}</Link>
      </li>
    {/each}
  </ul>
</header>

<style lang="scss">
  header {
    background-color: #222;
    color: #eee;
  }

  ul {
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0 0.5rem;
  }
</style>
