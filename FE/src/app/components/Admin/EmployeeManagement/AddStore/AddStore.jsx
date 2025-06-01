import React, { useState, useCallback } from "react";
import Modal from "react-modal";
import { IoIosAddCircleOutline } from "react-icons/io";
import { fetchPost } from "../../../../lib/httpHandler";
import { showErrorMessageBox } from "../../../MessageBox/ErrorMessageBox/showErrorMessageBox";
import { showSuccessMessageBox } from "../../../MessageBox/SuccessMessageBox/showSuccessMessageBox";
import "./AddStore.css";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

export default React.memo(function AddStore({ setListStores }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataForm, setDataForm] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    email: "",
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
        showErrorMessageBox("Vui lòng điền tên cửa hàng");
        return;
      }
      if (!dataForm.phoneNumber.trim()) {
        showErrorMessageBox("Vui lòng điền số điện thoại");
        return;
      }
      if (!/^\+?\d{10,15}$/.test(dataForm.phoneNumber.trim())) {
        showErrorMessageBox("Số điện thoại không hợp lệ");
        return;
      }
      if (!dataForm.address.trim()) {
        showErrorMessageBox("Vui lòng điền địa chỉ cửa hàng");
        return;
      }
      if (!dataForm.email.trim()) {
        showErrorMessageBox("Vui lòng điền email");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dataForm.email.trim())) {
        showErrorMessageBox("Email không hợp lệ");
        return;
      }
      handleAdd();
    },
    [dataForm]
  );

  // Handle add store
  const handleAdd = useCallback(() => {
    const newStore = {
      name: dataForm.name.trim(),
      phoneNumber: dataForm.phoneNumber.trim(),
      address: dataForm.address.trim(),
      email: dataForm.email.trim(),
      status: true, // Default status is active
    };

    fetchPost(
      "/stores",
      newStore,
      async (res) => {
        await showSuccessMessageBox(res.message || "Thêm cửa hàng thành công");
        setListStores((prev) => [...prev, { ...newStore, id: res.id }]);
        setDataForm({ name: "", phoneNumber: "", address: "", email: "" });
        setIsModalOpen(false);
      },
      (err) => {
                if (err.status === 409) {
          showErrorMessageBox(err.message || "Tên cửa hàng đã tồn tại. Vui lòng chọn tên khác.");
        } else {
          showErrorMessageBox(err.message || "Lỗi khi thêm cửa hàng. Vui lòng thử lại.");
        }
        
      },
      () => console.log("Add store request completed")
    );
  }, [dataForm, setListStores]);

  // Open modal
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setDataForm({ name: "", phoneNumber: "", address: "", email: "" });
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
        contentLabel="Thêm cửa hàng mới"
        shouldCloseOnOverlayClick={false}
      >
        <div className="modal-header">
          <h5 className="modal-title fs-4">Thêm cửa hàng mới</h5>
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
                Tên cửa hàng:
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
            <div className="form-group mb-3 d-flex align-items-center">
              <label htmlFor="phoneNumber" className="form-label col-4 custom-bold">
                Số điện thoại:
              </label>
              <input
                className="form-control rounded-3"
                name="phoneNumber"
                id="phoneNumber"
                type="text"
                value={dataForm.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3 d-flex align-items-center">
              <label htmlFor="address" className="form-label col-4 custom-bold">
                Địa chỉ:
              </label>
              <input
                className="form-control rounded-3"
                name="address"
                id="address"
                type="text"
                value={dataForm.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3 d-flex align-items-center">
              <label htmlFor="email" className="form-label col-4 custom-bold">
                Email:
              </label>
              <input
                className="form-control rounded-3"
                name="email"
                id="email"
                type="email"
                value={dataForm.email}
                onChange={handleChange}
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