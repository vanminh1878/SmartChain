import React, { useEffect, useState, useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import { GrCircleInformation } from "react-icons/gr";
import { TiEdit } from "react-icons/ti";
import { Modal } from "bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchGet, fetchPut } from "../../../lib/httpHandler";
import { showErrorMessageBox } from "../../../components/MessageBox/ErrorMessageBox/showErrorMessageBox";
import { showSuccessMessageBox } from "../../../components/MessageBox/SuccessMessageBox/showSuccessMessageBox";
import "./StoreManagement.css";

export default function StoreManagement() {
  const [listStores, setListStores] = useState([]);
  const [listStoresShow, setListStoresShow] = useState([]);
  const [dataSearch, setDataSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [editStatus, setEditStatus] = useState(false);
  const [storeInfo, setStoreInfo] = useState({});
  const [dataForm, setDataForm] = useState({ name: "" });
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null);

  // Lấy danh sách cửa hàng
  useEffect(() => {
    const uri = "/stores";
    fetchGet(
      uri,
      (sus) => {
        const stores = Array.isArray(sus) ? sus : [];
        if (!stores.length && sus) {
          toast.error("Dữ liệu từ server không hợp lệ");
        }
        setListStores(stores);
        setListStoresShow(stores);
      },
      (fail) => {
        toast.error(fail.message || "Lỗi khi lấy danh sách cửa hàng");
        setListStores([]);
        setListStoresShow([]);
      }
    );
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value;
    setDataSearch(value);
    applySearch(value);
  };

  const applySearch = (searchValue) => {
    if (!Array.isArray(listStores)) {
      console.error("listStores không phải mảng:", listStores);
      setListStoresShow([]);
      return;
    }
    let filteredList = [...listStores];
    if (searchValue.trim()) {
      const lowercasedSearch = searchValue.toLowerCase();
      filteredList = filteredList.filter((item) =>
        item.name?.toLowerCase()?.includes(lowercasedSearch)
      );
    }
    setListStoresShow(filteredList);
  };

  useEffect(() => {
    applySearch(dataSearch);
  }, [listStores, dataSearch]);

  // Xử lý khóa/mở khóa cửa hàng
  const handleLockStore = (storeId, status) => {
    const uri = `/Stores/${storeId}`;
    fetchPut(
      uri,
      { status: !status },
      (sus) => {
        setListStores((prev) =>
          prev.map((item) =>
            item.id === storeId ? { ...item, status: !status } : item
          )
        );
        toast.success(`Cửa hàng đã được ${status ? "mở khóa" : "khóa"} thành công!`);
      },
      (fail) => {
        toast.error(fail.message || "Lỗi khi khóa/mở khóa cửa hàng");
      }
    );
  };

  // Mở modal và lấy thông tin cửa hàng
  const openStoreModal = (store) => {
    setSelectedStore(store);
    setEditStatus(false);
    setDataForm({ name: store.name || "" });
    fetchGet(
      `/stores/${store.id}`,
      (res) => {
        console.log("Store info fetched:", res);
        setStoreInfo(res);
        setDataForm({ name: decodeURIComponent(res.name) || "" });
        if (modalInstanceRef.current) {
          modalInstanceRef.current.show();
        }
      },
      (err) => showErrorMessageBox(err.message || "Lỗi khi lấy thông tin cửa hàng")
    );
  };

  // Khởi tạo modal
  useEffect(() => {
    const modalElement = document.getElementById("storeModal");
    if (modalElement) {
      modalRef.current = modalElement;
      modalInstanceRef.current = new Modal(modalElement, {
        backdrop: "static",
        keyboard: false,
      });
      modalElement.addEventListener("hidden.bs.modal", () => {
        setEditStatus(false);
        setSelectedStore(null);
        setDataForm({ name: "" });
        setStoreInfo({});
      });
    }

    return () => {
      if (modalElement && modalInstanceRef.current) {
        modalElement.removeEventListener("hidden.bs.modal", () => {});
        modalInstanceRef.current.dispose();
        modalInstanceRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => setEditStatus((prev) => !prev);

  const handleCancel = () => {
    setEditStatus(false);
    setDataForm({ name: storeInfo.name || "" });
    if (modalInstanceRef.current) {
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
    const uri = `/stores/${selectedStore.id}`;
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
            listItem.id === selectedStore.id ? { ...listItem, name: updatedData.name } : listItem
          )
        );
        handleEditToggle();
        if (modalInstanceRef.current) {
          setTimeout(() => {
            modalInstanceRef.current.hide();
          }, 0);
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
      <ToastContainer />
      <div className="store-management">
        <div className="title py-3 fs-5 mb-2">
          Số lượng cửa hàng: {listStoresShow?.length || 0}
        </div>
        <div className="row mx-0 my-0">
          <div className="col-12 pb-4 px-0 d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center col-10">
              <div className="contain_Search position-relative col-4 me-3">
                <input
                  onChange={handleSearch}
                  value={dataSearch}
                  className="search rounded-2 px-3"
                  placeholder="Nhập tên cửa hàng muốn tìm"
                />
                <IoIosSearch className="icon_search translate-middle-y text-secondary" />
              </div>
            </div>
          </div>
          <div className="contain_Table mx-0 col-12 bg-white rounded-2">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên cửa hàng</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listStoresShow && listStoresShow.length > 0 ? (
                  listStoresShow.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name || "Không có tên"}</td>
                      <td>{item.status ? "Hoạt động" : "Khóa"}</td>
                      <td>
                        <div className="list_Action d-flex gap-2">
                          <button
                            type="button"
                            className="border-0 bg-transparent p-0"
                            onClick={() => openStoreModal(item)}
                          >
                            <GrCircleInformation className="icon_information icon_action" />
                          </button>
                          <button
                            onClick={() => handleLockStore(item.id, item.status)}
                            className="btn btn-sm btn-warning"
                            title={item.status ? "Khóa" : "Mở khóa"}
                          >
                            {item.status ? "Khóa" : "Mở khóa"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Không có cửa hàng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <nav className="contain_pagination">
              <ul className="pagination">
                <li className="page-item">
                  <a className="page-link page-link-two" href="#">
                    «
                  </a>
                </li>
                <li className="page-item active">
                  <a className="page-link" href="#">
                    1
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    2
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    3
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link page-link-two" href="#">
                    »
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Modal duy nhất */}
      <div
        className="detailStore modal fade"
        id="storeModal"
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
}