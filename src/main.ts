import './styles/app.scss';
import App from './App.svelte';

const targetId = 'app';
const target = document.getElementById(targetId);
if (!target) throw new Error(`Could not find the app root element with id ${targetId}!`);

const app = new App({ target });
export default app;
