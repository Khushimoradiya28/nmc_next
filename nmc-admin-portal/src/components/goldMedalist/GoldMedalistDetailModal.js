import React, { useEffect, useState } from 'react';
import { FiX, FiAward } from 'react-icons/fi';
import GoldMedalistServices from '../../services/GoldMedalistServices';
import resolveMedalistImage from '../../utils/resolveMedalistImage';

const GoldMedalistDetailModal = ({ isOpen, onClose, medalist: initialMedalist, idOrSlug }) => {
  const [medalist, setMedalist] = useState(initialMedalist || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const targetSlugOrId = idOrSlug || initialMedalist?.slug || initialMedalist?._id || initialMedalist?.id;

    if (targetSlugOrId) {
      setLoading(true);
      GoldMedalistServices.getMedalistByIdOrSlug(targetSlugOrId)
        .then((res) => {
          if (res?.data) {
            setMedalist(res.data);
          } else {
            setMedalist(initialMedalist);
          }
        })
        .catch(() => {
          setMedalist(initialMedalist);
        })
        .finally(() => setLoading(false));
    } else {
      setMedalist(initialMedalist);
    }
  }, [isOpen, idOrSlug, initialMedalist]);

  if (!isOpen || (!medalist && !loading)) return null;

  const name = medalist?.name || 'Achiever';
  const rank = medalist?.rank || '';
  const rankLabel = medalist?.rankLabel || 'UNIVERSITY RANK HOLDER';
  const programme = medalist?.programme || '';
  const subCourse = medalist?.subCourse || '';
  const academicYear = medalist?.academicYear || 'N/A';
  const photoUrl =
    resolveMedalistImage(medalist) ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80';

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
            Loading achiever details...
          </div>
        ) : (
          <>
            {/* Top Header: Image & Main Info */}
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <img
                src={photoUrl}
                alt={name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-sm border border-gray-100 dark:border-gray-700 shrink-0"
              />

              <div className="flex-1 pr-6">
                {rank && (
                  <span className="inline-block px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                    {rank}
                  </span>
                )}
                <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-gray-100 leading-tight">
                  {name}
                </h2>
                {(programme || subCourse) && (
                  <p className="text-red-800 dark:text-red-400 font-bold text-sm sm:text-base mt-1">
                    {[programme, subCourse].filter(Boolean).join(' • ')}
                  </p>
                )}
              </div>
            </div>

            {/* Two Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="bg-blue-50/50 dark:bg-gray-700/40 border border-blue-100/80 dark:border-gray-600 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest block">
                  ACADEMIC YEAR
                </span>
                <span className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1 block">
                  {academicYear}
                </span>
              </div>

              <div className="bg-blue-50/50 dark:bg-gray-700/40 border border-blue-100/80 dark:border-gray-600 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest block">
                  PROGRAMME
                </span>
                <span className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1 block">
                  {programme || 'N/A'}
                </span>
              </div>
            </div>

            {/* Rank Holder Banner */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300/80 text-amber-900 dark:bg-amber-950/40 dark:border-amber-700/60 dark:text-amber-200 flex items-start sm:items-center gap-3">
              <FiAward className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
              <span className="text-xs sm:text-sm font-bold">
                {rankLabel}
              </span>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default GoldMedalistDetailModal;
