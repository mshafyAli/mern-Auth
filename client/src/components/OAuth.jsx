import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

import { app } from "../firebase";
import { signInSuccess } from "../redux/user/userSlice";
import { baseUrl } from "../../../core";
// import { baseUrl } from "../../../core";



function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const googleHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch(`${baseUrl}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      console.log(data);
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("could not login with google", error);
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
}

export default OAuth;
