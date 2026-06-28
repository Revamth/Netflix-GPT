import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";

// Single source of truth for auth state. The listener is registered ONCE here
// (previously it lived in Header, which mounts on every route → duplicate
// listeners and racing navigation). It only syncs Redux; navigation is derived
// from the resulting user state below.
const AppLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  // Gate redirects until Firebase reports the initial (persisted) auth state,
  // so a logged-in user refreshing /browse isn't briefly bounced to Login.
  const [authResolved, setAuthResolved] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const { uid, email, displayName } = firebaseUser;
        dispatch(addUser({ uid, email, displayName }));
      } else {
        dispatch(removeUser());
      }
      setAuthResolved(true);
    });
    return () => unsubscribe();
  }, [dispatch]);

  // Redirect on auth transitions: signed-in users go to Browse, signed-out
  // users go to the Login page.
  useEffect(() => {
    if (authResolved) navigate(user ? "/browse" : "/");
  }, [user, authResolved, navigate]);

  return <Outlet />;
};

export default AppLayout;
