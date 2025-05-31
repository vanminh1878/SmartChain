import React, { useEffect, useState, useMemo, useCallback } from "react";
import { IoIosSearch, IoIosLock, IoIosUnlock } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchGet, fetchPut } from "../../../lib/httpHandler";
import DetailStore from "../../../components/Admin/StoreManagement/DetailStore/DetailStore.jsx";
import AddStore from "../../../components/Admin/StoreManagement/AddStore/AddStore.jsx";
import "./StoreManagement.css";

export default function StoreManagement() {
  const [listStores, setListStores] = useState([]);
  const [owners, setOwners] = useState({});
  const [dataSearch, setDataSearch] = useState("");

  // Fetch store list and owner details
  useEffect(() => {
    fetchGet(
      "/stores",
      async (sus) => {
        const stores = Array.isArray(sus) ? sus : [];
        if (!stores.length && sus) {
          toast.error("Dữ liệu từ server không hợp lệ");
        }
        setListStores(stores);

        // Lấy thông tin chủ sở hữu
        const ownerIds = [...new Set(stores.map((store) => store.ownerId))];
        console.log("Owner IDs:", ownerIds);

        const ownerPromises = ownerIds.map((ownerId) =>
          fetchGet(
            `/Users/${ownerId}`,
            (user) => {
              console.log(`User data for ${ownerId}:`, user);
              return { [ownerId]: user };
            },
            (error) => {
              console.log(`Error fetching user ${ownerId}:`, error);
              return { [ownerId]: null };
            },
            (error) => {
              console.log(`Catch error for user ${ownerId}:`, error);
              return { [ownerId]: null };
            }
          ).catch((err) => {
            console.error(`Promise error for user ${ownerId}:`, err);
            return { [ownerId]: null };
          })
        );

        // Chờ tất cả các request hoàn thành
        const ownerResults = await Promise.all(ownerPromises);
        console.log("Owner results:", ownerResults); // Debug ownerResults
        const ownersMap = ownerResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        console.log("Owners map:", ownersMap); // Debug ownersMap
        setOwners(ownersMap);
      },
      (fail) => {
        toast.error(fail.message || "Lỗi khi lấy danh sách cửa hàng");
        setListStores([]);
      },
      () => {
        toast.error("Có lỗi xảy ra khi lấy danh sách cửa hàng");
        setListStores([]);
      }
    );
  }, []);

  // Optimize search with useMemo
  const listStoresShow = useMemo(() => {
    if (!Array.isArray(listStores)) {
      console.error("listStores không phải mảng:", listStores);
      return [];
    }
    if (!dataSearch.trim()) return listStores;
    const lowercasedSearch = dataSearch.toLowerCase();
    return listStores.filter((item) =>
      item.name?.toLowerCase()?.includes(lowercasedSearch)
    );
  }, [listStores, dataSearch]);

  // Handle search input
  const handleSearch = useCallback((e) => {
    setDataSearch(e.target.value);
  }, []);

  // Handle lock/unlock store
  const handleLockStore = useCallback((storeId, status) => {
    fetchPut(
      `/stores/lock/${storeId}`,
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
      },
      () => {
        toast.error("Có lỗi xảy ra khi khóa/mở khóa cửa hàng");
      }
    );
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="store-management">
        <div className="title py-3 fs-5 mb-2">
          Số lượng cửa hàng: {listStoresShow.length || 0}
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
            <AddStore setListStores={setListStores} />
          </div>
          <div className="contain_Table mx-0 col-12 bg-white rounded-2">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên cửa hàng</th>
                  <th>Địa chỉ</th>
                  <th>Số điện thoại</th>
                  <th>Email</th>
                  <th>Chủ sở hữu</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listStoresShow.length > 0 ? (
                  listStoresShow.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name || "Không có tên"}</td>
                      <td>{item.address || "Không có địa chỉ"}</td>
                      <td>{item.phoneNumber || "Không có số điện thoại"}</td>
                      <td>{item.email || "Không có email"}</td>
                      <td>
                        {owners[item.ownerId]?.fullname || owners[item.ownerId]?.email || "Không có thông tin"}
                      </td>
                      <td>{item.status ? "Hoạt động" : "Khóa"}</td>
                      <td>
                        <div className="list_Action d-flex gap-2">
                          <DetailStore item={item} setListStores={setListStores} key={item.id} />
                          <button
                            onClick={() => handleLockStore(item.id, item.status)}
                            className="btn btn-sm btn-link p-0"
                            title={item.status ? "Khóa" : "Mở khóa"}
                          >
                            {item.status ? (
                              <IoIosLock size={20} className="text-warning" />
                            ) : (
                              <IoIosUnlock size={20} className="text-success" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
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
    </>
  );
}