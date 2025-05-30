import React, { useEffect, useState, useRef } from "react";
import { GrCircleInformation } from "react-icons/gr";
import { TiEdit } from "react-icons/ti";
import { Modal } from "bootstrap";
import "./DetailStore.css";
import { fetchGet, fetchPut } from "../../../../lib/httpHandler";
import { showErrorMessageBox } from "../../../MessageBox/ErrorMessageBox/showErrorMessageBox";
import { showSuccessMessageBox } from "../../../MessageBox/SuccessMessageBox/showSuccessMessageBox";

export default React.memo(function DetailStore({ listStores, setListStores, item }) {
  const [editStatus, setEditStatus] = useState(false);
  const [storeInfo, setStoreInfo] = useState({});
  const [dataForm, setDataForm] = useState({ name: "" });
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null);
  const idModal = `idModal${item.id}`;
  const idTarget = `#${idModal}`;

  // Hàm lấy thông tin cửa hàng
  const fetchStoreInfo = () => {
    if (item?.id) {
      fetchGet(
        `/stores/${item.id}`,
        (res) => {
          console.log("Store info fetched:", res);
          setStoreInfo(res);
          setDataForm({ name: decodeURIComponent(res.name) || "" });
        },
        (err) => showErrorMessageBox(err.message || "Lỗi khi lấy thông tin cửa hàng")
      );
    }
  };

  // Khởi tạo modal và xử lý sự kiện
  useEffect(() => {
    const modalElement = document.getElementById(idModal);
    if (modalElement) {
      modalRef.current = modalElement;
      modalInstanceRef.current = new Modal(modalElement, {
        backdrop: "static",
        keyboard: false,
      });

      modalElement.addEventListener("show.bs.modal", fetchStoreInfo);
      modalElement.addEventListener("hidden.bs.modal", () => {
        setEditStatus(false);
        setDataForm({ name: storeInfo.name || "" });
      });
    } else {
      console.error(`Modal element with ID ${idModal} not found`);
    }

    return () => {
      if (modalElement && modalInstanceRef.current) {
        modalElement.removeEventListener("show.bs.modal", fetchStoreInfo);
        modalElement.removeEventListener("hidden.bs.modal", () => {});
        modalInstanceRef.current.dispose();
        modalInstanceRef.current = null;
      }
    };
  }, [item.id, storeInfo.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => setEditStatus((prev) => !prev);

  const handleCancel = () => {
    setEditStatus(false);
    setDataForm({ name: storeInfo.name || "" });
    if (modalRef.current && modalInstanceRef.current) {
      modalInstanceRef.current.hide();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dataForm.name.trim()) {
      showErrorMessageBox("Vui lòng điền tên cửa hàng");
      return;
    }
    handleUpdate();
  };

  const handleUpdate = () => {
    const uri = `/stores/${item.id}`;
    const updatedData = { name: dataForm.name.trim() };

    fetchPut(
      uri,
      updatedData,
      async (res) => {
        console.log("Update response:", res);
        await showSuccessMessageBox(res.message || "Cập nhật cửa hàng thành công");
        setStoreInfo({ ...storeInfo, name: updatedData.name });
        setDataForm({ name: updatedData.name });
        setListStores((prevList) =>
          prevList.map((listItem) =>
            listItem.id === item.id ? { ...listItem, name: updatedData.name } : listItem
          )
        );
        handleEditToggle();

        // Đóng modal sau khi cập nhật
        if (modalRef.current && modalInstanceRef.current) {
          setTimeout(() => {
            modalInstanceRef.current.hide();
          }, 0);
        } else {
          console.error("Modal instance or element not found for", idModal);
        }
      },
      (err) => {
        console.error("Update error:", err);
        showErrorMessageBox(err.message || "Lỗi khi cập nhật cửa hàng");
      }
    );
  };

  return (
    <>
      <button
        type="button"
        className="border-0 bg-transparent p-0"
        data-bs-toggle="modal"
        data-bs-target={idTarget}
      >
        <GrCircleInformation
          className="icon_information icon_action"
          data-bs-toggle="modal"
          data-bs-target={idTarget}
        />
      </button>

      <div
        className="detailStore modal fade"
        id={idModal}
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fs-4">
                {editStatus ? "Sửa thông tin cửa hàng" : "Thông tin cửa hàng"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleCancel}
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
                <button type="submit" className="btn btn-primary btn_Accept" onClick={handleSubmit}>
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
          </div>
        </div>
      </div>
    </>
  );
});