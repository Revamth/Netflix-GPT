// Route-level layout that owns the single Firebase auth listener: syncs the
// user into Redux and redirects between Login (/) and Browse (/browse).
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";

const AppLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
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
