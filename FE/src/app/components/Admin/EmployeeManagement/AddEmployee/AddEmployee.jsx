import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import { IoAddCircleOutline, IoClose } from "react-icons/io5";
import { fetchPost, fetchGet } from "../../../../lib/httpHandler";
import { showErrorMessageBox } from "../../../../components/MessageBox/ErrorMessageBox/showErrorMessageBox";
import { showSuccessMessageBox } from "../../../MessageBox/SuccessMessageBox/showSuccessMessageBox";
import "./AddEmployee.css";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

export default React.memo(function AddEmployee({ setListEmployees }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataForm, setDataForm] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    birthday: "",
    address: "",
    sex: "",
    status: "1", // Default: Active
    storeId: "",
    roleId: "",
  });
  const [stores, setStores] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch stores
  const fetchStores = useCallback(() => {
    fetchGet(
      "/Stores",
      (res) => {
        setStores(Array.isArray(res) ? res : []);
      },
      (err) => {
        showErrorMessageBox(err.message || "Lỗi khi lấy danh sách cửa hàng");
      }
    );
  }, []);

  // Fetch roles
  const fetchRoles = useCallback(() => {
    fetchGet(
      "/roles",
      (res) => {
        setRoles(Array.isArray(res) ? res : []);
      },
      (err) => {
        showErrorMessageBox(err.message || "Lỗi khi lấy danh sách vai trò");
      }
    );
  }, []);

  // Load data when modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchStores();
      fetchRoles();
    }
  }, [isModalOpen, fetchStores, fetchRoles]);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle form submit
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!dataForm.fullname.trim()) {
        showErrorMessageBox("Vui lòng điền họ tên");
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
      if (!dataForm.phoneNumber.trim()) {
        showErrorMessageBox("Vui lòng điền số điện thoại");
        return;
      }
      if (!/^\+?\d{10,15}$/.test(dataForm.phoneNumber.trim())) {
        showErrorMessageBox("Số điện thoại không hợp lệ");
        return;
      }
      if (!dataForm.birthday) {
        showErrorMessageBox("Vui lòng chọn ngày sinh");
        return;
      }
      if (!dataForm.address.trim()) {
        showErrorMessageBox("Vui lòng điền địa chỉ");
        return;
      }
      if (dataForm.sex === "") {
        showErrorMessageBox("Vui lòng chọn giới tính");
        return;
      }
      if (dataForm.status === "") {
        showErrorMessageBox("Vui lòng chọn trạng thái");
        return;
      }
      if (!dataForm.storeId) {
        showErrorMessageBox("Vui lòng chọn cửa hàng");
        return;
      }
      if (!dataForm.roleId) {
        showErrorMessageBox("Vui lòng chọn vai trò");
        return;
      }
      handleAdd();
    },
    [dataForm]
  );

  // Handle add employee
  const handleAdd = useCallback(() => {
    const newEmployee = {
      fullname: dataForm.fullname.trim(),
      email: dataForm.email.trim(),
      phoneNumber: dataForm.phoneNumber.trim(),
      birthday: dataForm.birthday,
      address: dataForm.address.trim(),
      sex: parseInt(dataForm.sex),
      status: parseInt(dataForm.status),
      storeId: dataForm.storeId,
      roleId: dataForm.roleId,
    };

    setIsSubmitting(true);
    fetchPost(
      "/employees",
      newEmployee,
      async (res) => {
        await showSuccessMessageBox(res.message || "Thêm nhân viên thành công");
        setListEmployees((prev) => [
          ...prev,
          {
            id: res.id,
            fullname: newEmployee.fullname,
            email: newEmployee.email,
            phoneNumber: newEmployee.phoneNumber,
            birthday: newEmployee.birthday,
            address: newEmployee.address,
            sex: newEmployee.sex,
            status: newEmployee.status ? "Active" : "Locked",
            storeName: stores.find((store) => store.id === newEmployee.storeId)?.name || "",
            roleName: roles.find((role) => role.id === newEmployee.roleId)?.name || "",
          },
        ]);
        setDataForm({
          fullname: "",
          email: "",
          phoneNumber: "",
          birthday: "",
          address: "",
          sex: "",
          status: "1",
          storeId: "",
          roleId: "",
        });
        setIsModalOpen(false);
      },
      (err) => {
        if (err.status === 409) {
          showErrorMessageBox(err.message || "Thông tin nhân viên đã tồn tại. Vui lòng kiểm tra lại.");
        } else {
          showErrorMessageBox(err.message || "Lỗi khi thêm nhân viên. Vui lòng thử lại.");
        }
      },
      () => {
        setIsSubmitting(false);
        console.log("Add employee request completed");
      }
    );
  }, [dataForm, setListEmployees, stores, roles]);

  // Open modal
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setDataForm({
      fullname: "",
      email: "",
      phoneNumber: "",
      birthday: "",
      address: "",
      sex: "",
      status: "1",
      storeId: "",
      roleId: "",
    });
    if (document.activeElement) {
      document.activeElement.blur();
    }
  }, []);

  // Handle after close
  const handleAfterClose = useCallback(() => {
    const modalInputs = document.querySelectorAll("input, select, button");
    modalInputs.forEach((el) => el.blur());
  }, []);

  return (
    <>
      <button
        type="button"
        className="addButtonAddEmployee"
        onClick={openModal}
      >
        <IoAddCircleOutline className="addIconAddEmployee" />
        Thêm
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onAfterClose={handleAfterClose}
        className="modalContentAddEmployee"
        overlayClassName="modalOverlayAddEmployee"
        contentLabel="Thêm nhân viên mới"
        shouldCloseOnOverlayClick={false}
      >
        <div className="modalHeaderAddEmployee">
          <h5 className="modalTitleAddEmployee">Thêm nhân viên mới</h5>
          <button
            type="button"
            className="btn-closeAddEmployee"
            onClick={closeModal}
            aria-label="Close"
          >
            <IoClose />
          </button>
        </div>
        <div className="modalBodyAddEmployee">
          <form className="formColumnsAddEmployee" onSubmit={handleSubmit}>
            <div className="formColumnAddEmployee">
              <div className="formGroupAddEmployee">
                <label htmlFor="fullname" className="formLabelAddEmployee">
                  Họ tên:
                </label>
                <input
                  className="formControlAddEmployee"
                  name="fullname"
                  id="fullname"
                  type="text"
                  value={dataForm.fullname}
                  onChange={handleChange}
                  autoFocus
                />
              </div>
              <div className="formGroupAddEmployee">
                <label htmlFor="email" className="formLabelAddEmployee">
                  Email:
                </label>
                <input
                  className="formControlAddEmployee"
                  name="email"
                  id="email"
                  type="email"
                  value={dataForm.email}
                  onChange={handleChange}
                />
              </div>
              <div className="formGroupAddEmployee">
                <label htmlFor="phoneNumber" className="formLabelAddEmployee">
                  Số điện thoại:
                </label>
                <input
                  className="formControlAddEmployee"
                  name="phoneNumber"
                  id="phoneNumber"
                  type="text"
                  value={dataForm.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="formGroupAddEmployee">
                <label htmlFor="birthday" className="formLabelAddEmployee">
                  Ngày sinh:
                </label>
                <input
                  className="formControlAddEmployee"
                  name="birthday"
                  id="birthday"
                  type="date"
                  value={dataForm.birthday}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="formColumnAddEmployee">
              <div className="formGroupAddEmployee">
                <label htmlFor="address" className="formLabelAddEmployee">
                  Địa chỉ:
                </label>
                <input
                  className="formControlAddEmployee"
                  name="address"
                  id="address"
                  type="text"
                  value={dataForm.address}
                  onChange={handleChange}
                />
              </div>
              <div className="formGroupAddEmployee">
                <label htmlFor="sex" className="formLabelAddEmployee">
                  Giới tính:
                </label>
                <select
                  className="formControlAddEmployee"
                  name="sex"
                  id="sex"
                  value={dataForm.sex}
                  onChange={handleChange}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="1">Nam</option>
                  <option value="0">Nữ</option>
                </select>
              </div>
              <div className="formGroupAddEmployee">
                <label htmlFor="status" className="formLabelAddEmployee">
                  Trạng thái:
                </label>
                <select
                  className="formControlAddEmployee"
                  name="status"
                  id="status"
                  value={dataForm.status}
                  onChange={handleChange}
                >
                  <option value="">Chọn trạng thái</option>
                  <option value="1">Active</option>
                  <option value="0">Locked</option>
                </select>
              </div>
              <div className="formGroupAddEmployee">
                <label htmlFor="storeId" className="formLabelAddEmployee">
                  Cửa hàng:
                </label>
                <select
                  className="formControlAddEmployee"
                  name="storeId"
                  id="storeId"
                  value={dataForm.storeId}
                  onChange={handleChange}
                >
                  <option value="">Chọn cửa hàng</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="formGroupAddEmployee">
                <label htmlFor="roleId" className="formLabelAddEmployee">
                  Vai trò:
                </label>
                <select
                  className="formControlAddEmployee"
                  name="roleId"
                  id="roleId"
                  value={dataForm.roleId}
                  onChange={handleChange}
                >
                  <option value="">Chọn vai trò</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>
        <div className="modalFooterAddEmployee">
          <button className="cancelButtonAddEmployee" onClick={closeModal}>
            Hủy
          </button>
          <button
            type="submit"
            className="submitButtonAddEmployee"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinnerAddEmployee" role="status" />
            ) : (
              "Thêm"
            )}
          </button>
        </div>
      </Modal>
    </>
  );
});