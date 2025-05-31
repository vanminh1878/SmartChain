import React, { useState, useCallback } from "react";
import Modal from "react-modal";
import { IoIosAddCircleOutline } from "react-icons/io";
import { fetchPost } from "../../../../lib/httpHandler";
import { showErrorMessageBox } from "../../../MessageBox/ErrorMessageBox/showErrorMessageBox";
import { showSuccessMessageBox } from "../../../MessageBox/SuccessMessageBox/showSuccessMessageBox";
import "./AddCategory.css";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

export default React.memo(function AddCategory({ setListCategories }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataForm, setDataForm] = useState({
    name: "",
  });

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle form submit
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!dataForm.name.trim()) {
        showErrorMessageBox("Vui lòng điền tên danh mục");
        return;
      }
      handleAdd();
    },
    [dataForm]
  );

  // Handle add category
  const handleAdd = useCallback(() => {
    const newCategory = {
      name: dataForm.name.trim(),
      isLocked: false, // Default is not locked
    };

    fetchPost(
      "/categories",
      newCategory,
      async (res) => {
        await showSuccessMessageBox(res.message || "Thêm danh mục thành công");
        setListCategories((prev) => [...prev, { ...newCategory, _id: res.id }]);
        setDataForm({ name: "" });
        setIsModalOpen(false);
      },
      (err) => {
        showErrorMessageBox(err.message || "Lỗi khi thêm danh mục. Vui lòng thử lại.");
      },
      () => console.log("Add category request completed")
    );
  }, [dataForm, setListCategories]);

  // Open modal
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setDataForm({ name: "" });
    if (document.activeElement) {
      document.activeElement.blur();
    }
  }, []);

  // Handle after close
  const handleAfterClose = useCallback(() => {
    const modalInputs = document.querySelectorAll("input, button");
    modalInputs.forEach((el) => el.blur());
  }, []);

  return (
    <>
      <button
        type="button"
        className="btn btn-primary d-flex align-items-center gap-1"
        onClick={openModal}
      >
        <IoIosAddCircleOutline size={20} />
        Thêm
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onAfterClose={handleAfterClose}
        className="modal-content"
        overlayClassName="modal-overlay"
        contentLabel="Thêm danh mục mới"
        shouldCloseOnOverlayClick={false}
      >
        <div className="modal-header">
          <h5 className="modal-title fs-4">Thêm danh mục mới</h5>
          <button
            type="button"
            className="btn-close"
            onClick={closeModal}
            aria-label="Close"
          />
        </div>
        <div className="modal-body d-flex justify-content-center">
          <form className="me-5 w-75" onSubmit={handleSubmit}>
            <div className="form-group mb-3 d-flex align-items-center">
              <label htmlFor="name" className="form-label col-4 custom-bold">
                Tên danh mục:
              </label>
              <input
                className="form-control rounded-3"
                name="name"
                id="name"
                type="text"
                value={dataForm.name}
                onChange={handleChange}
                autoFocus
              />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary btn_Cancel" onClick={closeModal}>
            Hủy
          </button>
          <button
            type="submit"
            className="btn btn-primary btn_Accept"
            onClick={handleSubmit}
          >
            Thêm
          </button>
        </div>
      </Modal>
    </>
  );
});