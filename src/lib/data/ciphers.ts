import CaesarCipher from '../../routes/ciphers/CaesarCipher.svelte';
import PolybiusCipher from '../../routes/ciphers/PolybiusCipher.svelte';
import TrithemiusCipher from '../../routes/ciphers/TrithemiusCipher.svelte';

export const ciphers = [
  {
    key: 'caesar',
    name: 'Szyfr Cezara',
    component: CaesarCipher
  },
  {
    key: 'polybius',
    name: 'Szyfr Polibiusza',
    component: PolybiusCipher
  },
  {
    key: 'trithemius',
    name: 'Szyfr Tritemisuza',
    component: TrithemiusCipher
  },
];
