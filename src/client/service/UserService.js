function register(username, email, password) {
  const data = { username, email, password };
  const request = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.toString().length.toString()
    },
    body: JSON.stringify(data)
  };
  return fetch('/api/register', request).then(res => res.json())
    .then((response) => {
      console.log('registration succeeded');
      if (response.code !== 0) {
        throw new Error(response.message);
      }
      return response.data;
    });
}

// response.code == 0 //succeeded
// response.code == 1 //failed
// response.code == 2 //invalid_token
// see more in file server/router/code.js
function login(username, password) {
  const data = { username, password };
  const request = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.toString().length.toString()
    },
    body: JSON.stringify(data)
  };
  return fetch('/api/login', request).then(res => res.json())
    .then((response) => {
      console.log('login succeeded');
      if (response.code !== 0) {
        throw new Error(response.message);
      }
      return response.data;
    });
}

function getProfile(id) {
  return fetch(`/api/getProfile/${id}`).then(res => res.json())
    .then((response) => {
      if (response.code !== 0) {
        throw new Error(response.message);
      }
      return response.data;
    }).catch((err) => {
      console.log(err);
    });
}

function identify() {
  return fetch('/api/me').then(res => res.json())
    .then((response) => {
      if (response.code !== 0) {
        throw new Error(response.message);
      }
      return response.data;
    });
}

function logout() {
  return fetch('/api/logout').then(res => res.json())
    .then((response) => {
      if (response.code !== 0) {
        throw new Error(response.message);
      }
      return response.data;
    });
}

const UserService = {
  register,
  login,
  getProfile,
  identify,
  logout
};

export default UserService;
