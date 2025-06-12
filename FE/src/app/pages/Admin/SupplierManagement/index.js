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
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchGet, fetchDelete } from "../../../lib/httpHandler";
import { showYesNoMessageBox } from "../../../components/MessageBox/YesNoMessageBox/showYesNoMessgeBox.js";
import AddSupplier from "../../../components/Admin/SupplierManagement/AddSupplier/AddSupplier.jsx";
import EditSupplier from "../../../components/Admin/SupplierManagement/DetailSupplier/DetailSupplier.jsx";

export default function SupplierManagement() {
  const [listSuppliers, setListSuppliers] = useState([]);
  const [dataSearch, setDataSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hàm fetch danh sách nhà cung cấp từ backend
  const fetchSuppliers = useCallback(() => {
    setIsLoading(true);
    console.log("Bắt đầu fetch danh sách nhà cung cấp...");
    fetchGet(
      "/suppliers",
      (sus) => {
        const suppliers = Array.isArray(sus) ? sus : [];
        console.log("Dữ liệu từ server:", suppliers);
        if (!suppliers.length && sus) {
          toast.error("Dữ liệu từ server không hợp lệ");
        }
        const validatedSuppliers = suppliers.map((item, index) => {
          if (!item.id) {
            console.warn(`Nhà cung cấp tại index ${index} thiếu id:`, item);
            toast.warn(`Nhà cung cấp tại index ${index} thiếu id, sử dụng ID tạm thời`);
          }
          return {
            ...item,
            id: item.id || `temp-${Date.now()}-${index}`,
            name: item.name || item.tenNhaCungCap || "Không có tên",
            contactName: item.contact_Name || item.contact_Name || "Không có",
            phoneNumber: item.phoneNumber || item.phone_number || "Không có",
            email: item.email || "Không có",
            address: item.address || "Không có",
            isLocked: item.isLocked || false,
          };
        });
        console.log("Danh sách nhà cung cấp đã xử lý:", validatedSuppliers);
        setListSuppliers(validatedSuppliers);
        setIsLoading(false);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách nhà cung cấp:", fail);
        toast.error(fail.message || "Lỗi khi lấy danh sách nhà cung cấp");
        setListSuppliers([]);
        setIsLoading(false);
      },
      () => {
        console.log("Yêu cầu fetch danh sách nhà cung cấp hoàn tất");
      }
    );
  }, []);

  // Fetch danh sách khi component mount
  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // Optimize search with useMemo
  const listSuppliersShow = useMemo(() => {
    if (!Array.isArray(listSuppliers)) {
      console.error("listSuppliers không phải mảng:", listSuppliers);
      return [];
    }
    console.log("Danh sách hiển thị trước khi lọc:", listSuppliers);
    if (!dataSearch.trim()) return listSuppliers;
    const lowercasedSearch = dataSearch.toLowerCase();
    const filtered = listSuppliers.filter((item) =>
      item.name?.toLowerCase()?.includes(lowercasedSearch)
    );
    console.log("Danh sách hiển thị sau khi lọc:", filtered);
    return filtered;
  }, [listSuppliers, dataSearch]);

  // Handle search input
  const handleSearch = useCallback((e) => {
    console.log("Tìm kiếm với giá trị:", e.target.value);
    setDataSearch(e.target.value);
  }, []);

  // Handle delete supplier
  const handleDeleteSupplier = useCallback(async (supplierId) => {
    console.log("Bắt đầu xóa nhà cung cấp với ID:", supplierId);
    if (!supplierId) {
      console.error("ID nhà cung cấp không tồn tại");
      toast.error("ID nhà cung cấp không tồn tại. Không thể xóa.");
      return;
    }
    if (supplierId.startsWith("temp-")) {
      console.error("ID nhà cung cấp tạm thời:", supplierId);
      toast.error("Nhà cung cấp này chưa được lưu trên server. Vui lòng làm mới trang.");
      return;
    }
    const confirmDelete = await showYesNoMessageBox("Bạn có muốn xóa nhà cung cấp này không?");
    if (!confirmDelete) {
      console.log("Hủy xóa nhà cung cấp");
      return;
    }
    fetchDelete(
      `/suppliers/${supplierId}`,
      (response) => {
        console.log("Xóa nhà cung cấp thành công, phản hồi từ server:", response);
        toast.success("Xóa nhà cung cấp thành công!");
        setListSuppliers((prev) => {
          console.log("Danh sách trước khi lọc:", prev);
          const updatedList = prev.filter((item) => item.id !== supplierId);
          console.log("Danh sách sau khi lọc:", updatedList);
          return updatedList;
        });
      },
      (fail) => {
        console.error("Phản hồi lỗi từ server:", fail);
        if (fail.message === "Xóa thành công") {
          console.log("Server báo thành công trong errorCallback, cập nhật danh sách cục bộ");
          toast.success("Xóa nhà cung cấp thành công!");
          setListSuppliers((prev) => {
            console.log("Danh sách trước khi lọc:", prev);
            const updatedList = prev.filter((item) => item.id !== supplierId);
            console.log("Danh sách sau khi lọc:", updatedList);
            return updatedList;
          });
        } else {
          toast.error(fail.message || "Lỗi khi xóa nhà cung cấp");
        }
      },
      () => {
        console.log("Yêu cầu xóa nhà cung cấp hoàn tất");
      }
    );
  }, []);

  // Định nghĩa cột cho DataGrid
  const columns = [
    { field: "name", headerName: "Tên nhà cung cấp", width: 200 },
    { field: "contactName", headerName: "Người liên hệ", width: 150 },
    { field: "phoneNumber", headerName: "Số điện thoại", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "address", headerName: "Địa chỉ", width: 250 },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 150,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <EditSupplier item={params.row} fetchSuppliers={fetchSuppliers} />
          <IconButton
            onClick={() => handleDeleteSupplier(params.row.id)}
            title="Xóa nhà cung cấp"
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Typography variant="h5" sx={{ mb: 2 }}>
        Quản lý nhà cung cấp
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          placeholder="Tìm kiếm theo tên nhà cung cấp"
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
        <AddSupplier fetchSuppliers={fetchSuppliers} />
      </Box>
      {isLoading ? (
        <Typography>Đang tải dữ liệu nhà cung cấp...</Typography>
      ) : (
        <DataGrid
          sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
          rows={listSuppliersShow}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          localeText={{
            noRowsLabel: "Không có nhà cung cấp nào",
          }}
        />
      )}
    </Box>
  );
}