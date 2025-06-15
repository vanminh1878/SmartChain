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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { fetchGet, fetchPut } from "../../../lib/httpHandler";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderDetailsDialog from "./OrderDetailsDialog";

export default function OrderManagement() {
  const [listOrders, setListOrders] = useState([]);
  const [listOrdersShow, setListOrdersShow] = useState({ atStore: [], online: [] });
  const [dataSearch, setDataSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [storeMap, setStoreMap] = useState({});
  const [customerMap, setCustomerMap] = useState({});
  const [startDate, setStartDate] = useState(""); // Thêm state cho startDate
  const [endDate, setEndDate] = useState(""); // Thêm state cho endDate

const fetchStores = useCallback(() => {
  fetchGet(
    "/Stores",
    (res) => {
      setStores(res);
      // Cập nhật storeMap với danh sách cửa hàng
      const newStoreMap = res.reduce((map, store) => {
        map[store.id] = store.name;
        return map;
      }, {});
      setStoreMap(newStoreMap);
    },
    (err) => {
      toast.error(err.message || "Lỗi khi lấy danh sách cửa hàng");
    }
  );
}, []);

 const fetchStoreById = (storeId) => {
  return new Promise((resolve, reject) => {
    fetchGet(
      `/Stores/${storeId}`,
      (res) => {
        console.log("Lấy thông tin cửa hàng thành công, phản hồi từ server:", res);
        const storeData = { id: storeId, name: res.name || "N/A" };
        // Cập nhật storeMap với thông tin cửa hàng mới
        setStoreMap((prev) => ({
          ...prev,
          [storeId]: res.name || "N/A",
        }));
        resolve(storeData);
      },
      (err) => {
        console.error(`Lỗi khi lấy cửa hàng ${storeId}:`, err);
        reject(err.message || "Lỗi khi lấy thông tin cửa hàng");
      },
      () => {
        console.log("Yêu cầu lấy thông tin cửa hàng hoàn tất");
      }
    );
  });
};


  const fetchCustomerById = (customerId) => {
    return new Promise((resolve, reject) => {
      fetchGet(
        `/Customers/${customerId}`,
        (res) => {
          console.log("Lấy thông tin khách hàng thành công, phản hồi từ server:", res);
          const customerData = { id: customerId, fullname: res.fullname || "N/A" };
          resolve(customerData);
        },
        (err) => {
          console.error(`Lỗi khi lấy khách hàng ${customerId}:`, err);
          reject(err.message || "Lỗi khi lấy thông tin khách hàng");
        },
        () => {
          console.log("Yêu cầu lấy thông tin khách hàng hoàn tất");
        }
      );
    });
  };

 const fetchOrders = useCallback(() => {
  fetchGet(
    "/orders",
    async (res) => {
      console.log("Dữ liệu đơn hàng từ BE:", res);
      const storeIds = [...new Set(res.map((order) => order.storeId))];
      const customerIds = [
        ...new Set(res.filter((order) => order.customerId).map((order) => order.customerId)),
      ];

      // Chỉ lấy thông tin cửa hàng chưa có trong storeMap
      const missingStoreIds = storeIds.filter((storeId) => !storeMap[storeId]);
      const storePromises = missingStoreIds.map((storeId) => fetchStoreById(storeId));
      const storeResults = await Promise.all(storePromises);
      const newStoreMap = storeResults.reduce(
        (map, store) => ({ ...map, [store.id]: store.name }),
        { ...storeMap }
      );

      const customerPromises = customerIds.map((customerId) => fetchCustomerById(customerId));
      const customerResults = await Promise.all(customerPromises);
      const newCustomerMap = customerResults.reduce(
        (map, customer) => ({ ...map, [customer.id]: customer.fullname }),
        {}
      );

      setStoreMap(newStoreMap);
      setCustomerMap(newCustomerMap);

      const ordersWithDetails = res.map((order) => ({
        ...order,
        storeName: newStoreMap[order.storeId] || "N/A",
        customerName: order.customerId ? newCustomerMap[order.customerId] || "N/A" : "Khách lẻ",
      }));

      const atStoreOrders = ordersWithDetails.filter((order) => !order.customerId);
      const onlineOrders = ordersWithDetails.filter((order) => order.customerId);

      setListOrders(ordersWithDetails);
      setListOrdersShow({
        atStore: atStoreOrders,
        online: onlineOrders,
      });

      // Áp dụng bộ lọc nếu cần
      applySearchAndFilter(ordersWithDetails, dataSearch, selectedStore, startDate, endDate);
    },
    (err) => {
      toast.error(err.message || "Có lỗi xảy ra khi lấy danh sách đơn hàng");
    },
    () => console.log("Lấy danh sách đơn hàng hoàn tất")
  );
}, [storeMap, dataSearch, selectedStore, startDate, endDate]); // Thêm startDate, endDate vào dependency

  const applySearchAndFilter = useCallback(
    (orders, searchValue, storeId, start, end) => {
      let filteredAtStore = orders.filter((order) => !order.customerId);
      let filteredOnline = orders.filter((order) => order.customerId);

      // Lọc theo cửa hàng
      if (storeId) {
        filteredAtStore = filteredAtStore.filter((order) => order.storeId === storeId);
        filteredOnline = filteredOnline.filter((order) => order.storeId === storeId);
      }

      // Lọc theo từ khóa tìm kiếm
      if (searchValue.trim()) {
        const lowercasedSearch = searchValue.toLowerCase();
        filteredAtStore = filteredAtStore.filter(
          (item) =>
            item.id.toLowerCase().includes(lowercasedSearch) ||
            item.customerName.toLowerCase().includes(lowercasedSearch)
        );
        filteredOnline = filteredOnline.filter(
          (item) =>
            item.id.toLowerCase().includes(lowercasedSearch) ||
            item.customerName.toLowerCase().includes(lowercasedSearch)
        );
      }

      // Lọc theo khoảng thời gian
      if (start) {
        const startDateObj = new Date(start);
        filteredAtStore = filteredAtStore.filter(
          (order) => new Date(order.createdAt) >= startDateObj
        );
        filteredOnline = filteredOnline.filter(
          (order) => new Date(order.createdAt) >= startDateObj
        );
      }
      if (end) {
        const endDateObj = new Date(end);
        endDateObj.setHours(23, 59, 59, 999); // Bao gồm cả ngày cuối
        filteredAtStore = filteredAtStore.filter(
          (order) => new Date(order.createdAt) <= endDateObj
        );
        filteredOnline = filteredOnline.filter(
          (order) => new Date(order.createdAt) <= endDateObj
        );
      }

      setListOrdersShow({ atStore: filteredAtStore, online: filteredOnline });
    },
    []
  );

  const handleSearch = useCallback(
    (e) => {
      const value = e.target.value;
      setDataSearch(value);
      applySearchAndFilter(listOrders, value, selectedStore, startDate, endDate);
    },
    [listOrders, selectedStore, startDate, endDate, applySearchAndFilter]
  );

  const handleStoreChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSelectedStore(value);
      applySearchAndFilter(listOrders, dataSearch, value, startDate, endDate);
    },
    [listOrders, dataSearch, startDate, endDate, applySearchAndFilter]
  );

  const handleStartDateChange = useCallback(
    (e) => {
      const value = e.target.value;
      setStartDate(value);
      applySearchAndFilter(listOrders, dataSearch, selectedStore, value, endDate);
    },
    [listOrders, dataSearch, selectedStore, endDate, applySearchAndFilter]
  );

  const handleEndDateChange = useCallback(
    (e) => {
      const value = e.target.value;
      setEndDate(value);
      applySearchAndFilter(listOrders, dataSearch, selectedStore, startDate, value);
    },
    [listOrders, dataSearch, selectedStore, startDate, applySearchAndFilter]
  );

  const handleViewDetails = useCallback((order) => {
    setOrderDetails(order.orderDetails || []);
    setSelectedOrder(order);
    setIsDialogOpen(true);
  }, []);

  const handleUpdateStatus = useCallback(
    (orderId, newStatus) => {
      fetchPut(
        `/orders/${orderId}/status`,
        { status: newStatus },
        (res) => {
          setListOrders((prev) =>
            prev.map((item) =>
              item.id === orderId
                ? { ...item, status: newStatus, storeName: item.storeName, customerName: item.customerName }
                : item
            )
          );
          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
          toast.success(`Cập nhật trạng thái đơn hàng thành công!`);
          applySearchAndFilter(listOrders, dataSearch, selectedStore, startDate, endDate);
        },
        (err) => {
          toast.error(err.message || "Lỗi khi cập nhật trạng thái đơn hàng");
        },
        () => console.log("Cập nhật trạng thái đơn hàng hoàn tất")
      );
    },
    [listOrders, dataSearch, selectedStore, startDate, endDate, applySearchAndFilter]
  );

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
    setOrderDetails([]);
  }, []);

  useEffect(() => {
    fetchStores();
    fetchOrders();
  }, [fetchStores, fetchOrders]);

  return (
    <>
      <ToastContainer />
      <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Quản lý đơn hàng
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
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
           <Grid item xs={12} sm={2}>
            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel>Cửa hàng</InputLabel>
              <Select value={selectedStore} onChange={handleStoreChange} label="Cửa hàng">
                <MenuItem value="">Tất cả cửa hàng</MenuItem>
                {stores.map((store) => (
                  <MenuItem key={store.id} value={store.id}>
                    {store.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Từ ngày"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Đến ngày"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
         
        </Grid>

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
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.customerName}</TableCell>
                    <TableCell>{item.storeName}</TableCell>
                    <TableCell>{item.totalAmount.toLocaleString()} VNĐ</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
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
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.customerName}</TableCell>
                    <TableCell>{item.storeName}</TableCell>
                    <TableCell>{item.totalAmount.toLocaleString()} VNĐ</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
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

        <OrderDetailsDialog
          isDialogOpen={isDialogOpen}
          selectedOrder={selectedOrder}
          orderDetails={orderDetails}
          handleCloseDialog={handleCloseDialog}
          handleUpdateStatus={handleUpdateStatus}
        />
      </Box>
    </>
  );
}