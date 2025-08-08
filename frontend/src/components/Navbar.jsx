import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, User, Shield } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center px-20 gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <h1 className="text-3xl font-extrabold">
                <span className="text-yellow-500 text-4xl">Buzz</span>
                <span className="text-blue-600 text-2xl">it</span>
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {authUser && (
              <>
                {authUser.role === 'admin' && (
                  <Link to="/admin" className="btn btn-sm btn-outline gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}

                {/* Only show profile link for regular users */}
                {authUser.role !== 'admin' && (
                  <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>
                )}

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
