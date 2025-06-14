import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { fetchGet } from "../../../lib/httpHandler";

const OrderDetailsDialog = ({
  isDialogOpen,
  selectedOrder,
  handleCloseDialog,
  handleUpdateStatus,
}) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [productNames, setProductNames] = useState({});
 

  // Gọi API để lấy chi tiết đơn hàng và tên sản phẩm
  useEffect(() => {
    if (isDialogOpen && selectedOrder?.id) {
      // Gọi API lấy chi tiết đơn hàng
      fetchGet(
        `/Orders/details/${selectedOrder.id}`,
        async (res) => {
          console.log("Lấy chi tiết đơn hàng thành công:", res);
          setOrderDetails(res || []);

          // Lấy danh sách productId duy nhất
          const productIds = [...new Set(res.map((detail) => detail.productId))];

          // Gọi API để lấy tên sản phẩm
          const productPromises = productIds.map((productId) =>
            new Promise((resolve, reject) => {
              fetchGet(
                `/Products/${productId}`,
                (productRes) => {
                  console.log(`Lấy thông tin sản phẩm ${productId} thành công:`, productRes);
                  resolve({ id: productId, name: productRes.name || "N/A" });
                },
                (err) => {
                  console.error(`Lỗi khi lấy sản phẩm ${productId}:`, err);
                  resolve({ id: productId, name: "N/A" });
                },
                () => console.log(`Yêu cầu lấy thông tin sản phẩm ${productId} hoàn tất`)
              );
            })
          );

          try {
            const productResults = await Promise.all(productPromises);
            const newProductMap = productResults.reduce(
              (map, product) => ({ ...map, [product.id]: product.name }),
              {}
            );
            setProductNames(newProductMap);
          } catch (err) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", err);
            setProductNames({});
          }
        },
        (err) => {
          console.error(`Lỗi khi lấy chi tiết đơn hàng ${selectedOrder.id}:`, err);
          setOrderDetails([]);
        },
        () => console.log(`Yêu cầu lấy chi tiết đơn hàng ${selectedOrder.id} hoàn tất`)
      );
    }
  }, [isDialogOpen, selectedOrder?.id]);

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Chi tiết đơn hàng {selectedOrder?.id}</Typography>
        <IconButton onClick={handleCloseDialog}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Khách hàng: {selectedOrder?.customerName}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Cửa hàng: {selectedOrder?.storeName}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Trạng thái: {selectedOrder?.status}
        </Typography>
        {selectedOrder?.customerId && (
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Cập nhật trạng thái</InputLabel>
            <Select
              value={selectedOrder?.status || ""}
              onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
              label="Cập nhật trạng thái"
            >
              <MenuItem value="Pending">Chờ xử lý</MenuItem>
              <MenuItem value="Confirmed">Đã xác nhận</MenuItem>
              <MenuItem value="Shipped">Đang giao</MenuItem>
              <MenuItem value="Delivered">Đã giao</MenuItem>
              <MenuItem value="Cancelled">Đã hủy</MenuItem>
            </Select>
          </FormControl>
        )}
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Đơn giá</TableCell>
                <TableCell>Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetails.length > 0 ? (
                orderDetails.map((detail, index) => (
                  <TableRow key={detail.ProductId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{productNames[detail.productId] || "N/A"}</TableCell>
                    <TableCell>{detail.quantity}</TableCell>
                    <TableCell>{detail.price.toLocaleString()} VNĐ</TableCell>
                    <TableCell>{(detail.quantity * detail.price).toLocaleString()} VNĐ</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không có sản phẩm trong đơn hàng
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h6" sx={{ mt: 2, textAlign: "right" }}>
          Tổng cộng: {selectedOrder?.totalAmount.toLocaleString()} VNĐ
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleCloseDialog} variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;