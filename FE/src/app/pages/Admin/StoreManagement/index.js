import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AddIcon from "@mui/icons-material/Add";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchGet, fetchPut } from "../../../lib/httpHandler";
import DetailStore from "../../../components/Admin/StoreManagement/DetailStore/DetailStore.jsx";
import AddStore from "../../../components/Admin/StoreManagement/AddStore/AddStore.jsx";
import { showYesNoMessageBox } from "../../../components/MessageBox/YesNoMessageBox/showYesNoMessgeBox.js";

export default function StoreManagement() {
  const [listStores, setListStores] = useState([]);
  const [dataSearch, setDataSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch store list
  const fetchStores = useCallback(() => {
    setIsLoading(true);
    console.log("Bắt đầu fetch danh sách cửa hàng...");
    fetchGet(
      "/stores",
      (sus) => {
        const stores = Array.isArray(sus) ? sus : [];
        console.log("Dữ liệu từ server:", stores);
        if (!stores.length && sus) {
          toast.error("Dữ liệu từ server không hợp lệ");
        }
        const validatedStores = stores.map((item, index) => ({
          ...item,
          id: item.id || `temp-${Date.now()}-${index}`,
          name: item.name || "Không có tên",
          address: item.address || "Không có địa chỉ",
          phoneNumber: item.phoneNumber || "Không có số điện thoại",
          email: item.email || "Không có email",
          status: item.status !== undefined ? item.status : false,
        }));
        console.log("Danh sách cửa hàng đã xử lý:", validatedStores);
        setListStores(validatedStores);
        setIsLoading(false);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách cửa hàng:", fail);
        toast.error(fail.message || "Lỗi khi lấy danh sách cửa hàng");
        setListStores([]);
        setIsLoading(false);
      },
      () => {
        console.log("Yêu cầu fetch danh sách cửa hàng hoàn tất");
      }
    );
  }, []);

  // Fetch danh sách khi component mount
  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // Optimize search with useMemo
  const listStoresShow = useMemo(() => {
    if (!Array.isArray(listStores)) {
      console.error("listStores không phải mảng:", listStores);
      return [];
    }
    console.log("Danh sách hiển thị trước khi lọc:", listStores);
    if (!dataSearch.trim()) return listStores;
    const lowercasedSearch = dataSearch.toLowerCase();
    const filtered = listStores.filter((item) =>
      item.name?.toLowerCase()?.includes(lowercasedSearch)
    );
    console.log("Danh sách hiển thị sau khi lọc:", filtered);
    return filtered;
  }, [listStores, dataSearch]);

  // Handle search input
  const handleSearch = useCallback((e) => {
    console.log("Tìm kiếm với giá trị:", e.target.value);
    setDataSearch(e.target.value);
  }, []);

  // Handle lock/unlock store
  const handleLockStore = useCallback(async (storeId, status) => {
    console.log(`Bắt đầu ${status ? "khóa" : "mở khóa"} cửa hàng với ID:`, storeId);
    if (!storeId) {
      console.error("ID cửa hàng không tồn tại");
      toast.error("ID cửa hàng không tồn tại. Không thể thực hiện.");
      return;
    }
    if (storeId.startsWith("temp-")) {
      console.error("ID cửa hàng tạm thời:", storeId);
      toast.error("Cửa hàng này chưa được lưu trên server. Vui lòng làm mới trang.");
      return;
    }
    const action = status ? "khóa" : "mở khóa";
    const confirmAction = await showYesNoMessageBox(`Bạn có muốn ${action} cửa hàng này không?`);
    if (!confirmAction) {
      console.log(`Hủy ${action} cửa hàng`);
      return;
    }
    fetchPut(
      `/stores/lock/${storeId}`,
      { status: !status },
      (sus) => {
        console.log(`${action} cửa hàng thành công, phản hồi từ server:`, sus);
        setListStores((prev) =>
          prev.map((item) =>
            item.id === storeId ? { ...item, status: !status } : item
          )
        );
        toast.success(`Cửa hàng đã được ${status ? "khóa" : "mở khóa"} thành công!`);
      },
      (fail) => {
        console.error("Phản hồi lỗi từ server:", fail);
        toast.error(fail.message || `Lỗi khi ${action} cửa hàng`);
      },
      () => {
        console.log(`Yêu cầu ${action} cửa hàng hoàn tất`);
      }
    );
  }, []);

  // Định nghĩa cột cho DataGrid
  const columns = [
    { field: "name", headerName: "Tên cửa hàng", width: 200 },
    { field: "address", headerName: "Địa chỉ", width: 250 },
    { field: "phoneNumber", headerName: "Số điện thoại", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 120,
      renderCell: (params) => (params.value ? "Hoạt động" : "Khóa"),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 150,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <DetailStore item={params.row} setListStores={setListStores} />
          <IconButton
            onClick={() => handleLockStore(params.row.id, params.row.status)}
            title={params.row.status ? "Khóa" : "Mở khóa"}
            color={params.row.status ? "warning" : "success"}
          >
            {params.row.status ? <LockIcon /> : <LockOpenIcon />}
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Typography variant="h5" sx={{ mb: 2 }}>
        Quản lý cửa hàng
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          placeholder="Tìm kiếm theo tên cửa hàng"
          value={dataSearch}
          onChange={handleSearch}
          sx={{ width: "40%", backgroundColor: "white" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <AddStore setListStores={setListStores} />
      </Box>
      {isLoading ? (
        <Typography>Đang tải dữ liệu cửa hàng...</Typography>
      ) : (
        <DataGrid
          sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
          rows={listStoresShow}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          localeText={{
            noRowsLabel: "Không có cửa hàng nào",
          }}
        />
      )}
    </Box>
  );
}