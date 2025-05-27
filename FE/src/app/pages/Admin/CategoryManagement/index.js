import React, { useEffect, useState } from "react";
import { fetchGet, fetchPut } from "../../../lib/httpHandler"; // Giả sử bạn có fetchPut để khóa danh mục
// import AddCategory from "../../../components/Admin/DiseaseGroupManagement/DeleteDiseaseGroup/DeleteDiseaseGroup";
import { IoIosSearch } from "react-icons/io";
import "./CategoryManagement.css";
// import EditCategory from "../../../components/Admin/DiseaseGroupManagement/DeleteDiseaseGroup/DeleteDiseaseGroup";
// import LockCategory from "../../../components/Admin/DiseaseGroupManagement/DeleteDiseaseGroup/DeleteDiseaseGroup";

export default function CategoryManagement() {
  const [listCategories, setListCategories] = useState([]);
  const [listCategoriesShow, setListCategoriesShow] = useState([]);
  const [dataSearch, setDataSearch] = useState("");

  // Lấy danh sách danh mục từ backend
  useEffect(() => {
    const uri = "/api/admin/categories";
    fetchGet(
      uri,
      (sus) => {
        console.log("Dữ liệu danh mục từ BE:", sus);
        setListCategories(sus.data.items);
        setListCategoriesShow(sus.data.items); // Khởi tạo danh sách hiển thị
      },
      (fail) => {
        alert(fail.message);
      },
      () => {
        alert("Có lỗi xảy ra khi lấy danh sách danh mục");
      }
    );
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value;
    setDataSearch(value);
    applySearch(value);
  };

  // Lọc danh sách danh mục theo từ khóa tìm kiếm
  const applySearch = (searchValue) => {
    let filteredList = [...listCategories];
    if (searchValue.trim()) {
      const lowercasedSearch = searchValue.toLowerCase();
      filteredList = filteredList.filter((item) =>
        item.tenDanhMuc.toLowerCase().includes(lowercasedSearch)
      );
    }
    setListCategoriesShow(filteredList);
  };

  // Cập nhật danh sách hiển thị khi danh sách danh mục hoặc từ khóa tìm kiếm thay đổi
  useEffect(() => {
    applySearch(dataSearch);
  }, [listCategories, dataSearch]);

  // Xử lý khóa danh mục
  const handleLockCategory = (categoryId, isLocked) => {
    const uri = `/api/admin/categories/${categoryId}/lock`;
    fetchPut(
      uri,
      { isLocked: !isLocked }, // Đảo trạng thái khóa
      (sus) => {
        setListCategories((prev) =>
          prev.map((item) =>
            item._id === categoryId ? { ...item, isLocked: !isLocked } : item
          )
        );
        alert(`Danh mục đã được ${isLocked ? "mở khóa" : "khóa"} thành công!`);
      },
      (fail) => {
        alert(fail.message);
      },
      () => {
        alert("Có lỗi xảy ra khi khóa/mở khóa danh mục");
      }
    );
  };

  return (
    <>
      <div className="category-management">
        <div className="title py-3 fs-5 mb-2">
          Số lượng danh mục: {listCategoriesShow.length}
        </div>
        <div className="row mx-0 my-0">
          <div className="col-12 pb-4 px-0 d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center col-10">
              <div className="contain_Search position-relative col-4 me-3">
                <input
                  onChange={handleSearch}
                  value={dataSearch}
                  className="search rounded-2 px-3"
                  placeholder="Nhập tên danh mục muốn tìm"
                />
                <IoIosSearch className="icon_search translate-middle-y text-secondary" />
              </div>
            </div>
            {/* <AddCategory
              setListCategories={setListCategories}
              listCategories={listCategories}
            /> */}
          </div>
          <div className="contain_Table mx-0 col-12 bg-white rounded-2">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên danh mục</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listCategoriesShow && listCategoriesShow.length > 0 ? (
                  listCategoriesShow.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.tenDanhMuc}</td>
                      <td>{item.isLocked ? "Khóa" : "Hoạt động"}</td>
                      <td>
                        <div className="list_Action">
                          {/* <EditCategory
                            item={item}
                            setListCategories={setListCategories}
                            listCategories={listCategories}
                          />
                          <LockCategory
                            item={item}
                            handleLockCategory={handleLockCategory}
                          /> */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Không có danh mục nào
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