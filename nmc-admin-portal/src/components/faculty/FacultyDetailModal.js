import React, { useEffect, useState } from 'react';
import { FiX, FiAward } from 'react-icons/fi';
import FacultyServices from '../../services/FacultyServices';

const FacultyDetailModal = ({ isOpen, onClose, faculty: initialFaculty, idOrSlug }) => {
  const [faculty, setFaculty] = useState(initialFaculty || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const targetSlugOrId = idOrSlug || initialFaculty?.slug || initialFaculty?._id || initialFaculty?.id;

    if (targetSlugOrId) {
      setLoading(true);
      FacultyServices.getFacultyByIdOrSlug(targetSlugOrId)
        .then((res) => {
          if (res?.data) {
            setFaculty(res.data);
          } else {
            setFaculty(initialFaculty);
          }
        })
        .catch(() => {
          setFaculty(initialFaculty);
        })
        .finally(() => setLoading(false));
    } else {
      setFaculty(initialFaculty);
    }
  }, [isOpen, idOrSlug, initialFaculty]);

  if (!isOpen || (!faculty && !loading)) return null;

  const fullName = faculty?.fullName || faculty?.name || 'Faculty Member';
  const designation = faculty?.designation || '';
  const qualification = faculty?.qualifications || faculty?.qualification || '';
  const badgeTag = faculty?.badgeTag || faculty?.badge || '';
  const department = faculty?.department || faculty?.stream || 'B.B.A.';
  const experience = faculty?.experience || 'N/A';
  const overview = faculty?.overview || faculty?.biography || '';
  const keyHighlight = faculty?.keyHighlight || faculty?.highlight || '';
  const photoUrl = faculty?.photo_webp_url || faculty?.photo_url || faculty?.image || faculty?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  const expertiseList = Array.isArray(faculty?.expertise)
    ? faculty.expertise
    : (faculty?.expertise || '').split(',').map((item) => item.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden p-6 sm:p-8 my-8 text-left transition-all transform">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
        >
          <FiX className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
            Loading profile details...
          </div>
        ) : (
          <>
            {/* Top Header: Image & Main Info */}
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <img
                src={photoUrl}
                alt={fullName}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-sm border border-gray-100 dark:border-gray-700 shrink-0"
              />

              <div className="flex-1 pr-6">
                {badgeTag && (
                  <span className="inline-block px-3 py-1 bg-red-800 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                    {badgeTag}
                  </span>
                )}
                <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-gray-100 leading-tight">
                  {fullName}
                </h2>
                {designation && (
                  <p className="text-red-800 dark:text-red-400 font-bold text-sm sm:text-base mt-1">
                    {designation}
                  </p>
                )}
                {qualification && (
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
                    {qualification}
                  </p>
                )}
              </div>
            </div>

            {/* Two Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="bg-blue-50/50 dark:bg-gray-700/40 border border-blue-100/80 dark:border-gray-600 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest block">
                  TEACHING EXPERIENCE
                </span>
                <span className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1 block">
                  {experience}
                </span>
              </div>

              <div className="bg-blue-50/50 dark:bg-gray-700/40 border border-blue-100/80 dark:border-gray-600 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest block">
                  DEPARTMENT STREAMS
                </span>
                <span className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1 block">
                  {department}
                </span>
              </div>
            </div>

            {/* Academic Overview & Biography */}
            {overview && (
              <div className="mb-5">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Academic Overview & Biography
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {overview}
                </p>
              </div>
            )}

            {/* Areas of Expertise & Subjects */}
            {expertiseList.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Areas of Expertise & Subjects
                </h3>
                <div className="flex flex-wrap gap-2">
                  {expertiseList.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full border border-red-200 bg-red-50/60 text-red-800 text-xs font-semibold dark:border-red-800/50 dark:bg-red-950/40 dark:text-red-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Highlight Banner */}
            {keyHighlight && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300/80 text-amber-900 dark:bg-amber-950/40 dark:border-amber-700/60 dark:text-amber-200 flex items-start sm:items-center gap-3">
                <FiAward className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
                <span className="text-xs sm:text-sm font-bold">
                  Key Highlight: {keyHighlight}
                </span>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default FacultyDetailModal;
