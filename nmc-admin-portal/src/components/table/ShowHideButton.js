// import React, { useContext } from "react";
// import { BsToggleOff, BsToggleOn } from "react-icons/bs";

// import { notifySuccess, notifyError } from "../../utils/toast";
// import BrandServices from "../../services/master/BrandService";
// import { SidebarContext } from "../../context/SidebarContext";

// const ShowHideButton = ({ id, status }) => {
//   const { setIsUpdate } = useContext(SidebarContext);

//   const handleChangeStatus = () => {
//     const newStatus = status === 1 ? 0 : 1;

//     // ✅ MUST be FormData
//     const formData = new FormData();
//     formData.append("status", newStatus);

//     BrandServices.updateBrand(id, formData)
//       .then((res) => {
//         setIsUpdate(true);
//         notifySuccess(res.message || "Brand status updated successfully");
//       })
//       .catch((err) => {
//         notifyError(err?.message || "Failed to update brand status");
//       });
//   };

//   return (
//     <span
//       className="cursor-pointer text-xl flex justify-center"
//       onClick={handleChangeStatus}
//       title={status === 1 ? "Deactivate" : "Activate"}
//     >
//       {status === 1 ? (
//         <BsToggleOn className="text-green-500" />
//       ) : (
//         <BsToggleOff className="text-orange-500" />
//       )}
//     </span>
//   );
// };

// export default ShowHideButton;
import React, { useContext } from "react";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";

import { notifySuccess, notifyError } from "../../utils/toast";
import BrandServices from "../../services/master/BrandService";
import CategoryServices from "../../services/master/CategoryService";
import CharacterServices from "../../services/master/CharacterService";
import AcademicProgramServices from "../../services/AcademicProgramServices";
import FacultyServices from "../../services/FacultyServices";
import { SidebarContext } from "../../context/SidebarContext";
import AgeServices from "../../services/master/AgeService";

const ShowHideButton = ({ id, status, type = "brand" }) => {
  const { setIsUpdate } = useContext(SidebarContext);

  const handleChangeStatus = () => {
    const newStatus = status === 1 ? 0 : 1;

    const formData = new FormData();
    formData.append("status", newStatus);

    let apiCall;

    if (type === "brand") {
      apiCall = BrandServices.updateBrand(id, formData);
    }

    if (type === "category") {
      apiCall = CategoryServices.updateBrand(id, formData);
    }

    if (type === "character") {
      apiCall = CharacterServices.updateCharacter(id, formData);
    }

    if (type === "age") {
      apiCall = AgeServices.updateAge(id, { status: newStatus });
    }

    if (type === "academicProgram") {
      apiCall = AcademicProgramServices.updateProgram(id, {
        status: newStatus === 1 ? 'active' : 'inactive',
      });
    }

    if (type === "faculty") {
      const facultyFormData = new FormData();
      facultyFormData.append("status", newStatus === 1 ? "active" : "inactive");
      facultyFormData.append("is_active", newStatus);
      apiCall = FacultyServices.updateFaculty(id, facultyFormData);
    }

    apiCall
      .then((res) => {
        setIsUpdate(true);
        notifySuccess(res?.message || "Status updated successfully");
      })
      .catch((err) => {
        notifyError(err?.response?.data?.message || err?.message || "Failed to update status");
      });
  };

  return (
    <span
      className="cursor-pointer text-xl flex justify-center"
      onClick={handleChangeStatus}
      title={status === 1 ? "Deactivate" : "Activate"}
    >
      {status === 1 ? (
        <BsToggleOn className="text-red-800" />
      ) : (
        <BsToggleOff className="text-orange-500" />
      )}
    </span>
  );
};

export default ShowHideButton;

