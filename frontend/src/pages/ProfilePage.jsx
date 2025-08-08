import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, User, ArrowLeft } from "lucide-react";

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-[#aed9f5] rounded-xl p-6 space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={handleGoBack}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center flex-1">
              <h1 className="text-2xl font-semibold">Profile</h1>
              <p className="mt-1 text-sm text-gray-600">Your profile information</p>
            </div>
            <div className="w-9"></div> {/* For balance */}
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="size-32 rounded-full border-4 border-white bg-white flex items-center justify-center text-4xl font-bold text-gray-800">
                {getInitials(authUser.fullName)}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
