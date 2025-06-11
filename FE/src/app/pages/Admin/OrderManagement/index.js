import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { fetchGet, fetchPut } from "../../../lib/httpHandler";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OrderManagement() {
  const [listOrders, setListOrders] = useState([]);
  const [listOrdersShow, setListOrdersShow] = useState({ atStore: [], online: [] });
  const [dataSearch, setDataSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Lấy danh sách đơn hàng
  const fetchOrders = useCallback(() => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate.toISOString());
    if (endDate) params.append("endDate", endDate.toISOString());
    const uri = `/api/admin/orders?${params.toString()}`;

    fetchGet(
      uri,
      (res) => {
        console.log("Dữ liệu đơn hàng từ BE:", res);
        const orders = res.data.items;
        setListOrders(orders);
        // Phân loại đơn hàng tại quầy và online
        const atStoreOrders = orders.filter((order) => !order.isOnline);
        const onlineOrders = orders.filter((order) => order.isOnline);
        setListOrdersShow({ atStore: atStoreOrders, online: onlineOrders });
      },
      (err) => {
        toast.error(err.message || "Có lỗi xảy ra khi lấy danh sách đơn hàng");
      },
      () => console.log("Lấy danh sách đơn hàng hoàn tất")
    );
  }, [startDate, endDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Xử lý tìm kiếm
  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setDataSearch(value);
    applySearch(value);
  }, []);

  const applySearch = useCallback(
    (searchValue) => {
      let filteredAtStore = [...listOrders].filter((order) => !order.isOnline);
      let filteredOnline = [...listOrders].filter((order) => order.isOnline);

      if (searchValue.trim()) {
        const lowercasedSearch = searchValue.toLowerCase();
        filteredAtStore = filteredAtStore.filter(
          (item) =>
            item.Id.toLowerCase().includes(lowercasedSearch) ||
            item.Customer?.Fullname?.toLowerCase().includes(lowercasedSearch)
        );
        filteredOnline = filteredOnline.filter(
          (item) =>
            item.Id.toLowerCase().includes(lowercasedSearch) ||
            item.Customer?.Fullname?.toLowerCase().includes(lowercasedSearch)
        );
      }

      setListOrdersShow({ atStore: filteredAtStore, online: filteredOnline });
    },
    [listOrders]
  );

  useEffect(() => {
    applySearch(dataSearch);
  }, [listOrders, dataSearch, applySearch]);

  // Xem chi tiết đơn hàng
  const handleViewDetails = useCallback((order) => {
    fetchGet(
      `/api/admin/orders/${order.Id}/details`,
      (res) => {
        setOrderDetails(res.data.items);
        setSelectedOrder(order);
        setIsDialogOpen(true);
      },
      (err) => {
        toast.error(err.message || "Lỗi khi lấy chi tiết đơn hàng");
      },
      () => console.log("Lấy chi tiết đơn hàng hoàn tất")
    );
  }, []);

  // Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = useCallback(
    (orderId, newStatus) => {
      fetchPut(
        `/api/admin/orders/${orderId}/status`,
        { Status: newStatus },
        (res) => {
          setListOrders((prev) =>
            prev.map((item) =>
              item.Id === orderId ? { ...item, Status: newStatus } : item
            )
          );
          setSelectedOrder((prev) => ({ ...prev, Status: newStatus }));
          toast.success(`Cập nhật trạng thái đơn hàng thành công!`);
          applySearch(dataSearch); // Cập nhật bảng
        },
        (err) => {
          toast.error(err.message || "Lỗi khi cập nhật trạng thái đơn hàng");
        },
        () => console.log("Cập nhật trạng thái đơn hàng hoàn tất")
      );
    },
    [dataSearch, applySearch]
  );

  // Đóng dialog
  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
    setOrderDetails([]);
  }, []);

  return (
    <>
      <ToastContainer />
      <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Quản lý đơn hàng
        </Typography>

        {/* Bộ lọc ngày và tìm kiếm */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Từ ngày"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Đến ngày"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tìm theo mã đơn hàng hoặc tên khách hàng"
              value={dataSearch}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </Grid>
        </Grid>

        {/* Bảng đơn hàng tại quầy */}
        <Typography variant="h6" gutterBottom>
          Đơn hàng tại quầy (Số lượng: {listOrdersShow.atStore.length})
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Mã đơn hàng</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Cửa hàng</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listOrdersShow.atStore.length > 0 ? (
                listOrdersShow.atStore.map((item, index) => (
                  <TableRow key={item.Id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.Id}</TableCell>
                    <TableCell>{item.Customer?.Fullname || "Khách lẻ"}</TableCell>
                    <TableCell>{item.Store?.Name || "N/A"}</TableCell>
                    <TableCell>{item.TotalAmount.toLocaleString()} VNĐ</TableCell>
                    <TableCell>{item.Status}</TableCell>
                    <TableCell>{new Date(item.Created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewDetails(item)}
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Không có đơn hàng tại quầy
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Bảng đơn hàng online */}
        <Typography variant="h6" gutterBottom>
          Đơn hàng online (Số lượng: {listOrdersShow.online.length})
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Mã đơn hàng</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Cửa hàng</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listOrdersShow.online.length > 0 ? (
                listOrdersShow.online.map((item, index) => (
                  <TableRow key={item.Id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.Id}</TableCell>
                    <TableCell>{item.Customer?.Fullname || "Khách lẻ"}</TableCell>
                    <TableCell>{item.Store?.Name || "N/A"}</TableCell>
                    <TableCell>{item.TotalAmount.toLocaleString()} VNĐ</TableCell>
                    <TableCell>{item.Status}</TableCell>
                    <TableCell>{new Date(item.Created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewDetails(item)}
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Không có đơn hàng online
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog chi tiết đơn hàng */}
        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 2 } }}
        >
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Chi tiết đơn hàng {selectedOrder?.Id}</Typography>
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1" gutterBottom>
              Khách hàng: {selectedOrder?.Customer?.Fullname || "Khách lẻ"}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Cửa hàng: {selectedOrder?.Store?.Name || "N/A"}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Trạng thái: {selectedOrder?.Status}
            </Typography>
            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
              <InputLabel>Cập nhật trạng thái</InputLabel>
              <Select
                value={selectedOrder?.Status || ""}
                onChange={(e) => handleUpdateStatus(selectedOrder.Id, e.target.value)}
                label="Cập nhật trạng thái"
              >
                <MenuItem value="Pending">Chờ xử lý</MenuItem>
                <MenuItem value="Confirmed">Đã xác nhận</MenuItem>
                <MenuItem value="Shipped">Đang giao</MenuItem>
                <MenuItem value="Delivered">Đã giao</MenuItem>
                <MenuItem value="Cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Hình ảnh</TableCell>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Đơn giá</TableCell>
                    <TableCell>Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderDetails.length > 0 ? (
                    orderDetails.map((detail, index) => (
                      <TableRow key={detail.Id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <img
                            src={detail.Product?.Image || "https://via.placeholder.com/50"}
                            alt={detail.Product?.Name}
                            style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
                          />
                        </TableCell>
                        <TableCell>{detail.Product?.Name || "N/A"}</TableCell>
                        <TableCell>{detail.Quantity}</TableCell>
                        <TableCell>{detail.Price.toLocaleString()} VNĐ</TableCell>
                        <TableCell>{(detail.Quantity * detail.Price).toLocaleString()} VNĐ</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Không có sản phẩm trong đơn hàng
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6" sx={{ mt: 2, textAlign: "right" }}>
              Tổng cộng: {selectedOrder?.TotalAmount.toLocaleString()} VNĐ
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseDialog} variant="outlined">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}