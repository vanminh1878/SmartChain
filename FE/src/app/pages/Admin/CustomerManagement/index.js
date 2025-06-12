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
import { showYesNoMessageBox } from "../../../components/MessageBox/YesNoMessageBox/showYesNoMessgeBox.js";
import DetailCustomer from "../../../components/Admin/CustomerManagement/DetailCustomer/DetailCustomer.jsx";


export default function CustomerManagement() {
  const [listCustomers, setListCustomers] = useState([]);
  const [dataSearch, setDataSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hàm fetch danh sách khách hàng từ backend
  const fetchCustomers = useCallback(() => {
    setIsLoading(true);
    console.log("Bắt đầu fetch danh sách khách hàng...");
    fetchGet(
      "/customers",
      async (res) => {
        const customers = Array.isArray(res) ? res : [];
        console.log("Dữ liệu từ /customers:", customers);
        if (!customers.length && res) {
          toast.error("Dữ liệu từ server không hợp lệ");
        }

        // Xử lý danh sách khách hàng
        const validatedCustomers = customers.map((item, index) => {
          if (!item.id) {
            console.warn(`Khách hàng tại index ${index} thiếu id:`, item);
            toast.warn(`Khách hàng tại index ${index} thiếu id, sử dụng ID tạm thời`);
          }

          return {
            ...item,
            id: item.id || `temp-${Date.now()}-${index}`,
            fullname: item.fullname || "Không có tên",
            birthday: item.birthday
              ? new Date(item.birthday).toLocaleDateString("vi-VN")
              : "Không có",
            phoneNumber: item.phoneNumber || "Không có",
            email: item.email || "Không có",
            address: item.address || "Không có",
            status:
              item.status !== undefined
                ? item.status === true
                  ? "Active"
                  : "Locked"
                : "Không có",
          };
        });

        console.log("Danh sách khách hàng đã xử lý:", validatedCustomers);
        setListCustomers(validatedCustomers);
        setIsLoading(false);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách khách hàng:", fail);
        toast.error(fail.message || "Lỗi khi lấy danh sách khách hàng");
        setListCustomers([]);
        setIsLoading(false);
      },
      () => {
        console.log("Yêu cầu fetch danh sách khách hàng hoàn tất");
      }
    );
  }, []);

  // Fetch danh sách khi component mount
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Optimize search with useMemo
  const filteredCustomers = useMemo(() => {
    if (!Array.isArray(listCustomers)) {
      console.error("listCustomers không phải mảng:", listCustomers);
      return [];
    }
    console.log("Danh sách hiển thị trước khi lọc:", listCustomers);
    if (!dataSearch.trim()) return listCustomers;
    const lowercasedSearch = dataSearch.toLowerCase();
    const filtered = listCustomers.filter((item) =>
      item.fullname?.toLowerCase()?.includes(lowercasedSearch)
    );
    console.log("Danh sách hiển thị sau khi lọc:", filtered);
    return filtered;
  }, [listCustomers, dataSearch]);

  // Handle search input
  const handleSearch = useCallback((e) => {
    console.log("Tìm kiếm với giá trị:", e.target.value);
    setDataSearch(e.target.value);
  }, []);

  // Handle lock/unlock customer
  const handleLockCustomer = useCallback(async (customerId, isActive) => {
    console.log(`Bắt đầu ${isActive ? "khóa" : "mở khóa"} khách hàng với ID:`, customerId);
    if (!customerId) {
      console.error("ID khách hàng không tồn tại");
      toast.error("ID khách hàng không tồn tại. Không thể thực hiện.");
      return;
    }
    if (customerId.startsWith("temp-")) {
      console.error("ID khách hàng tạm thời:", customerId);
      toast.error("Khách hàng này chưa được lưu trên server. Vui lòng làm mới trang.");
      return;
    }
    const action = isActive ? "khóa" : "mở khóa";
    const confirmAction = await showYesNoMessageBox(`Bạn có muốn ${action} khách hàng này không?`);
    if (!confirmAction) {
      console.log(`Hủy ${action} khách hàng`);
      return;
    }
    fetchPut(
      `/customers/lock/${customerId}`,
      { status: !isActive },
      (response) => {
        console.log(`${action} khách hàng thành công, phản hồi từ server:`, response);
        toast.success(`Khách hàng đã được ${action} thành công!`);
        setListCustomers((prev) => {
          console.log("Danh sách trước khi cập nhật:", prev);
          const updatedList = prev.map((item) =>
            item.id === customerId ? { ...item, status: isActive ? "Locked" : "Active" } : item
          );
          console.log("Danh sách sau khi cập nhật:", updatedList);
          return updatedList;
        });
      },
      (fail) => {
        console.error("Phản hồi lỗi từ server:", fail);
        toast.error(fail.message || fail.title || `Lỗi khi ${action} khách hàng`);
      },
      () => {
        console.log(`Yêu cầu ${action} khách hàng hoàn tất`);
      }
    );
  }, []);

  // Định nghĩa cột cho DataGrid
  const columns = [
    { field: "fullname", headerName: "Họ tên", width: 200 },
    
    { field: "phoneNumber", headerName: "Số điện thoại", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "address", headerName: "Địa chỉ", width: 250 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 120,
      renderCell: (params) => (params.value === "Active" ? "Hoạt động" : "Khóa"),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 150,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <DetailCustomer item={params.row} setListCustomers={setListCustomers} />
          <IconButton
            onClick={() => handleLockCustomer(params.row.id, params.row.status === "Active")}
            title={params.row.status === "Active" ? "Khóa" : "Mở khóa"}
            color={params.row.status === "Active" ? "warning" : "success"}
          >
            {params.row.status === "Active" ? <LockIcon /> : <LockOpenIcon />}
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Typography variant="h5" sx={{ mb: 2 }}>
        Quản lý khách hàng
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          placeholder="Tìm kiếm theo tên khách hàng"
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
      </Box>
      {isLoading ? (
        <Typography>Đang tải dữ liệu khách hàng...</Typography>
      ) : (
        <DataGrid
          sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
          rows={filteredCustomers}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          localeText={{
            noRowsLabel: "Không có khách hàng nào",
          }}
        />
      )}
    </Box>
  );
}