import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import { GrCircleInformation } from "react-icons/gr";
import { TiEdit } from "react-icons/ti";
import { fetchGet, fetchPut } from "../../../../lib/httpHandler";
import { showErrorMessageBox } from "../../../MessageBox/ErrorMessageBox/showErrorMessageBox";
import { showSuccessMessageBox } from "../../../MessageBox/SuccessMessageBox/showSuccessMessageBox";
import "./DetailCategory.css"; // Giữ nguyên CSS như yêu cầu

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

export default React.memo(function EditCategory({ item, setListCategories }) {
  const [editStatus, setEditStatus] = useState(false);
  const [categoryInfo, setCategoryInfo] = useState({});
  const [dataForm, setDataForm] = useState({
    name: item.name || "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hàm lấy thông tin danh mục
  const fetchCategoryInfo = useCallback(() => {
    if (item?._id) {
      fetchGet(
        `/categories/${item._id}`,
        (res) => {
          console.log("Category info fetched:", res);
          setCategoryInfo(res);
          setDataForm({
            name: decodeURIComponent(res.name || ""),
          });
        },
        (err) => {
          console.error("Fetch category error:", err);
          showErrorMessageBox(err.message || "Lỗi khi lấy thông tin danh mục. Vui lòng thử lại.");
        },
        () => console.log("Fetch category info completed")
      );
    }
  }, [item._id]);

  // Load dữ liệu khi modal mở
  useEffect(() => {
    if (isModalOpen) {
      fetchCategoryInfo();
    }
  }, [isModalOpen, fetchCategoryInfo]);

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
      name: categoryInfo.name || "",
    });
    setIsModalOpen(false);
  }, [categoryInfo.name]);

  // Xử lý submit form
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!dataForm.name.trim()) {
        showErrorMessageBox("Vui lòng điền tên danh mục");
        return;
      }
      handleUpdate();
    },
    [dataForm.name]
  );

  // Xử lý cập nhật danh mục
  const handleUpdate = useCallback(() => {
    const uri = `/categories/${item._id}`;
    const updatedData = {
      name: dataForm.name.trim(),
    };
    console.log("Sending PUT request to:", uri, "with data:", updatedData);

    fetchPut(
      uri,
      updatedData,
      async (res) => {
        console.log("Update response:", res);
        await showSuccessMessageBox(res.message || "Cập nhật danh mục thành công");
        setCategoryInfo({ ...categoryInfo, ...updatedData });
        setDataForm({ ...updatedData });
        setListCategories((prevList) =>
          prevList.map((listItem) =>
            listItem._id === item._id ? { ...listItem, ...updatedData } : listItem
          )
        );
        setEditStatus(false);
        setIsModalOpen(false);
      },
      (err) => {
        console.error("Update error:", err);
        showErrorMessageBox(err.message || "Lỗi khi cập nhật danh mục. Vui lòng thử lại.");
      },
      () => console.log("Update request completed")
    );
  }, [item._id, dataForm.name, setListCategories, categoryInfo]);

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
        contentLabel="Thông tin danh mục"
        shouldFocusAfterRender={editStatus}
        shouldCloseOnOverlayClick={false}
      >
        <div className="modal-header">
          <h5 className="modal-title fs-4">
            {editStatus ? "Sửa thông tin danh mục" : "Thông tin danh mục"}
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
                readOnly={!editStatus}
                autoFocus={editStatus}
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