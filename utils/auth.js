import cookie from 'js-cookie';
import Router from 'next/router';
import jwt from 'jsonwebtoken';

export const auth = token => {
  if (!token) {
    return false;
  }
  // Verify token
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    if (userId) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

export const handleLogin = token => {
  cookie.set('token', token);
  Router.push('/portfolio');
};

export const redirectUser = (ctx, location) => {
  // On server
  if (ctx.req) {
    // redirect
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    // On server
    Router.push(location);
  }
};

export const handleLogout = () => {
  cookie.remove('token');
  // use localStorage for universal logout
  window.localStorage.setItem('logout', Date.now());
  Router.push('/login');
};
