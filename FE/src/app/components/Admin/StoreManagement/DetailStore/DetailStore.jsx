import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import { GrCircleInformation } from "react-icons/gr";
import { TiEdit } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { fetchGet, fetchPut } from "../../../../lib/httpHandler";
import { showErrorMessageBox } from "../../../../components/MessageBox/ErrorMessageBox/showErrorMessageBox";
import { showSuccessMessageBox } from "../../../MessageBox/SuccessMessageBox/showSuccessMessageBox";
import "./DetailStore.css";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

export default React.memo(function DetailStore({ item, setListStores }) {
  const [editStatus, setEditStatus] = useState(false);
  const [storeInfo, setStoreInfo] = useState({});
  const [dataForm, setDataForm] = useState({
    name: item.name || "",
    phoneNumber: item.phoneNumber || "",
    address: item.address || "",
    email: item.email || ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hàm lấy thông tin cửa hàng
  const fetchStoreInfo = useCallback(() => {
    if (item?.id) {
      fetchGet(
        `/stores/${item.id}`,
        (res) => {
          console.log("Store info fetched:", res);
          setStoreInfo(res);
          setDataForm({
            name: decodeURIComponent(res.name || ""),
            phoneNumber: decodeURIComponent(res.phoneNumber || ""),
            address: decodeURIComponent(res.address || ""),
            email: decodeURIComponent(res.email || "")
          });
        },
        (err) => {
          console.error("Fetch store error:", err);
          showErrorMessageBox(err.message || "Lỗi khi lấy thông tin cửa hàng. Vui lòng thử lại.");
        },
        () => console.log("Fetch store info completed")
      );
    }
  }, [item.id]);

  // Load dữ liệu khi modal mở
  useEffect(() => {
    if (isModalOpen) {
      fetchStoreInfo();
    }
  }, [isModalOpen, fetchStoreInfo]);

  // Xử lý thay đổi input
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Xử lý toggle chế độ chỉnh sửa
  const handleEditToggle = useCallback(() => {
    setEditStatus((prev) => !prev);
    setTimeout(() => {
      const input = document.querySelector(`input[name="name"]`);
      if (input) input.focus();
    }, 100);
  }, []);

  // Xử lý hủy chỉnh sửa
  const handleCancel = useCallback(() => {
    setEditStatus(false);
    setDataForm({
      name: storeInfo.name || "",
      phoneNumber: storeInfo.phoneNumber || "",
      address: storeInfo.address || "",
      email: storeInfo.email || ""
    });
    setIsModalOpen(false);
  }, [storeInfo.name, storeInfo.phoneNumber, storeInfo.address, storeInfo.email]);

  // Xử lý submit form
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
      handleUpdate();
    },
    [dataForm.name, dataForm.phoneNumber, dataForm.address, dataForm.email]
  );

  // Xử lý cập nhật cửa hàng
  const handleUpdate = useCallback(() => {
    const uri = `/stores/${item.id}`;
    const updatedData = {
      name: dataForm.name.trim(),
      phoneNumber: dataForm.phoneNumber.trim(),
      address: dataForm.address.trim(),
      email: dataForm.email.trim()
    };
    console.log("Sending PUT request to:", uri, "with data:", updatedData);

    fetchPut(
      uri,
      updatedData,
      async (res) => {
        console.log("Update response:", res);
        await showSuccessMessageBox(res.message || "Cập nhật cửa hàng thành công");
        setStoreInfo({ ...storeInfo, ...updatedData });
        setDataForm({ ...updatedData });
        setListStores((prevList) =>
          prevList.map((listItem) =>
            listItem.id === item.id ? { ...listItem, ...updatedData } : listItem
          )
        );
        setEditStatus(false);
        setIsModalOpen(false);
      },
      (err) => {
        console.error("Update error details:", err);
        if (err.message === "Phản hồi từ server không phải JSON" || err.status === 500) {
          console.log("Retrying with only name...");
          fetchPut(
            uri,
            { name: dataForm.name.trim() },
            async (res) => {
              console.log("Retry response:", res);
              await showSuccessMessageBox(res.message || "Cập nhật cửa hàng thành công");
              setStoreInfo({ ...storeInfo, name: dataForm.name.trim() });
              setDataForm({ ...dataForm, name: dataForm.name.trim() });
              setListStores((prevList) =>
                prevList.map((listItem) =>
                  listItem.id === item.id ? { ...listItem, name: dataForm.name.trim() } : listItem
                )
              );
              setEditStatus(false);
              setIsModalOpen(false);
            },
            (retryErr) => {
              console.error("Retry error:", retryErr);
              showErrorMessageBox(retryErr.message || "Lỗi khi cập nhật cửa hàng. Vui lòng thử lại sau.");
            },
            () => console.log("Retry request completed")
          );
        } else {
          if (err.status === 409) {
            showErrorMessageBox(err.message || "Tên cửa hàng đã tồn tại. Vui lòng chọn tên khác.");
          } else {
            showErrorMessageBox(err.message || "Lỗi khi cập nhật cửa hàng. Vui lòng thử lại.");
          }
        }
      },
      () => console.log("Update request completed")
    );
  }, [item.id, dataForm.name, dataForm.phoneNumber, dataForm.address, dataForm.email, setListStores, storeInfo]);

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
        className="iconButtonDetailStore"
        onClick={openModal}
      >
        <GrCircleInformation className="iconInformationDetailStore" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onAfterClose={handleAfterClose}
        className="modalContentDetailStore"
        overlayClassName="modalOverlayDetailStore"
        contentLabel="Thông tin cửa hàng"
        shouldFocusAfterRender={editStatus}
        shouldCloseOnOverlayClick={false}
      >
        <div className="modalHeaderDetailStore">
          <h5 className="modalTitleDetailStore">
            {editStatus ? "Sửa thông tin cửa hàng" : "Thông tin cửa hàng"}
          </h5>
          <button
            type="button"
            className="btn-closeDetailStore"
            onClick={closeModal}
            aria-label="Close"
          >
            <IoClose />
          </button>
        </div>
        <div className="modalBodyDetailStore">
          <form className="formColumnsDetailStore" onSubmit={handleSubmit}>
            <div className="formGroupDetailStore">
              <label htmlFor="name" className="formLabelDetailStore">
                Tên cửa hàng:
              </label>
              <input
                className="formControlDetailStore"
                name="name"
                id="name"
                type="text"
                value={dataForm.name}
                onChange={handleChange}
                readOnly={!editStatus}
              />
            </div>
            <div className="formGroupDetailStore">
              <label htmlFor="phoneNumber" className="formLabelDetailStore">
                Số điện thoại:
              </label>
              <input
                className="formControlDetailStore"
                name="phoneNumber"
                id="phoneNumber"
                type="text"
                value={dataForm.phoneNumber}
                onChange={handleChange}
                readOnly={!editStatus}
              />
            </div>
            <div className="formGroupDetailStore">
              <label htmlFor="address" className="formLabelDetailStore">
                Địa chỉ:
              </label>
              <input
                className="formControlDetailStore"
                name="address"
                id="address"
                type="text"
                value={dataForm.address}
                onChange={handleChange}
                readOnly={!editStatus}
              />
            </div>
            <div className="formGroupDetailStore">
              <label htmlFor="email" className="formLabelDetailStore">
                Email:
              </label>
              <input
                className="formControlDetailStore"
                name="email"
                id="email"
                type="email"
                value={dataForm.email}
                onChange={handleChange}
                readOnly={!editStatus}
              />
            </div>
          </form>
        </div>
        {editStatus ? (
          <div className="modalFooterDetailStore">
            <button className="cancelButtonDetailStore" onClick={handleCancel}>
              Hủy
            </button>
            <button
              type="submit"
              className="submitButtonDetailStore"
              onClick={handleSubmit}
            >
              Lưu
            </button>
          </div>
        ) : (
          <div className="editContainerDetailStore">
            <h4 className="editTitleDetailStore">Chỉnh sửa thông tin</h4>
            <button className="editButtonDetailStore" onClick={handleEditToggle}>
              <TiEdit className="editIconDetailStore" />
            </button>
          </div>
        )}
      </Modal>
    </>
  );
});