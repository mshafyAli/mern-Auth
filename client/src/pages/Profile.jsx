import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice.js";
// import axios from "axios";

function Profile() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  // const [errorr,setErrorr] = useState(false);

  const { currentUser, loading,error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  // const submitHandler = async (e) => {
  //   e.preventDefault();
  //   try {
  //     dispatch(updateUserStart);
  //     const userId = currentUser?.data?._id || currentUser._id;
  //     const res = await axios.post(`/api/user/update/${userId}`, formData);

  //     console.log(res.data.data);
  //     dispatch(updateUserSuccess);
  //     setUpdateSuccess(true);
  //   } catch (error) {
  //     dispatch(updateUserFailure());
  //     setErrorr(true);
  //     console.log(error);
  //   }
  // };

  // const submitHandler = async (e) => {
  //   e.preventDefault();
  //   try {
  //     dispatch(updateUserStart());
  //     const userId = currentUser?.data?._id || currentUser._id;
  //     console.log(userId);
  //     const res = await axios.post(`/api/user/update/${userId}`, formData, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     const data = res.data;

  //     if (data.success === false) {
  //       dispatch(updateUserFailure(data));
  //       console.log(data);
  //       return;
  //     }

  //     dispatch(updateUserSuccess(data));
  //     setUpdateSuccess(true);
  //   } catch (error) {
  //     setErrorr(true);
  //     dispatch(updateUserFailure(error));
  //   }
  // };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      // const userId = currentUser.data._id === "google.com"
      // ? currentUser.providerData[0]?.uid
      // : currentUser._id;
      const userId = currentUser?.data?._id ||currentUser._id;

      console.log(currentUser);
      console.log("UserID:", userId); // Log the user ID

      const res = await fetch(`/api/user/update/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        console.log(data);
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const deleteHandler = async() =>{
    try{
      dispatch(deleteUserStart());
      const userId = currentUser?.data?._id || currentUser._id;
      console.log(userId);
      const res = await fetch(`/api/user/delete/${userId}`,{
        method:"DELETE"
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data));
        console.log(data);
        return;
      }
      dispatch(deleteUserSuccess(data));
      // localStorage.clear();
      // window.location.reload();
    

    } catch(err){
      dispatch(deleteUserFailure(err));
      
      console.log(err);
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <form action="" onSubmit={submitHandler} className="flex flex-col gap-4">
        <img
          src={
            formData.profilePicture ||
            currentUser?.data?.profilePicture ||
            currentUser?.profilePicture
          }
          alt="profile"
          className="w-24 h-24 self-center rounded-full object-cover  cursor-pointer mt-2 "
          onClick={() => fileInputRef.current.click()}
        />
        <p className="text-sm self-center">
          {imageError ? (
            <span className="text-red-700">
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className="text-slate-700">{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>

        <input
          defaultValue={currentUser?.data?.username || currentUser?.username}
          type="text"
          id="username"
          placeholder="UserName"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          defaultValue={currentUser?.data?.email || currentUser?.email}
          type="email"
          id="Email"
          placeholder="Email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />

        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={deleteHandler} className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-green-700 mt-5">
        {updateSuccess && "user is updated"}
      </p>
      <p className="text-red-700 mt-5">{error && "something wwent wrong"}</p>
    </div>
  );
}

export default Profile;
