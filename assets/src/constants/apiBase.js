const { protocol } = document.location;
let apiBase = '';

if (!/^http/.test(protocol)) {
  apiBase = 'http://0.0.0.0:8000/api';
} else {
  apiBase = '/api';
}

export default apiBase;
