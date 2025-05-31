import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import { GrCircleInformation } from "react-icons/gr";
import { TiEdit } from "react-icons/ti";
import { fetchGet, fetchPut } from "../../../../lib/httpHandler";
import { showErrorMessageBox } from "../../../MessageBox/ErrorMessageBox/showErrorMessageBox";
import { showSuccessMessageBox } from "../../../MessageBox/SuccessMessageBox/showSuccessMessageBox";
import "./DetailSupplier.css";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

export default React.memo(function EditSupplier({ item, fetchSuppliers }) {
  const [editStatus, setEditStatus] = useState(false);
  const [supplierInfo, setSupplierInfo] = useState({});
  const [dataForm, setDataForm] = useState({
    Name: item.Name || item.name || "",
    contact_Name: item.contact_Name || item.contactName || "",
    phoneNumber: item.phoneNumber || "",
    email: item.email || "",
    address: item.address || "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hàm lấy thông tin nhà cung cấp
  const fetchSupplierInfo = useCallback(() => {
    if (item?.id && !item.id.startsWith("temp-")) {
      fetchGet(
        `/suppliers/${item.id}`,
        (res) => {
          console.log("Supplier info fetched:", res);
          setSupplierInfo(res);
          setDataForm({
            Name: decodeURIComponent(res.Name || res.name || ""),
            contact_Name: decodeURIComponent(res.contact_Name || res.contactName || ""),
            phoneNumber: res.phoneNumber || "",
            email: res.email || "",
            address: res.address || "",
          });
        },
        (err) => {
          console.error("Fetch supplier error:", err);
          showErrorMessageBox(err.message || "Lỗi khi lấy thông tin nhà cung cấp. Vui lòng thử lại.");
        },
        () => console.log("Fetch supplier info completed")
      );
    } else {
      console.warn("Invalid supplier id:", item?.id);
      showErrorMessageBox("ID nhà cung cấp không hợp lệ. Không thể lấy thông tin.");
    }
  }, [item.id]);

  // Load dữ liệu khi modal mở
  useEffect(() => {
    if (isModalOpen) {
      fetchSupplierInfo();
    }
  }, [isModalOpen, fetchSupplierInfo]);

  // Xử lý thay đổi input
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Xử lý toggle chế độ chỉnh sửa
  const handleEditToggle = useCallback(() => {
    setEditStatus((prev) => !prev);
    setTimeout(() => {
      const input = document.querySelector(`input[name="Name"]`);
      if (input) input.focus();
    }, 100);
  }, []);

  // Xử lý hủy chỉnh sửa
  const handleCancel = useCallback(() => {
    setEditStatus(false);
    setDataForm({
      Name: supplierInfo.Name || item.Name || item.name || "",
      contact_Name: supplierInfo.contact_Name || item.contact_Name || item.contactName || "",
      phoneNumber: supplierInfo.phoneNumber || item.phoneNumber || "",
      email: supplierInfo.email || item.email || "",
      address: supplierInfo.address || item.address || "",
    });
    setIsModalOpen(false);
  }, [supplierInfo, item]);

  // Xử lý submit form
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!dataForm.Name.trim()) {
        showErrorMessageBox("Vui lòng điền tên nhà cung cấp");
        return;
      }
      if (dataForm.Name.trim().length > 100) {
        showErrorMessageBox("Tên nhà cung cấp không được vượt quá 100 ký tự");
        return;
      }
      if (dataForm.contact_Name.trim().length > 50) {
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
      handleUpdate();
    },
    [dataForm]
  );

  // Xử lý cập nhật nhà cung cấp
  const handleUpdate = useCallback(() => {
    if (item.id.startsWith("temp-")) {
      showErrorMessageBox("ID nhà cung cấp không hợp lệ. Không thể cập nhật.");
      return;
    }
    const uri = `/suppliers/${item.id}`;
    const updatedData = {
      Name: dataForm.Name.trim(),
      contact_Name: dataForm.contact_Name.trim() || null,
      phoneNumber: dataForm.phoneNumber.trim() || null,
      email: dataForm.email.trim() || null,
      address: dataForm.address.trim() || null,
    };
    console.log("Sending PUT request to:", uri, "with data:", updatedData);

    fetchPut(
      uri,
      updatedData,
      async (res) => {
        console.log("Update response:", res);
        await showSuccessMessageBox(res.message || "Cập nhật nhà cung cấp thành công");
        setSupplierInfo({ ...supplierInfo, ...updatedData });
        setDataForm({ ...updatedData });
        fetchSuppliers(); // Làm mới danh sách từ server
        setEditStatus(false);
        setIsModalOpen(false);
      },
      (err) => {
        console.error("Update error details:", err);
        if (err.status === 409) {
          showErrorMessageBox("Tên nhà cung cấp đã tồn tại. Vui lòng chọn tên khác.");
        } else {
          showErrorMessageBox(
            err.errors
              ? Object.values(err.errors).flat().join(", ")
              : err.message || "Lỗi khi cập nhật nhà cung cấp. Vui lòng thử lại."
          );
        }
      },
      () => console.log("Update request completed")
    );
  }, [item.id, dataForm, supplierInfo, fetchSuppliers]);

  // Hàm mở modal
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Hàm đóng modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditStatus(false);
    if (document.activeElement) {
      document.activeElement.blur();
    }
  }, []);

  // Xử lý khi modal đóng
  const handleAfterClose = useCallback(() => {
    const modalInputs = document.querySelectorAll("input, button");
    modalInputs.forEach((el) => el.blur());
  }, []);

  return (
    <>
      <button
        type="button"
        className="border-0 bg-transparent p-0"
        onClick={openModal}
      >
        <GrCircleInformation className="icon_information icon_action" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onAfterClose={handleAfterClose}
        className="modal-content"
        overlayClassName="modal-overlay"
        contentLabel="Thông tin nhà cung cấp"
        shouldFocusAfterRender={editStatus}
        shouldCloseOnOverlayClick={false}
      >
        <div className="modal-header">
          <h5 className="modal-title fs-4">
            {editStatus ? "Sửa thông tin nhà cung cấp" : "Thông tin nhà cung cấp"}
          </h5>
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
              <label htmlFor="Name" className="form-label col-4 custom-bold">
                Tên nhà cung cấp:
              </label>
              <input
                className="form-control rounded-3"
                name="Name"
                id="Name"
                type="text"
                value={dataForm.Name}
                onChange={handleChange}
                readOnly={!editStatus}
                autoFocus={editStatus}
              />
            </div>
            <div className="form-group mb-3 d-flex align-items-center">
              <label htmlFor="contact_Name" className="form-label col-4 custom-bold">
                Người liên hệ:
              </label>
              <input
                className="form-control rounded-3"
                name="contact_Name"
                id="contact_Name"
                type="text"
                value={dataForm.contact_Name}
                onChange={handleChange}
                readOnly={!editStatus}
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
                readOnly={!editStatus}
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
                readOnly={!editStatus}
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
                readOnly={!editStatus}
              />
            </div>
          </form>
        </div>
        {editStatus ? (
          <div className="modal-footer">
            <button className="btn btn-secondary btn_Cancel" onClick={handleCancel}>
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary btn_Accept"
              onClick={handleSubmit}
            >
              Lưu
            </button>
          </div>
        ) : (
          <div className="contain_Edit d-flex align-items-center mb-3 ms-3">
            <h4 className="title_edit fs-6 mb-0 me-2">Chỉnh sửa thông tin</h4>
            <button className="bg-white border-0 p-0" onClick={handleEditToggle}>
              <TiEdit className="fs-3 icon_edit_information" />
            </button>
          </div>
        )}
      </Modal>
    </>
  );
});