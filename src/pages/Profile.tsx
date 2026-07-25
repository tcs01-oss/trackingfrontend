import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { useEffect, useState } from 'react';
import userSix from '../images/logo/logo1.png';
import { Link } from 'react-router-dom';
import { FaCamera, FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '',
    role: 'Administrator',
    about: 'Tracking System Administrator'
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(prev => ({
          ...prev,
          name: parsed.name || parsed.fullName || prev.name,
          email: parsed.email || prev.email,
          phone: parsed.phone_number || parsed.phone || prev.phone,
        }));
      }
    } catch (e) {
      console.error('Error parsing user data', e);
    }
  }, []);

  return (
    <>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="Profile" />

        <div className="overflow-hidden  rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        
          <div className="px-4 pb-6 mt-22 text-center lg:pb-8 xl:pb-11.5">
            <div className="relative mx-auto -mt-22 h-30 w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:w-44 sm:p-3">
              <div className="relative drop-shadow-2 h-full w-full">
                <img src={userSix} alt="profile" className="h-full w-full rounded-full object-cover" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                {user.name}
              </h3>
              <p className="font-medium">{user.role}</p>
              
              <div className="mx-auto mt-4.5 mb-5.5 grid max-w-94 grid-cols-1 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
                  <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                    <span className="font-semibold text-black dark:text-white">
                      Status:
                    </span>
                    <span className="text-sm text-success">Active</span>
                  </div>
              </div>

              <div className="mx-auto max-w-180">
                <h4 className="font-semibold text-black dark:text-white">
                  About Me
                </h4>
                <p className="mt-4.5">
                  {user.about}
                </p>
              </div>

              <div className="mt-6.5">
                  <h4 className="mb-3.5 font-medium text-black dark:text-white">
                      Contact Details
                  </h4>
                  <div className="flex flex-col items-center justify-center gap-4">
                      <div className="flex items-center gap-2">
                          <FaEnvelope className="text-primary" />
                          <span>{user.email}</span>
                      </div>
                      {user.phone && (
                          <div className="flex items-center gap-2">
                              <FaPhone className="text-primary" />
                              <span>{user.phone}</span>
                          </div>
                      )}
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
