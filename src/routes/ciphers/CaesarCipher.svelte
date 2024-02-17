<script lang="ts">
  import { CaesarCipher } from '../../lib/ciphers';
  import { AlphabetUtils, ArrayUtils } from '../../lib/utils';

  const alphabetLength = AlphabetUtils.alphabet.length;
  const keyOptions = ArrayUtils.countMap(alphabetLength, (i) => i + 1);

  let encryptMessage = '';
  let encryptKey = 3;
  let encryptEncrypted = '';

  let decryptMessage = '';
  let decryptKey = 3;
  let decryptEncrypted = '';

  function encrypt(): void {
    encryptEncrypted = CaesarCipher.encrypt(encryptMessage, encryptKey);
  }

  function decrypt(): void {
    decryptMessage = CaesarCipher.decrypt(decryptEncrypted, decryptKey);
  }
</script>

<div class="container my-5">
  <h1 class="mb-4">Szyfr Cezara</h1>

  <div class="card mb-3">
    <div class="card-body">
      <div class="mb-3">
        <label for="encrypt-message" class="form-label">Tekst jawny</label>
        <textarea spellcheck="false" id="encrypt-message" class="form-control" bind:value={encryptMessage} />
      </div>
      <div class="mb-3">
        <label for="encrypt-key" class="form-label">Klucz</label>
        <select id="encrypt-key" class="form-select" bind:value={encryptKey}>
          {#each keyOptions as keyOption}
            <option value={keyOption}>{keyOption}</option>
          {/each}
        </select>
      </div>
      <div class="mb-3">
        <label for="encrypt-encrypted" class="form-label">Tekst zaszyfrowany</label>
        <textarea spellcheck="false" id="encrypt-encrypted" class="form-control" bind:value={encryptEncrypted} />
      </div>
      <button class="btn btn-primary" on:click={encrypt}>Szyfruj</button>
    </div>
  </div>

  <div class="card">
    <div class="card-body">
      <div class="mb-3">
        <label for="decrypt-encrypted" class="form-label">Tekst zaszyfrowany</label>
        <textarea spellcheck="false" id="decrypt-encrypted" class="form-control" bind:value={decryptEncrypted} />
      </div>
      <div class="mb-3">
        <label for="decrypt-key" class="form-label">Klucz</label>
        <select id="decrypt-key" class="form-select" bind:value={decryptKey}>
          {#each keyOptions as keyOption}
            <option value={keyOption}>{keyOption}</option>
          {/each}
        </select>
      </div>
      <div class="mb-3">
        <label for="decrypt-message" class="form-label">Tekst jawny</label>
        <textarea spellcheck="false" id="decrypt-message" class="form-control" bind:value={decryptMessage} />
      </div>
      <button class="btn btn-primary" on:click={decrypt}>Deszyfruj</button>
    </div>
  </div>
</div>
