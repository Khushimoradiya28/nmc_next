import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal, ModalBody, ModalFooter, Button } from '@windmill/react-ui';
import { FiTrash2 } from 'react-icons/fi';

import UserServices from '../../services/UserServices';
import AdminServices from '../../services/AdminServices';
import CategoryServices from '../../services/CategoryServices';
import BrandServices from '../../../src/services/master/BrandService';
import CharacterServices from '../../services/master/CharacterService';
import AgeServices from '../../services/master/AgeService';
import SkillServices from '../../services/master/SkillServices';
import UserRoleService from '../../../src/services/master/UserRoleService';
import TagService from '../../../src/services/master/TagService';
import ColorService from '../../../src/services/master/ColorService';
import CategoryService from '../../../src/services/master/CategoryService';
import MasterUserService from '../../../src/services/master/MasterUserService';
import CommodityService from '../../../src/services/master/CommodityService';
import MaterialService from '../../../src/services/master/MaterialService';
import ProductServices from '../../../src/services/ProductServices';
import CouponServices from '../../../src/services/CouponServices';
import TestimonialServices from '../../services/TestimonialServices';
import AwardServices from '../../services/AwardServices';
import CourseServices from '../../services/CourseServices';
import { SidebarContext } from '../../context/SidebarContext';
import { notifySuccess, notifyError } from '../../utils/toast';

const MainModal = ({ id }) => {
  const { isModalOpen, closeModal, setIsUpdate } = useContext(SidebarContext);
  const location = useLocation();

  const handleDelete = () => {
    const query = new URLSearchParams(location.search);
    const typeParam = query.get("type");

    if (location.pathname === '/products' && typeParam === 'testimonial') {
      TestimonialServices.deleteTestimonial(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message || 'Testimonial deleted successfully!');
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      return;
    }

    if (location.pathname === '/products' && typeParam === 'awards') {
      AwardServices.deleteAward(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message || 'Award deleted successfully!');
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      return;
    }

    if (location.pathname === '/products' && typeParam === 'courses') {
      CourseServices.deleteCourse(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message || 'Course deleted successfully!');
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      return;
    }
    // if (location.pathname === '/products') {
    //   ProductServices.deleteProduct(id)
    //     .then((res) => {
    //       setIsUpdate(true);
    //       notifySuccess(res.message);
    //     })
    //     .catch((err) => notifyError(err.message));
    //   closeModal();
    // }

    if (location.pathname === '/category') {
      CategoryServices.deleteCategory(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
    }
    if (location.pathname === '/customers') {
      UserServices.deleteUser(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
    }

    if (location.pathname === '/our-staff') {
      AdminServices.deleteStaff(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
    }

    // FOR MASTER 
    if (location.pathname === '/master/brand') {
      BrandServices.deleteBrand(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
    }

    if (location.pathname === '/master/userrole') {
      UserRoleService.deleteData(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
    }
    if (location.pathname === '/master/tag') {
      TagService.deleteData(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
    }
    if (location.pathname === '/master/color') {
      ColorService.deleteData(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
    }
    if (location.pathname === '/master/material') {
      MaterialService.deleteData(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
    }
    if (location.pathname === '/master/category') {
      CategoryService.deleteData(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
    }
    if (location.pathname === '/master/user') {
      MasterUserService.deleteData(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
    }
    if (location.pathname === '/master/commodity') {
      CommodityService.deleteData(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
    }
    if (location.pathname === '/products') {
      ProductServices.deleteData(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
    }
    if (location.pathname === '/coupons') {
      CouponServices.deleteData(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
    }
    // if (location.pathname === '/master/user') {
    //   MasterUserService.deleteData(id)
    //     .then((res) => {
    //       setIsUpdate(true);
    //       notifySuccess(res.message);
    //     })
    //     .catch((err) => notifyError(err.message));
    //   closeModal();
    // }    

    if (location.pathname === '/master/character') {
      CharacterServices.deleteCharacter(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
    }
    if (location.pathname === '/master/age') {
      AgeServices.deleteAge(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
    }
    if (location.pathname === '/master/skill') {
      SkillServices.deleteSkill(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
    }

  };

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalBody className="text-center custom-modal px-8 pt-6 pb-4">
          <span className="flex justify-center text-3xl mb-6 text-red-500">
            <FiTrash2 />
          </span>
          <h2 className="text-xl font-medium mb-1">
            Are You Sure! Want to Delete This Record?
          </h2>
          {/* <p>
            Do you really want to delete these records? You can't view this in
            your list anymore if you delete!
          </p> */}
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button
            className="w-full sm:w-auto hover:bg-white hover:border-gray-50"
            layout="outline"
            onClick={closeModal}
          >
            No, Keep It
          </Button>
          <Button onClick={handleDelete} className="w-full sm:w-auto">
            Yes, Delete It
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default React.memo(MainModal);
