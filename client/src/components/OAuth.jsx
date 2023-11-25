import { GoogleAuthProvider, signInWithPopup,getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

import { app } from "../firebase";
import axios from "axios";
import { signInSuccess } from "../redux/user/userSlice";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const googleHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const response = await axios.post('/api/auth/google',{
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      });
      dispatch(signInSuccess(response))
      navigate('/');
      console.log(response);
    }catch (err) {
      console.log("could not login with google", err);
    }
  };

  return (
    <button
      type="button"
      onClick={googleHandler}
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with Google
    </button>
  );
};

export default OAuth;
