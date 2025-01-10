import { createApp, nextTick, onMounted } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');

export default app;

// 监听页面规定
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('scrollHeight', `${document.documentElement.scrollTop}:${location.pathname}`);
});
const [scrollHeight, pathname] = (sessionStorage.getItem('scrollHeight') || ':').split(':');
sessionStorage.removeItem('scrollHeight');
if (pathname === location.pathname) {
  setTimeout(() => {
    window.scrollTo({ top: scrollHeight, behavior: 'smooth' });
  }, 300);
}
