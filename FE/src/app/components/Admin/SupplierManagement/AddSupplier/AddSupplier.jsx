import React, { useState, useCallback } from "react";
import Modal from "react-modal";
import { IoAddCircleOutline, IoClose } from "react-icons/io5";
import { fetchPost } from "../../../../lib/httpHandler";
import { showErrorMessageBox } from "../../../../components/MessageBox/ErrorMessageBox/showErrorMessageBox";
import { showSuccessMessageBox } from "../../../MessageBox/SuccessMessageBox/showSuccessMessageBox";
import "./AddSupplier.css";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

export default React.memo(function AddSupplier({ fetchSuppliers }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataForm, setDataForm] = useState({
    name: "",
    contactName: "",
    phoneNumber: "",
    email: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle add supplier
  const handleAdd = useCallback(() => {
    const newSupplier = {
      Name: dataForm.name.trim(),
      contact_Name: dataForm.contactName.trim() || null,
      phoneNumber: dataForm.phoneNumber.trim() || null,
      email: dataForm.email.trim() || null,
      address: dataForm.address.trim() || null,
    };

    setIsSubmitting(true);
    fetchPost(
      "/suppliers",
      newSupplier,
      async (res) => {
        console.log("Thêm nhà cung cấp thành công:", res);
        await showSuccessMessageBox(res.message || "Thêm nhà cung cấp thành công");
        fetchSuppliers();
        setDataForm({ name: "", contactName: "", phoneNumber: "", email: "", address: "" });
        setIsModalOpen(false);
      },
      (err) => {
        console.error("Lỗi khi thêm nhà cung cấp:", err);
        if (err.status === 409) {
          showErrorMessageBox("Tên nhà cung cấp đã tồn tại. Vui lòng chọn tên khác.");
        } else {
          showErrorMessageBox(
            err.errors
              ? Object.values(err.errors).flat().join(", ")
              : err.message || "Lỗi khi thêm nhà cung cấp. Vui lòng thử lại."
          );
        }
      },
      () => {
        setIsSubmitting(false);
        console.log("Add supplier request completed");
      }
    );
  }, [dataForm, fetchSuppliers]);

  // Handle form submit
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!dataForm.name.trim()) {
        showErrorMessageBox("Vui lòng điền tên nhà cung cấp");
        return;
      }
      if (dataForm.name.trim().length > 100) {
        showErrorMessageBox("Tên nhà cung cấp không được vượt quá 100 ký tự");
        return;
      }
      if (dataForm.contactName.trim().length > 50) {
        showErrorMessageBox("Tên người liên hệ không được vượt quá 50 ký tự");
        return;
      }
      if (dataForm.phoneNumber && !/^\d{10}$/.test(dataForm.phoneNumber)) {
        showErrorMessageBox("Số điện thoại không hợp lệ (phải đúng 10 chữ số)");
        return;
      }
      if (dataForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dataForm.email)) {
        showErrorMessageBox("Email không hợp lệ");
        return;
      }
      if (dataForm.address.trim().length > 255) {
        showErrorMessageBox("Địa chỉ không được vượt quá 255 ký tự");
        return;
      }
      handleAdd();
    },
    [dataForm, handleAdd]
  );

  // Open modal
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setDataForm({ name: "", contactName: "", phoneNumber: "", email: "", address: "" });
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
        className="addButtonAddSupplier"
        onClick={openModal}
      >
        <IoAddCircleOutline className="addIconAddSupplier" />
        Thêm
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onAfterClose={handleAfterClose}
        className="modalContentAddSupplier"
        overlayClassName="modalOverlayAddSupplier"
        contentLabel="Thêm nhà cung cấp mới"
        shouldCloseOnOverlayClick={false}
      >
        <div className="modalHeaderAddSupplier">
          <h5 className="modalTitleAddSupplier">Thêm nhà cung cấp mới</h5>
          <button
            type="button"
            className="btn-closeAddSupplier"
            onClick={closeModal}
            aria-label="Close"
          >
            <IoClose />
          </button>
        </div>
        <div className="modalBodyAddSupplier">
          <form className="formColumnsAddSupplier" onSubmit={handleSubmit}>
            <div className="formGroupAddSupplier">
              <label htmlFor="name" className="formLabelAddSupplier">
                Tên nhà cung cấp:
              </label>
              <input
                className="formControlAddSupplier"
                name="name"
                id="name"
                type="text"
                value={dataForm.name}
                onChange={handleChange}
                autoFocus
              />
            </div>
            <div className="formGroupAddSupplier">
              <label htmlFor="contactName" className="formLabelAddSupplier">
                Người liên hệ:
              </label>
              <input
                className="formControlAddSupplier"
                name="contactName"
                id="contactName"
                type="text"
                value={dataForm.contactName}
                onChange={handleChange}
              />
            </div>
            <div className="formGroupAddSupplier">
              <label htmlFor="phoneNumber" className="formLabelAddSupplier">
                Số điện thoại:
              </label>
              <input
                className="formControlAddSupplier"
                name="phoneNumber"
                id="phoneNumber"
                type="text"
                value={dataForm.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className="formGroupAddSupplier">
              <label htmlFor="email" className="formLabelAddSupplier">
                Email:
              </label>
              <input
                className="formControlAddSupplier"
                name="email"
                id="email"
                type="email"
                value={dataForm.email}
                onChange={handleChange}
              />
            </div>
            <div className="formGroupAddSupplier">
              <label htmlFor="address" className="formLabelAddSupplier">
                Địa chỉ:
              </label>
              <input
                className="formControlAddSupplier"
                name="address"
                id="address"
                type="text"
                value={dataForm.address}
                onChange={handleChange}
              />
            </div>
            <div className="modalFooterAddSupplier">
              <button
                type="button"
                className="cancelButtonAddSupplier"
                onClick={closeModal}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="submitButtonAddSupplier"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="spinnerAddSupplier" role="status" />
                ) : (
                  "Thêm"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
});