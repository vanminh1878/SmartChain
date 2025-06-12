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
import DetailEmployee from "../../../components/Admin/EmployeeManagement/DetailEmployee/DetailEmployee.jsx";
import AddEmployee from "../../../components/Admin/EmployeeManagement/AddEmployee/AddEmployee.jsx";

export default function EmployeeManagement() {
  const [listEmployees, setListEmployees] = useState([]);
  const [dataSearch, setDataSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hàm fetch danh sách nhân viên từ backend
  const fetchEmployees = useCallback(() => {
    setIsLoading(true);
    console.log("Bắt đầu fetch danh sách nhân viên...");
    fetchGet(
      "/employees",
      async (res) => {
        const employees = Array.isArray(res) ? res : [];
        console.log("Dữ liệu từ /employees:", employees);
        if (!employees.length && res) {
          toast.error("Dữ liệu từ server không hợp lệ");
        }

        // Gọi các API bổ sung cho mỗi nhân viên
        const validatedEmployees = await Promise.all(
          employees.map(async (item, index) => {
            if (!item.id) {
              console.warn(`Nhân viên tại index ${index} thiếu id:`, item);
              toast.warn(`Nhân viên tại index ${index} thiếu id, sử dụng ID tạm thời`);
            }

            // Gọi API User
            let userData = {};
            if (item.userId) {
              try {
                await fetchGet(
                  `/Users/${item.userId}`,
                  (userRes) => {
                    console.log(`Dữ liệu từ /Users/${item.userId}:`, userRes);
                    userData = userRes;
                  },
                  (fail) => {
                    console.error(`Lỗi khi lấy dữ liệu user ${item.userId}:`, fail);
                    toast.error(`Lỗi khi lấy thông tin user ${item.userId}`);
                  }
                );
              } catch (error) {
                console.error(`Lỗi khi gọi API /Users/${item.userId}:`, error);
              }
            }

            // Gọi API Account
            let accountData = {};
            if (userData.accountId) {
              try {
                await fetchGet(
                  `/Accounts/${userData.accountId}`,
                  (accountRes) => {
                    console.log(`Dữ liệu từ /Accounts/${userData.accountId}:`, accountRes);
                    accountData = accountRes;
                  },
                  (fail) => {
                    console.error(`Lỗi khi lấy dữ liệu account ${userData.accountId}:`, fail);
                    toast.error(`Lỗi khi lấy thông tin account ${userData.accountId}`);
                  }
                );
              } catch (error) {
                console.error(`Lỗi khi gọi API /Accounts/${userData.accountId}:`, error);
              }
            }

            // Gọi API Store
            let storeData = {};
            if (item.storeId) {
              try {
                await fetchGet(
                  `/Stores/${item.storeId}`,
                  (storeRes) => {
                    console.log(`Dữ liệu từ /Stores/${item.storeId}:`, storeRes);
                    storeData = storeRes;
                  },
                  (fail) => {
                    console.error(`Lỗi khi lấy dữ liệu store ${item.storeId}:`, fail);
                    toast.error(`Lỗi khi lấy thông tin store ${item.storeId}`);
                  }
                );
              } catch (error) {
                console.error(`Lỗi khi gọi API /Stores/${item.storeId}:`, error);
              }
            }

            return {
              ...item,
              id: item.id || `temp-${Date.now()}-${index}`,
              fullname: userData.fullname || "Không có tên",
              birthday: userData.birthday
                ? new Date(userData.birthday).toLocaleDateString("vi-VN")
                : "Không có",
              phoneNumber: userData.phoneNumber || "Không có",
              sex: userData.sex !== undefined ? (userData.sex === true ? "Nam" : "Nữ") : "Không có",
              storeName: storeData.name || "Không có",
              status:
                accountData.status !== undefined
                  ? accountData.status === true
                    ? "Active"
                    : "Locked"
                  : "Không có",
            };
          })
        );

        console.log("Danh sách nhân viên đã xử lý:", validatedEmployees);
        setListEmployees(validatedEmployees);
        setIsLoading(false);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách nhân viên:", fail);
        toast.error(fail.message || "Lỗi khi lấy danh sách nhân viên");
        setListEmployees([]);
        setIsLoading(false);
      },
      () => {
        console.log("Yêu cầu fetch danh sách nhân viên hoàn tất");
      }
    );
  }, []);

  // Fetch danh sách khi component mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Optimize search with useMemo
  const filteredEmployees = useMemo(() => {
    if (!Array.isArray(listEmployees)) {
      console.error("listEmployees không phải mảng:", listEmployees);
      return [];
    }
    console.log("Danh sách hiển thị trước khi lọc:", listEmployees);
    if (!dataSearch.trim()) return listEmployees;
    const lowercasedSearch = dataSearch.toLowerCase();
    const filtered = listEmployees.filter((item) =>
      item.fullname?.toLowerCase()?.includes(lowercasedSearch)
    );
    console.log("Danh sách hiển thị sau khi lọc:", filtered);
    return filtered;
  }, [listEmployees, dataSearch]);

  // Handle search input
  const handleSearch = useCallback((e) => {
    console.log("Tìm kiếm với giá trị:", e.target.value);
    setDataSearch(e.target.value);
  }, []);

  // Handle lock/unlock employee
  const handleLockEmployee = useCallback(async (employeeId, isActive) => {
    console.log(`Bắt đầu ${isActive ? "khóa" : "mở khóa"} nhân viên với ID:`, employeeId);
    if (!employeeId) {
      console.error("ID nhân viên không tồn tại");
      toast.error("ID nhân viên không tồn tại. Không thể thực hiện.");
      return;
    }
    if (employeeId.startsWith("temp-")) {
      console.error("ID nhân viên tạm thời:", employeeId);
      toast.error("Nhân viên này chưa được lưu trên server. Vui lòng làm mới trang.");
      return;
    }
    const action = isActive ? "khóa" : "mở khóa";
    const confirmAction = await showYesNoMessageBox(`Bạn có muốn ${action} nhân viên này không?`);
    if (!confirmAction) {
      console.log(`Hủy ${action} nhân viên`);
      return;
    }
    fetchPut(
      `/employees/lock/${employeeId}`,
      { status: !isActive },
      (response) => {
        console.log(`${action} nhân viên thành công, phản hồi từ server:`, response);
        toast.success(`Nhân viên đã được ${action} thành công!`);
        setListEmployees((prev) => {
          console.log("Danh sách trước khi cập nhật:", prev);
          const updatedList = prev.map((item) =>
            item.id === employeeId ? { ...item, status: isActive ? "Locked" : "Active" } : item
          );
          console.log("Danh sách sau khi cập nhật:", updatedList);
          return updatedList;
        });
      },
      (fail) => {
        console.error("Phản hồi lỗi từ server:", fail);
        toast.error(fail.message || fail.title || `Lỗi khi ${action} nhân viên`);
      },
      () => {
        console.log(`Yêu cầu ${action} nhân viên hoàn tất`);
      }
    );
  }, []);

  // Định nghĩa cột cho DataGrid
  const columns = [
    // {
    //   field: "stt",
    //   headerName: "STT",
    //   width: 70,
    //   valueGetter: (params) => params.getRowIndex(params.id) + 1,
    // },
    { field: "fullname", headerName: "Họ tên", width: 200 },
    { field: "birthday", headerName: "Ngày sinh", width: 120 },
    { field: "phoneNumber", headerName: "Số điện thoại", width: 150 },
    { field: "sex", headerName: "Giới tính", width: 100 },
    { field: "storeName", headerName: "Cửa hàng", width: 150 },
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
          <DetailEmployee item={params.row} setListEmployees={setListEmployees} />
          <IconButton
            onClick={() => handleLockEmployee(params.row.id, params.row.status === "Active")}
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
        Quản lý nhân viên
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          placeholder="Tìm kiếm theo tên nhân viên"
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
        <AddEmployee setListEmployees={setListEmployees} />
      </Box>
      {isLoading ? (
        <Typography>Đang tải dữ liệu nhân viên...</Typography>
      ) : (
        <DataGrid
          sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
          rows={filteredEmployees}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          localeText={{
            noRowsLabel: "Không có nhân viên nào",
          }}
        />
      )}
    </Box>
  );
}