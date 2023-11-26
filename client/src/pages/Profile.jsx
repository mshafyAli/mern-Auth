import react from "react";
import { useSelector } from "react-redux";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>

      <form action="" className="flex flex-col gap-4">
        <img src={currentUser.data.profilePicture} alt="profile" className="w-24 h-24 self-center rounded-full object-cover  cursor-pointer mt-2 " />

        <input defaultValue={currentUser.data.username} type="text"  id="username" placeholder="UserName" className="bg-slate-100 p-3 rounded-lg" />

        <input defaultValue={currentUser.data.email} type="email"  id="Email" placeholder="Email" className="bg-slate-100 p-3 rounded-lg" />

        <input  type="password"  id="password" placeholder="Password" className="bg-slate-100 p-3 rounded-lg" />

        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>

      
    </div>
  );
}

export default Profile;
