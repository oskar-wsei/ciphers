<script lang="ts">
  import { PolybiusCheckerboard, PolybiusCipher } from '../../lib/ciphers';
  import { AlphabetUtils } from '../../lib/utils';

  let encryptMessage = '';
  let encryptKey = filledCheckerboard();
  let encryptKeyErrorMessage = '';
  let encryptEncrypted = '';

  let decryptMessage = '';
  let decryptKey = filledCheckerboard();
  let decryptKeyErrorMessage = '';
  let decryptEncrypted = '';

  $: encryptKey, onEncryptKeyChange();
  $: decryptKey, onDecryptKeyChange();

  function filledCheckerboard(): PolybiusCheckerboard {
    const checkerboard = new PolybiusCheckerboard(7, 5);
    AlphabetUtils.alphabet.forEach((character, index) => (checkerboard.characters[index] = character));
    return checkerboard;
  }

  function encrypt(): void {
    encryptEncrypted = PolybiusCipher.encrypt(encryptMessage, encryptKey);
  }

  function decrypt(): void {
    decryptMessage = PolybiusCipher.decrypt(decryptEncrypted, decryptKey);
  }

  function onEncryptKeyChange(): void {
    const { missing } = validateKey(encryptKey);
    if (missing.length === 0) {
      encryptKeyErrorMessage = '';
      return;
    }
    encryptKeyErrorMessage = `Klucz nie zawiera liter: ${missing.join(', ')}!`;
  }

  function onDecryptKeyChange(): void {
    const { missing } = validateKey(decryptKey);
    if (missing.length === 0) {
      decryptKeyErrorMessage = '';
      return;
    }
    decryptKeyErrorMessage = `Klucz nie zawiera liter: ${missing.join(', ')}!`;
  }

  function validateKey(key: PolybiusCheckerboard): { missing: string[] } {
    const missing = AlphabetUtils.alphabet.filter((character) => !key.characters.includes(character));
    return { missing };
  }
</script>

<div class="container my-5">
  <h1 class="mb-4">Szyfr Polibiusza</h1>

  <div class="card mb-3">
    <div class="card-body">
      <div class="mb-3">
        <label for="encrypt-message" class="form-label">Tekst jawny</label>
        <textarea spellcheck="false" id="encrypt-message" class="form-control" bind:value={encryptMessage} />
      </div>
      <div class="mb-3">
        <label for="encrypt-key" class="form-label">Klucz</label>

        <div style={`display: grid; gap: 0.5rem; grid-template-columns: repeat(${encryptKey.width + 1}, 1fr)`}>
          <div class="key-header empty"></div>
          {#each { length: encryptKey.width } as _, x}
            <div class="key-header">{x + 1}</div>
          {/each}
          {#each { length: encryptKey.height } as _, y}
            <div class="key-header">{y + 1}</div>
            {#each { length: encryptKey.width } as _, x}
              <input
                type="text"
                class="form-control text-center"
                class:border-danger={!!encryptKeyErrorMessage}
                class:text-danger={!!encryptKeyErrorMessage}
                maxlength="1"
                bind:value={encryptKey.characters[x + y * encryptKey.width]}
              />
            {/each}
          {/each}
        </div>

        {#if encryptKeyErrorMessage}
          <div class="text-danger my-3">{encryptKeyErrorMessage}</div>
        {/if}
      </div>
      <div class="mb-3">
        <label for="encrypt-encrypted" class="form-label">Tekst zaszyfrowany</label>
        <textarea spellcheck="false" id="encrypt-encrypted" class="form-control" bind:value={encryptEncrypted} />
      </div>
      <button class="btn btn-primary" disabled={!!encryptKeyErrorMessage} on:click={encrypt}>Szyfruj</button>
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

        <div style={`display: grid; gap: 0.5rem; grid-template-columns: repeat(${decryptKey.width + 1}, 1fr)`}>
          <div class="key-header empty"></div>
          {#each { length: decryptKey.width } as _, x}
            <div class="key-header">{x + 1}</div>
          {/each}
          {#each { length: decryptKey.height } as _, y}
            <div class="key-header">{y + 1}</div>
            {#each { length: decryptKey.width } as _, x}
              <input
                type="text"
                class="form-control text-center"
                class:border-danger={!!decryptKeyErrorMessage}
                class:text-danger={!!decryptKeyErrorMessage}
                maxlength="1"
                bind:value={decryptKey.characters[x + y * decryptKey.width]}
              />
            {/each}
          {/each}
        </div>

        {#if decryptKeyErrorMessage}
          <div class="text-danger my-3">{decryptKeyErrorMessage}</div>
        {/if}
      </div>
      <div class="mb-3">
        <label for="decrypt-message" class="form-label">Tekst jawny</label>
        <textarea spellcheck="false" id="decrypt-message" class="form-control" bind:value={decryptMessage} />
      </div>
      <button class="btn btn-primary" disabled={!!decryptKeyErrorMessage} on:click={decrypt}>Deszyfruj</button>
    </div>
  </div>
</div>

<style lang="scss">
  .key-header {
    background-color: #222;
    color: #eee;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--bs-border-radius);
    padding: 0.375rem 0.75rem;
  }

  .empty {
    background-color: #eee;
    border: 1px solid #ddd;
  }
</style>
