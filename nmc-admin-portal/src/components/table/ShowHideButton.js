import React, { useContext } from "react";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";

import { notifySuccess, notifyError } from "../../utils/toast";
import BrandServices from "../../services/master/BrandService";
import CategoryServices from "../../services/master/CategoryService";
import CharacterServices from "../../services/master/CharacterService";
import AcademicProgramServices from "../../services/AcademicProgramServices";
import FacultyServices from "../../services/FacultyServices";
import AwardServices from "../../services/AwardServices";
import TestimonialServices from "../../services/TestimonialServices";
import CourseServices from "../../services/CourseServices";
import { SidebarContext } from "../../context/SidebarContext";
import AgeServices from "../../services/master/AgeService";

const ShowHideButton = ({ id, status, type = "brand" }) => {
  const { setIsUpdate } = useContext(SidebarContext);

  const handleChangeStatus = () => {
    const newStatus = status === 1 ? 0 : 1;
    const statusString = newStatus === 1 ? "active" : "inactive";

    let apiCall;

    if (type === "brand") {
      const formData = new FormData();
      formData.append("status", newStatus);
      apiCall = BrandServices.updateBrand(id, formData);
    } else if (type === "category") {
      const formData = new FormData();
      formData.append("status", newStatus);
      apiCall = CategoryServices.updateBrand(id, formData);
    } else if (type === "character") {
      const formData = new FormData();
      formData.append("status", newStatus);
      apiCall = CharacterServices.updateCharacter(id, formData);
    } else if (type === "age") {
      apiCall = AgeServices.updateAge(id, { status: newStatus });
    } else if (type === "academicProgram") {
      apiCall = AcademicProgramServices.updateProgram(id, {
        status: statusString,
        isActive: newStatus === 1,
      });
    } else if (type === "faculty") {
      const facultyFormData = new FormData();
      facultyFormData.append("status", statusString);
      facultyFormData.append("is_active", newStatus);
      apiCall = FacultyServices.updateFaculty(id, facultyFormData);
    } else if (type === "award" || type === "awards") {
      const awardFormData = new FormData();
      awardFormData.append("status", statusString);
      awardFormData.append("is_active", newStatus);
      apiCall = AwardServices.updateAward(id, awardFormData);
    } else if (type === "testimonial" || type === "testimonials") {
      const testiFormData = new FormData();
      testiFormData.append("status", statusString);
      testiFormData.append("isActive", newStatus === 1 ? "true" : "false");
      apiCall = TestimonialServices.updateTestimonial(id, testiFormData);
    } else if (type === "certificateCourse" || type === "certificateCourses" || type === "course" || type === "courses") {
      const courseFormData = new FormData();
      courseFormData.append("status", statusString);
      courseFormData.append("is_active", newStatus);
      apiCall = CourseServices.updateCourse(id, courseFormData);
    }

    if (!apiCall) return;

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
