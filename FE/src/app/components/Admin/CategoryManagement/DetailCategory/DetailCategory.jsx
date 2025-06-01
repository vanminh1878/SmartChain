import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import { GrCircleInformation } from "react-icons/gr";
import { TiEdit } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { fetchGet, fetchPut } from "../../../../lib/httpHandler";
import { showErrorMessageBox } from "../../../MessageBox/ErrorMessageBox/showErrorMessageBox";
import { showSuccessMessageBox } from "../../../MessageBox/SuccessMessageBox/showSuccessMessageBox";
import "./DetailCategory.css";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

export default React.memo(function DetailCategory({ item, fetchCategories }) {
  const [editStatus, setEditStatus] = useState(false);
  const [categoryInfo, setCategoryInfo] = useState({});
  const [dataForm, setDataForm] = useState({
    name: item.name || "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hàm lấy thông tin danh mục
  const fetchCategoryInfo = useCallback(() => {
    if (item?.id && !item.id.startsWith("temp-")) {
      fetchGet(
        `/categories/${item.id}`,
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
    } else {
      console.warn("Invalid category id:", item?.id);
      showErrorMessageBox("ID danh mục không hợp lệ. Không thể lấy thông tin.");
    }
  }, [item.id]);

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
      name: categoryInfo.name || item.name || "",
    });
    setIsModalOpen(false);
  }, [categoryInfo.name, item.name]);

  // Xử lý submit form
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!dataForm.name.trim()) {
        showErrorMessageBox("Vui lòng điền tên danh mục");
        return;
      }
      if (dataForm.name.trim().length > 50) {
        showErrorMessageBox("Tên danh mục không được vượt quá 50 ký tự");
        return;
      }
      handleUpdate();
    },
    [dataForm.name]
  );

  // Xử lý cập nhật danh mục
  const handleUpdate = useCallback(() => {
    if (item.id.startsWith("temp-")) {
      showErrorMessageBox("ID danh mục không hợp lệ. Không thể cập nhật.");
      return;
    }
    const uri = `/categories/${item.id}`;
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
        fetchCategories();
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
              await showSuccessMessageBox(res.message || "Cập nhật danh mục thành công");
              setCategoryInfo({ ...categoryInfo, name: dataForm.name.trim() });
              setDataForm({ name: dataForm.name.trim() });
              fetchCategories();
              setEditStatus(false);
              setIsModalOpen(false);
            },
            (retryErr) => {
              console.error("Retry error:", retryErr);
              showErrorMessageBox(retryErr.message || "Lỗi khi cập nhật danh mục. Vui lòng thử lại sau.");
            },
            () => console.log("Retry request completed")
          );
        } else {
          if (err.status === 409) {
            showErrorMessageBox(err.message || "Tên danh mục đã tồn tại. Vui lòng chọn tên khác.");
          } else {
            showErrorMessageBox(err.title || "Lỗi khi cập nhật danh mục. Vui lòng thử lại.");
          }
        }
      },
      () => console.log("Update request completed")
    );
  }, [item.id, dataForm.name, categoryInfo, fetchCategories]);

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
        className="iconButtonDetailCategory"
        onClick={openModal}
      >
        <GrCircleInformation className="iconInformationDetailCategory" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onAfterClose={handleAfterClose}
        className="modalContentDetailCategory"
        overlayClassName="modalOverlayDetailCategory"
        contentLabel="Thông tin danh mục"
        shouldFocusAfterRender={editStatus}
        shouldCloseOnOverlayClick={false}
      >
        <div className="modalHeaderDetailCategory">
          <h5 className="modalTitleDetailCategory">
            {editStatus ? "Sửa thông tin danh mục" : "Thông tin danh mục"}
          </h5>
          <button
            type="button"
            className="btn-closeDetailCategory"
            onClick={closeModal}
            aria-label="Close"
          >
            <IoClose />
          </button>
        </div>
        <div className="modalBodyDetailCategory">
          <form className="formColumnsDetailCategory" onSubmit={handleSubmit}>
            <div className="formGroupDetailCategory">
              <label htmlFor="name" className="formLabelDetailCategory">
                Tên danh mục:
              </label>
              <input
                className="formControlDetailCategory"
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
          <div className="modalFooterDetailCategory">
            <button className="cancelButtonDetailCategory" onClick={handleCancel}>
              Hủy
            </button>
            <button
              type="submit"
              className="submitButtonDetailCategory"
              onClick={handleSubmit}
            >
              Lưu
            </button>
          </div>
        ) : (
          <div className="editContainerDetailCategory">
            <h4 className="editTitleDetailCategory">Chỉnh sửa thông tin</h4>
            <button className="editButtonDetailCategory" onClick={handleEditToggle}>
              <TiEdit className="editIconDetailCategory" />
            </button>
          </div>
        )}
      </Modal>
    </>
  );
});