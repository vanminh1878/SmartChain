import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import { GrCircleInformation } from "react-icons/gr";
import { TiEdit } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { fetchGet, fetchPut } from "../../../../lib/httpHandler";
import { showErrorMessageBox } from "../../../../components/MessageBox/ErrorMessageBox/showErrorMessageBox";
import { showSuccessMessageBox } from "../../../MessageBox/SuccessMessageBox/showSuccessMessageBox";
import "./DetailEmployee.css";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

export default React.memo(function DetailEmployee({ item, setListEmployees }) {
  const [editStatus, setEditStatus] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState({});
  const [dataForm, setDataForm] = useState({
    fullname: item.fullname || "",
    email: "",
    phoneNumber: item.phoneNumber || "",
    birthday: "",
    address: "",
    sex: "",
    status: "",
    storeId: "",
    roleId: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stores, setStores] = useState([]);
  const [roles, setRoles] = useState([]);

  // Hàm lấy danh sách cửa hàng
  const fetchStores = useCallback(() => {
    fetchGet(
      "/Stores",
      (res) => {
        setStores(Array.isArray(res) ? res : []);
        console.log("Fetched stores:", res);
      },
      (err) => {
        console.error("Fetch stores error:", err);
        showErrorMessageBox(err.message || "Lỗi khi lấy danh sách cửa hàng");
      }
    );
  }, []);

  // Hàm lấy danh sách vai trò
  const fetchRoles = useCallback(() => {
    fetchGet(
      "/roles",
      (res) => {
        setRoles(Array.isArray(res) ? res : []);
        console.log("Fetched roles:", res);
      },
      (err) => {
        console.error("Fetch roles error:", err);
        showErrorMessageBox(err.message || "Lỗi khi lấy danh sách vai trò");
      }
    );
  }, []);

  // Hàm lấy thông tin nhân viên
  const fetchEmployeeInfo = useCallback(() => {
    if (item?.id) {
      fetchGet(
        `/employees/${item.id}`,
        async (employeeRes) => {
          console.log("Employee info fetched:", employeeRes);

          // Gọi API User
          let userData = {};
          if (employeeRes.userId) {
            await fetchGet(
              `/Users/${employeeRes.userId}`,
              (userRes) => {
                userData = userRes;
                console.log("Fetched user data:", userRes);
              },
              (err) => {
                console.error("Fetch user error:", err);
                showErrorMessageBox(err.message || "Lỗi khi lấy thông tin user");
              }
            );
          }

          // Gọi API Store
          let storeData = "";
          if (employeeRes.storeId) {
            await fetchGet(
              `/Stores/${employeeRes.storeId}`,
              (storeRes) => {
                storeData = storeRes.name || "";
                console.log("Fetched store data:", storeRes);
              },
              (err) => {
                console.error("Fetch store error:", err);
                showErrorMessageBox(err.message || "Lỗi khi lấy thông tin store");
              }
            );
          }

          // Gọi API Account
          let accountData = {};
          if (userData.accountId) {
            await fetchGet(
              `/Accounts/${userData.accountId}`,
              (accountRes) => {
                accountData = accountRes;
                console.log("Fetched account data:", accountRes);
              },
              (err) => {
                console.error("Fetch account error:", err);
                showErrorMessageBox(err.message || "Lỗi khi lấy thông tin account");
              }
            );
          }

          // Gọi API Role
          let roleData = "";
          if (userData.roleId) {
            await fetchGet(
              `/roles/${userData.roleId}`,
              (roleRes) => {
                roleData = roleRes.name || "";
                console.log("Fetched role data:", roleRes);
              },
              (err) => {
                console.error("Fetch role error:", err);
                showErrorMessageBox(err.message || "Lỗi khi lấy thông tin vai trò");
              },
              () => console.log("Fetch role completed")
            );
          }

          const employeeInfo = {
            ...employeeRes,
            fullname: userData.fullname || "",
            email: userData.email || "",
            phoneNumber: userData.phoneNumber || "",
            birthday: userData.birthday ? new Date(userData.birthday).toISOString().split("T")[0] : "",
            address: userData.address || "",
            avatar: userData.avatar || "",
            sex: userData.sex !== undefined ? userData.sex : "",
            status: accountData.status !== undefined ? accountData.status : "",
            storeName: storeData,
            roleName: roleData,
          };
          console.log("Employee info:", employeeInfo);
          setEmployeeInfo(employeeInfo);
          setDataForm({
            fullname: decodeURIComponent(employeeInfo.fullname || ""),
            email: decodeURIComponent(employeeInfo.email || ""),
            phoneNumber: decodeURIComponent(employeeInfo.phoneNumber || ""),
            birthday: employeeInfo.birthday || "",
            address: decodeURIComponent(employeeInfo.address || ""),
            sex: employeeInfo.sex !== undefined ? (employeeInfo.sex ? "1" : "0") : "",
            status: employeeInfo.status !== undefined ? (employeeInfo.status ? "1" : "0") : "",
            storeId: employeeRes.storeId || "",
            roleId: userData.roleId || "",
          });
        },
        (err) => {
          console.error("Fetch employee error:", err);
          showErrorMessageBox(err.message || "Lỗi khi lấy thông tin nhân viên. Vui lòng thử lại.");
        },
        () => console.log("Fetch employee completed")
      );
    }
  }, [item.id]);

  // Load dữ liệu khi modal mở
  useEffect(() => {
    if (isModalOpen) {
      fetchEmployeeInfo();
      fetchStores();
      fetchRoles();
    }
  }, [isModalOpen, fetchEmployeeInfo, fetchStores, fetchRoles]);

  // Xử lý thay đổi input
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Xử lý toggle chế độ chỉnh sửa
  const handleEditToggle = useCallback(() => {
    setEditStatus((prev) => !prev);
    setTimeout(() => {
      const input = document.querySelector(`input[name="fullname"]`);
      if (input) input.focus();
    }, 100);
  }, []);

  // Xử lý hủy chỉnh sửa
  const handleCancel = useCallback(() => {
    setEditStatus(false);
    setDataForm({
      fullname: employeeInfo.fullname || "",
      email: employeeInfo.email || "",
      phoneNumber: employeeInfo.phoneNumber || "",
      birthday: employeeInfo.birthday || "",
      address: employeeInfo.address || "",
      sex: employeeInfo.sex !== undefined ? (employeeInfo.sex ? "1" : "0") : "",
      status: employeeInfo.status !== undefined ? (employeeInfo.status ? "1" : "0") : "",
      storeId: employeeInfo.storeId || "",
      roleId: employeeInfo.roleId || "",
    });
    setIsModalOpen(false);
  }, [employeeInfo]);

  // Xử lý submit form
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
      handleUpdate();
    },
    [dataForm]
  );

  // Xử lý cập nhật nhân viên
  const handleUpdate = useCallback(() => {
    const uri = `/employees/${item.id}`;
    console.log(dataForm);
    const updatedData = {
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
    console.log("Sending PUT request to:", uri, "with data:", updatedData);

    fetchPut(
      uri,
      updatedData,
      async (res) => {
        console.log("Update response:", res);
        await showSuccessMessageBox(res.message || "Cập nhật nhân viên thành công");
        setEmployeeInfo({ ...employeeInfo, ...updatedData });
        setDataForm({ ...updatedData });
        setListEmployees((prevList) =>
          prevList.map((listItem) =>
            listItem.id === item.id
              ? {
                  ...listItem,
                  fullname: updatedData.fullname,
                  email: updatedData.email,
                  phoneNumber: updatedData.phoneNumber,
                  birthday: updatedData.birthday,
                  address: updatedData.address,
                  sex: updatedData.sex,
                  storeName: stores.find((store) => store.id === updatedData.storeId)?.name || "",
                  status: updatedData.status ? "Active" : "Locked",
                  roleName: roles.find((role) => role.id === updatedData.roleId)?.name || "",
                }
              : listItem
          )
        );
        setEditStatus(false);
        setIsModalOpen(false);
      },
      (err) => {
        console.error("Update error details:", err);
        if (err.status === 409) {
          showErrorMessageBox(err.message || "Thông tin nhân viên đã tồn tại. Vui lòng kiểm tra lại.");
        } else {
          showErrorMessageBox(err.message || "Lỗi khi cập nhật nhân viên. Vui lòng thử lại.");
        }
      },
      () => console.log("Update request completed")
    );
  }, [item.id, dataForm, setListEmployees, employeeInfo, stores, roles]);

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
    const modalInputs = document.querySelectorAll("input, select, button");
    modalInputs.forEach((el) => el.blur());
  }, []);

  return (
    <>
      <button
        type="button"
        className="iconButtonDetailEmployee"
        onClick={openModal}
      >
        <GrCircleInformation className="iconInformationDetailEmployee" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onAfterClose={handleAfterClose}
        className="modalContentDetailEmployee"
        overlayClassName="modalOverlayDetailEmployee"
        contentLabel="Thông tin nhân viên"
        shouldFocusAfterRender={editStatus}
        shouldCloseOnOverlayClick={false}
      >
        <div className="modalHeaderDetailEmployee">
          <h5 className="modalTitleDetailEmployee">
            {editStatus ? "Sửa thông tin nhân viên" : "Thông tin nhân viên"}
          </h5>
          <button
            type="button"
            className="btn-closeDetailEmployee"
            onClick={closeModal}
            aria-label="Close"
          ><IoClose />  
            </button>
        </div>
        <div className="modalBodyDetailEmployee">
          <div className="avatarSectionDetailEmployee">
            <img
              src={employeeInfo.avatar || "https://via.placeholder.com/100"}
              alt="Avatar"
              className="avatarImageDetailEmployee"
            />
          </div>
          <form className="formColumnsDetailEmployee" onSubmit={handleSubmit}>
            <div className="formColumnDetailEmployee">
              <div className="formGroupDetailEmployee">
                <label htmlFor="fullname" className="formLabelDetailEmployee">
                  Họ tên:
                </label>
                <input
                  className="formControlDetailEmployee"
                  name="fullname"
                  id="fullname"
                  type="text"
                  value={dataForm.fullname}
                  onChange={handleChange}
                  readOnly={!editStatus}
                />
              </div>
              <div className="formGroupDetailEmployee">
                <label htmlFor="email" className="formLabelDetailEmployee">
                  Email:
                </label>
                <input
                  className="formControlDetailEmployee"
                  name="email"
                  id="email"
                  type="email"
                  value={dataForm.email}
                  onChange={handleChange}
                  readOnly={!editStatus}
                />
              </div>
              <div className="formGroupDetailEmployee">
                <label htmlFor="phoneNumber" className="formLabelDetailEmployee">
                  Số điện thoại:
                </label>
                <input
                  className="formControlDetailEmployee"
                  name="phoneNumber"
                  id="phoneNumber"
                  type="text"
                  value={dataForm.phoneNumber}
                  onChange={handleChange}
                  readOnly={!editStatus}
                />
              </div>
              <div className="formGroupDetailEmployee">
                <label htmlFor="birthday" className="formLabelDetailEmployee">
                  Ngày sinh:
                </label>
                <input
                  className="formControlDetailEmployee"
                  name="birthday"
                  id="birthday"
                  type="date"
                  value={dataForm.birthday}
                  onChange={handleChange}
                  readOnly={!editStatus}
                />
              </div>
            </div>
            <div className="formColumnDetailEmployee">
              <div className="formGroupDetailEmployee">
                <label htmlFor="address" className="formLabelDetailEmployee">
                  Địa chỉ:
                </label>
                <input
                  className="formControlDetailEmployee"
                  name="address"
                  id="address"
                  type="text"
                  value={dataForm.address}
                  onChange={handleChange}
                  readOnly={!editStatus}
                />
              </div>
              <div className="formGroupDetailEmployee">
                <label htmlFor="sex" className="formLabelDetailEmployee">
                  Giới tính:
                </label>
                <select
                  className="formControlDetailEmployee"
                  name="sex"
                  id="sex"
                  value={dataForm.sex}
                  onChange={handleChange}
                  disabled={!editStatus}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="1">Nam</option>
                  <option value="0">Nữ</option>
                </select>
              </div>
              <div className="formGroupDetailEmployee">
                <label htmlFor="status" className="formLabelDetailEmployee">
                  Trạng thái:
                </label>
                <select
                  className="formControlDetailEmployee"
                  name="status"
                  id="status"
                  value={dataForm.status}
                  onChange={handleChange}
                  disabled={!editStatus}
                >
                  <option value="">Chọn trạng thái</option>
                  <option value="1">Active</option>
                  <option value="0">Locked</option>
                </select>
              </div>
              <div className="formGroupDetailEmployee">
                <label htmlFor="storeId" className="formLabelDetailEmployee">
                  Cửa hàng:
                </label>
                <select
                  className="formControlDetailEmployee"
                  name="storeId"
                  id="storeId"
                  value={dataForm.storeId}
                  onChange={handleChange}
                  disabled={!editStatus}
                >
                  <option value="">Chọn cửa hàng</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="formGroupDetailEmployee">
                <label htmlFor="roleId" className="formLabelDetailEmployee">
                  Vai trò:
                </label>
                <select
                  className="formControlDetailEmployee"
                  name="roleId"
                  id="roleId"
                  value={dataForm.roleId}
                  onChange={handleChange}
                  disabled={!editStatus}
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
        {editStatus ? (
          <div className="modalFooterDetailEmployee">
            <button className="cancelButtonDetailEmployee" onClick={handleCancel}>
              Hủy
            </button>
            <button
              type="submit"
              className="submitButtonDetailEmployee"
              onClick={handleSubmit}
            >
              Lưu
            </button>
          </div>
        ) : (
          <div className="editContainerDetailEmployee">
            <h4 className="editTitleDetailEmployee">Chỉnh sửa thông tin</h4>
            <button className="editButtonDetailEmployee" onClick={handleEditToggle}>
              <TiEdit className="editIconDetailEmployee" />
            </button>
          </div>
        )}
      </Modal>
    </>
  );
});