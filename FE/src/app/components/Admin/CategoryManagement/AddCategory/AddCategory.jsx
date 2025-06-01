import React, { useState, useCallback } from "react";
import Modal from "react-modal";
import { IoAddCircleOutline, IoClose } from "react-icons/io5";
import { fetchPost } from "../../../../lib/httpHandler";
import { showErrorMessageBox } from "../../../../components/MessageBox/ErrorMessageBox/showErrorMessageBox";
import { showSuccessMessageBox } from "../../../MessageBox/SuccessMessageBox/showSuccessMessageBox";
import "./AddCategory.css";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

export default React.memo(function AddCategory({ fetchCategories }) {
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
    };

    fetchPost(
      "/categories",
      newCategory,
      async (res) => {
        await showSuccessMessageBox(res.message || "Thêm danh mục thành công");
        fetchCategories(); // Làm mới danh sách từ server
        setDataForm({ name: "" });
        setIsModalOpen(false);
      },
      (err) => {
        if (err.status === 409) {
          showErrorMessageBox("Tên danh mục đã tồn tại. Vui lòng chọn tên khác.");
        } else {
          showErrorMessageBox(err.title || "Lỗi khi thêm danh mục. Vui lòng thử lại.");
        }
      },
      () => console.log("Add category request completed")
    );
  }, [dataForm, fetchCategories]);

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
        className="addButtonAddCategory"
        onClick={openModal}
      >
        <IoAddCircleOutline className="addIconAddCategory" />
        Thêm
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onAfterClose={handleAfterClose}
        className="modalContentAddCategory"
        overlayClassName="modalOverlayAddCategory"
        contentLabel="Thêm danh mục mới"
        shouldCloseOnOverlayClick={false}
      >
        <div className="modalHeaderAddCategory">
          <h5 className="modalTitleAddCategory">Thêm danh mục mới</h5>
          <button
            type="button"
            className="btn-closeAddCategory"
            onClick={closeModal}
            aria-label="Close"
          >
            <IoClose />
          </button>
        </div>
        <div className="modalBodyAddCategory">
          <form className="formColumnsAddCategory" onSubmit={handleSubmit}>
            <div className="formGroupAddCategory">
              <label htmlFor="name" className="formLabelAddCategory">
                Tên danh mục:
              </label>
              <input
                className="formControlAddCategory"
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
        <div className="modalFooterAddCategory">
          <button className="cancelButtonAddCategory" onClick={closeModal}>
            Hủy
          </button>
          <button
            type="submit"
            className="submitButtonAddCategory"
            onClick={handleSubmit}
          >
            Thêm
          </button>
        </div>
      </Modal>
    </>
  );
});