import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import { GrCircleInformation } from "react-icons/gr";
import { TiEdit } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { fetchGet, fetchPut, fetchUpload, BE_ENPOINT } from "../../../../lib/httpHandler";
import { showErrorMessageBox } from "../../../../components/MessageBox/ErrorMessageBox/showErrorMessageBox";
import { showSuccessMessageBox } from "../../../MessageBox/SuccessMessageBox/showSuccessMessageBox";
import "./DetailCustomer.css";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

export default React.memo(function DetailCustomer({ item, setListCustomers }) {
  const [editStatus, setEditStatus] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({});
  const [dataForm, setDataForm] = useState({
    fullname: item.fullname || "",
    email: item.email || "",
    phoneNumber: item.phoneNumber || "",
    address: item.address || "",
    sex: item.sex || "",
    status: item.status === "Active" ? "1" : item.status === "Locked" ? "0" : "",
    avatar: item.avatar || "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hàm lấy thông tin khách hàng
  const fetchCustomerInfo = useCallback(() => {
    if (item?.id) {
      fetchGet(
        `/customers/${item.id}`,
        (customerRes) => {
          console.log("Customer info fetched:", customerRes);

          const customerInfo = {
            ...customerRes,
            fullname: customerRes.fullname || "",
            email: customerRes.email || "",
            phoneNumber: customerRes.phoneNumber || "",
            address: customerRes.address || "",
            avatar: customerRes.avatar || "",
            sex: customerRes.sex !== undefined ? customerRes.sex : "",
            status: customerRes.status !== undefined ? customerRes.status : "",
          };
          console.log("Customer info:", customerInfo);
          setCustomerInfo(customerInfo);
          setDataForm({
            fullname: decodeURIComponent(customerInfo.fullname || ""),
            email: decodeURIComponent(customerInfo.email || ""),
            phoneNumber: decodeURIComponent(customerInfo.phoneNumber || ""),
            address: decodeURIComponent(customerInfo.address || ""),
            sex: customerInfo.sex !== undefined ? (customerInfo.sex ? "1" : "0") : "",
            status: customerInfo.status !== undefined ? (customerInfo.status ? "1" : "0") : "",
            avatar: customerInfo.avatar || "",
          });
        },
        (err) => {
          console.error("Fetch customer error:", err);
          showErrorMessageBox(err.message || "Lỗi khi lấy thông tin khách hàng. Vui lòng thử lại.");
        },
        () => console.log("Fetch customer completed")
      );
    }
  }, [item.id]);

  // Load dữ liệu khi modal mở
  useEffect(() => {
    if (isModalOpen) {
      fetchCustomerInfo();
    }
  }, [isModalOpen, fetchCustomerInfo]);

  // Xử lý thay đổi input
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Xử lý upload ảnh
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
        const avatarUrl = data.fileName; // Lưu tên file
        setCustomerInfo((prev) => ({ ...prev, avatar: avatarUrl }));
        setDataForm((prev) => ({ ...prev, avatar: avatarUrl }));
        showSuccessMessageBox("Ảnh đại diện đã được upload thành công!");
      },
      (fail) => {
        showErrorMessageBox(fail.message || "Upload ảnh thất bại!");
      },
      () => {
        showErrorMessageBox("Không thể kết nối đến server");
      }
    );
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
      fullname: customerInfo.fullname || "",
      email: customerInfo.email || "",
      phoneNumber: customerInfo.phoneNumber || "",
      address: customerInfo.address || "",
      sex: customerInfo.sex !== undefined ? (customerInfo.sex ? "1" : "0") : "",
      status: customerInfo.status !== undefined ? (customerInfo.status ? "1" : "0") : "",
      avatar: customerInfo.avatar || "",
    });
    setIsModalOpen(false);
  }, [customerInfo]);

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
      handleUpdate();
    },
    [dataForm]
  );

  // Xử lý cập nhật khách hàng
  const handleUpdate = useCallback(() => {
    const uri = `/customers/${item.id}`;
    console.log(dataForm);
    const updatedData = {
      fullname: dataForm.fullname.trim(),
      email: dataForm.email.trim(),
      phoneNumber: dataForm.phoneNumber,
      address: dataForm.address.trim(),
      sex: parseInt(dataForm.sex) === 1, // Boolean cho backend
      status: parseInt(dataForm.status) === 1, // Boolean cho status
      avatar: dataForm.avatar || null,
    };
    console.log("Sending PUT request to:", uri, "with data:", updatedData);

    fetchPut(
      uri,
      updatedData,
      async (res) => {
        await showSuccessMessageBox(res.message || "Cập nhật khách hàng thành công");

        // Cập nhật customerInfo
        const updatedCustomerInfo = {
          ...customerInfo,
          ...updatedData,
        };
        setCustomerInfo(updatedCustomerInfo);

        // Cập nhật dataForm
        setDataForm({
          ...updatedData,
          sex: parseInt(dataForm.sex) ? "1" : "0",
          status: parseInt(dataForm.status) ? "1" : "0",
        });

        // Cập nhật listCustomers với định dạng của CustomerManagement
        setListCustomers((prevList) =>
          prevList.map((listItem) =>
            listItem.id === item.id
              ? {
                  ...listItem,
                  fullname: updatedData.fullname,
                  email: updatedData.email,
                  phoneNumber: updatedData.phoneNumber,
                  address: updatedData.address,
                  sex: parseInt(dataForm.sex) === 1 ? "Nam" : "Nữ", // Định dạng "Nam"/"Nữ"
                  status: parseInt(dataForm.status) === 1 ? "Active" : "Locked", // Định dạng "Active"/"Locked"
                  avatar: updatedData.avatar,
                }
              : listItem
          )
        );
        setEditStatus(false);
        setIsModalOpen(false);
      },
      (err) => {
        console.error("Update error details:", err);
        console.log("Error response:", JSON.stringify(err, null, 2));
        showErrorMessageBox(err.title || "Lỗi khi cập nhật khách hàng. Vui lòng thử lại.");
      },
      () => console.log("Update request completed")
    );
  }, [item.id, dataForm, setListCustomers, customerInfo]);

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
      <button type="button" className="iconButtonDetailCustomer" onClick={openModal}>
        <GrCircleInformation className="iconInformationDetailCustomer" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onAfterClose={handleAfterClose}
        className="modalContentDetailCustomer"
        overlayClassName="modalOverlayDetailCustomer"
        contentLabel="Thông tin khách hàng"
        shouldFocusAfterRender={editStatus}
        shouldCloseOnOverlayClick={false}
      >
        <div className="modalHeaderDetailCustomer">
          <h5 className="modalTitleDetailCustomer">
            {editStatus ? "Sửa thông tin khách hàng" : "Thông tin khách hàng"}
          </h5>
          <button
            type="button"
            className="btn-closeDetailCustomer"
            onClick={closeModal}
            aria-label="Close"
          >
            <IoClose />
          </button>
        </div>
        <div className="modalBodyDetailCustomer">
          
          <form className="formColumnsDetailCustomer" onSubmit={handleSubmit}>
            <div className="formColumnDetailCustomer">
              <div className="formGroupDetailCustomer">
                <label htmlFor="fullname" className="formLabelDetailCustomer">
                  Họ tên:
                </label>
                <input
                  className="formControlDetailCustomer"
                  name="fullname"
                  id="fullname"
                  type="text"
                  value={dataForm.fullname}
                  onChange={handleChange}
                  readOnly={!editStatus}
                />
              </div>
              <div className="formGroupDetailCustomer">
                <label htmlFor="email" className="formLabelDetailCustomer">
                  Email:
                </label>
                <input
                  className="formControlDetailCustomer"
                  name="email"
                  id="email"
                  type="email"
                  value={dataForm.email}
                  onChange={handleChange}
                  readOnly={!editStatus}
                />
              </div>
              <div className="formGroupDetailCustomer">
                <label htmlFor="phoneNumber" className="formLabelDetailCustomer">
                  Số điện thoại:
                </label>
                <input
                  className="formControlDetailCustomer"
                  name="phoneNumber"
                  id="phoneNumber"
                  type="text"
                  value={dataForm.phoneNumber}
                  onChange={handleChange}
                  readOnly={!editStatus}
                />
              </div>
            </div>
            <div className="formColumnDetailCustomer">
              <div className="formGroupDetailCustomer">
                <label htmlFor="address" className="formLabelDetailCustomer">
                  Địa chỉ:
                </label>
                <input
                  className="formControlDetailCustomer"
                  name="address"
                  id="address"
                  type="text"
                  value={dataForm.address}
                  onChange={handleChange}
                  readOnly={!editStatus}
                />
              </div>
              <div className="formGroupDetailCustomer">
                <label htmlFor="sex" className="formLabelDetailCustomer">
                  Giới tính:
                </label>
                <select
                  className="formControlDetailCustomer"
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
              <div className="formGroupDetailCustomer">
                <label htmlFor="status" className="formLabelDetailCustomer">
                  Trạng thái:
                </label>
                <select
                  className="formControlDetailCustomer"
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
            </div>
          </form>
        </div>
        {editStatus ? (
          <div className="modalFooterDetailCustomer">
            <button className="cancelButtonDetailCustomer" onClick={handleCancel}>
              Hủy
            </button>
            <button
              type="submit"
              className="submitButtonDetailCustomer"
              onClick={handleSubmit}
            >
              Lưu
            </button>
          </div>
        ) : (
          <div className="editContainerDetailCustomer">
            <h4 className="editTitleDetailCustomer">Chỉnh sửa thông tin</h4>
            <button className="editButtonDetailCustomer" onClick={handleEditToggle}>
              <TiEdit className="editIconDetailCustomer" />
            </button>
          </div>
        )}
      </Modal>
    </>
  );
});