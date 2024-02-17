<script lang="ts">
  import { Link } from 'svelte-routing';
  import { ciphers } from '../lib/data/ciphers';
</script>

<div class="container my-5">
  <h1 class="mb-4">Szyfry</h1>

  {#each ciphers as cipher}
    <Link class="card text-decoration-none mb-4" to={`/ciphers/${cipher.key}`}>
      <div class="card-body">
        <h3 class="m-0">{cipher.name}</h3>
      </div>
    </Link>
  {/each}
</div>
