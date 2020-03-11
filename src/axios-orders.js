import axios from 'axios';

const instance = axios.create({
   baseURL: 'https://react-my-burger-fc00d.firebaseio.com/'
});

export default instance;