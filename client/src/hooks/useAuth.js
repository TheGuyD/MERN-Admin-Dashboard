import { useSelector, useDispatch } from 'react-redux';
import { useDebugValue } from 'react';
import { setAuth, logout } from 'store/index'; // Import your actions

const useAuth = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useDebugValue(auth, (auth) => (auth?.user ? 'Logged In' : 'Logged Out'));

  return {
    auth,
    setAuth: (data) => dispatch(setAuth(data)),
    logout: () => dispatch(logout()),
  };
};

export default useAuth;
