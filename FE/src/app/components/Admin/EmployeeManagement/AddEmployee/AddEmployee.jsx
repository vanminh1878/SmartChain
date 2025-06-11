import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import { IoAddCircleOutline, IoClose } from "react-icons/io5";
import { fetchPost, fetchGet, fetchUpload, BE_ENPOINT } from "../../../../lib/httpHandler";
import { showErrorMessageBox } from "../../../../components/MessageBox/ErrorMessageBox/showErrorMessageBox";
import { showSuccessMessageBox } from "../../../MessageBox/SuccessMessageBox/showSuccessMessageBox";
import "./AddEmployee.css";

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
    status: "1",
    storeId: "",
    roleId: "",
    avatar: "",
    username: "",
    password: ""
  });
  const [stores, setStores] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStores = useCallback(() => {
    fetchGet(
      "/Stores",
      (res) => {
        if (Array.isArray(res) && res.every(item => item.id && typeof item.id === 'string')) {
          setStores(res);
          console.log("Fetched stores:", res);
        } else {
          console.error("Invalid stores data:", res);
          showErrorMessageBox("Dữ liệu cửa hàng không hợp lệ");
        }
      },
      (err) => {
        console.error("Fetch stores error:", err);
        showErrorMessageBox(err.message || "Lỗi khi lấy danh sách cửa hàng");
      },
      () => console.log("Fetch stores completed")
    );
  }, []);

  const fetchRoles = useCallback(() => {
    fetchGet(
      "/roles",
      (res) => {
        if (Array.isArray(res) && res.every(item => item.id && typeof item.id === 'string')) {
          setRoles(res);
          console.log("Fetched roles:", res);
        } else {
          console.error("Invalid roles data:", res);
          showErrorMessageBox("Dữ liệu vai trò không hợp lệ");
        }
      },
      (err) => {
        console.error("Fetch roles error:", err);
        showErrorMessageBox(err.message || "Lỗi khi lấy danh sách vai trò");
      },
      () => console.log("Fetch roles completed")
    );
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      fetchStores();
      fetchRoles();
      setTimeout(() => {
        const input = document.querySelector(`input[name="fullname"]`);
        if (input) input.focus();
      }, 100);
    }
  }, [isModalOpen, fetchStores, fetchRoles]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAvatarChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) {
      showErrorMessageBox("Vui lòng chọn một file ảnh!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetchUpload(
      "/api/asset/upload-image",
      formData,
      (data) => {
        const avatarUrl = data.fileName;
        setDataForm((prev) => ({ ...prev, avatar: avatarUrl }));
        showSuccessMessageBox("Ảnh đại diện đã được upload thành công!");
      },
      (err) => {
        console.error("Upload avatar error:", err);
        showErrorMessageBox(err.message || "Upload ảnh thất bại!");
      },
      () => console.log("Upload avatar completed")
    );
  }, []);

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
      if (!dataForm.username.trim()) {
        showErrorMessageBox("Vui lòng điền tên đăng nhập");
        return;
      }
      if (!dataForm.password.trim()) {
        showErrorMessageBox("Vui lòng điền mật khẩu");
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

  const handleAdd = useCallback(() => {
    const newEmployee = {
      fullname: dataForm.fullname.trim(),
      email: dataForm.email.trim(),
      phoneNumber: dataForm.phoneNumber.trim(),
      birthday: dataForm.birthday,
      address: dataForm.address.trim(),
      sex: parseInt(dataForm.sex) === 1,
      storeId: dataForm.storeId,
      roleId: dataForm.roleId,
      avatar: dataForm.avatar || null,
      username: dataForm.username.trim(),
      password: dataForm.password.trim()
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
            birthday: new Date(newEmployee.birthday).toLocaleDateString("vi-VN"),
            address: newEmployee.address,
            sex: parseInt(dataForm.sex) === 1 ? "Nam" : "Nữ",
            status: parseInt(dataForm.status) === 1 ? "Active" : "Locked",
            storeName: stores.find((store) => store.id === newEmployee.storeId)?.name || "Không có",
            roleName: roles.find((role) => role.id === newEmployee.roleId)?.name || "Không có",
            avatar: newEmployee.avatar
          }
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
          avatar: "",
          username: "",
          password: ""
        });
        setIsModalOpen(false);
      },
      (err) => {
        console.error("Add employee error:", err);
        showErrorMessageBox(err.message || "Lỗi khi thêm nhân viên. Vui lòng thử lại.");
      },
      () => {
        setIsSubmitting(false);
        console.log("Add employee request completed");
      }
    );
  }, [dataForm, setListEmployees, stores, roles]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

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
      avatar: "",
      username: "",
      password: ""
    });
    if (document.activeElement) {
      document.activeElement.blur();
    }
  }, []);

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
        contentLabel="Thêm nhân viên"
        shouldCloseOnOverlayClick={false}
        shouldFocusAfterRender={true}
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
          <div className="avatarSectionAddEmployee">
            <img
              src={
                dataForm.avatar
                  ? `${BE_ENPOINT}/api/asset/view-image/${dataForm.avatar}`
                  : "https://via.placeholder.com/100"
              }
              alt="Avatar"
              className="avatarImageAddEmployee"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="avatarUploadAddEmployee"
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload" className="uploadButtonAddEmployee">
              Tải ảnh lên
            </label>
          </div>
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
                <label htmlFor="username" className="formLabelAddEmployee">
                  Tên đăng nhập:
                </label>
                <input
                  className="formControlAddEmployee"
                  name="username"
                  id="username"
                  type="text"
                  value={dataForm.username}
                  onChange={handleChange}
                />
              </div>
              <div className="formGroupAddEmployee">
                <label htmlFor="password" className="formLabelAddEmployee">
                  Mật khẩu:
                </label>
                <input
                  className="formControlAddEmployee"
                  name="password"
                  id="password"
                  type="password"
                  value={dataForm.password}
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
                  value={dataForm.storeId}
                  onChange={handleChange}
                >
                  <option value="">Chọn cửa hàng</option>
                  {stores.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
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
                  value={dataForm.roleId}
                  onChange={handleChange}
                >
                  <option value="">Chọn vai trò</option>
                  {roles.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
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
            type="button"
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