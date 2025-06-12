import React, { useState, useCallback, useEffect } from "react";
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Search, Close, Add, Remove, Delete } from "@mui/icons-material";
import { fetchGet, fetchPost, fetchDelete, fetchPut } from "../../../lib/httpHandler";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CartManagement() {
  const [cart, setCart] = useState(null); // Giỏ hàng hiện tại
  const [cartDetails, setCartDetails] = useState([]); // Chi tiết giỏ hàng
  const [searchProduct, setSearchProduct] = useState(""); // Tìm kiếm sản phẩm
  const [products, setProducts] = useState([]); // Danh sách sản phẩm tìm kiếm
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog xác nhận đơn hàng
  const [storeId] = useState("YOUR_STORE_ID"); // Thay bằng StoreId từ thông tin đăng nhập
  const [customerId, setCustomerId] = useState(null); // CustomerId (null cho khách lẻ)

  // Lấy chi tiết giỏ hàng
  const fetchCartDetails = useCallback((cartId) => {
    fetchGet(
      `/Carts/${cartId}`,
      (res) => {
        setCart(res);
        setCartDetails(res.cartDetails || []);
      },
      (err) => {
        toast.error(err.detail || "Lỗi khi lấy chi tiết giỏ hàng");
      },
      () => console.log("Lấy chi tiết giỏ hàng hoàn tất")
    );
  }, []);

  // Tìm kiếm sản phẩm
  const handleSearchProduct = useCallback((e) => {
    const value = e.target.value;
    setSearchProduct(value);
    if (value.trim()) {
      fetchGet(
        `/Products?search=${encodeURIComponent(value)}`,
        (res) => {
          setProducts(res.data.items || res.items || []);
        },
        (err) => {
          toast.error(err.detail || "Lỗi khi tìm kiếm sản phẩm");
        },
        () => console.log("Tìm kiếm sản phẩm hoàn tất")
      );
    } else {
      setProducts([]);
    }
  }, []);

  // Thêm sản phẩm vào giỏ hàng
  const handleAddProduct = useCallback(
    (product) => {
      fetchPost(
        `/Carts`,
        {
          CustomerId: customerId,
          StoreId: storeId,
          ProductId: product.id,
          Quantity: 1
        },
        (res) => {
          setCart(res);
          fetchCartDetails(res.id);
          toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
        },
        (err) => {
          toast.error(err.detail || "Lỗi khi thêm sản phẩm");
        },
        () => console.log("Thêm sản phẩm hoàn tất")
      );
    },
    [customerId, storeId, fetchCartDetails]
  );

  // Cập nhật số lượng sản phẩm
  const handleUpdateQuantity = useCallback(
    (detail, newQuantity) => {
      if (newQuantity < 1) {
        handleRemoveProduct(detail.productId);
        return;
      }
      fetchPut(
        `/Carts/${cart?.id}/details`,
        {
          ProductId: detail.productId,
          Quantity: newQuantity
        },
        () => {
          fetchCartDetails(cart.id);
          toast.success("Đã cập nhật số lượng");
        },
        (err) => {
          toast.error(err.detail || "Lỗi khi cập nhật số lượng");
        },
        () => console.log("Cập nhật số lượng hoàn tất")
      );
    },
    [cart, fetchCartDetails]
  );

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveProduct = useCallback(
    (productId) => {
      fetchDelete(
        `/Carts/${cart?.id}/details/${productId}`,
        () => {
          fetchCartDetails(cart.id);
          toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
        },
        (err) => {
          toast.error(err.detail || "Lỗi khi xóa sản phẩm");
        },
        () => console.log("Xóa sản phẩm hoàn tất")
      );
    },
    [cart, fetchCartDetails]
  );

  // Hoàn tất đơn hàng
  const handleCompleteOrder = useCallback(() => {
    if (!cart || cartDetails.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }
    fetchPost(
      "/Orders",
      {
        CustomerId: customerId,
        StoreId: storeId,
        CartId: cart.id,
        OrderDetails: cartDetails.map(detail => ({
          ProductId: detail.productId,
          Quantity: detail.quantity
        }))
      },
      (res) => {
        toast.success("Đơn hàng đã được tạo thành công!");
        setIsDialogOpen(false);
        setCart(null);
        setCartDetails([]);
      },
      (err) => {
        toast.error(err.detail || "Lỗi khi tạo đơn hàng");
      },
      () => console.log("Tạo đơn hàng hoàn tất")
    );
  }, [cart, cartDetails, customerId, storeId]);

  // Mở dialog xác nhận
  const handleOpenDialog = useCallback(() => {
    if (!cart || cartDetails.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }
    setIsDialogOpen(true);
  }, [cart, cartDetails]);

  // Đóng dialog
  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  return (
    <>
      <ToastContainer />
      <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Tính tiền tại quầy
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Tìm kiếm sản phẩm */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tìm sản phẩm (tên hoặc mã)"
              value={searchProduct}
              onChange={handleSearchProduct}
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
          {/* Thông tin khách hàng */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Khách hàng"
              value={cart?.customerId ? "Khách hàng đã chọn" : "Khách lẻ"}
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>
        </Grid>

        {/* Danh sách sản phẩm tìm kiếm */}
        {products.length > 0 && (
          <Box sx={{ mb: 2, maxHeight: 200, overflowY: "auto" }}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell>Giá</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.price.toLocaleString()} VNĐ</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Add />}
                          onClick={() => handleAddProduct(product)}
                        >
                          Thêm
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Giỏ hàng hiện tại */}
        <Typography variant="h6" gutterBottom>
          Giỏ hàng
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Đơn giá</TableCell>
                <TableCell>Thành tiền</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartDetails.length > 0 ? (
                cartDetails.map((detail, index) => (
                  <TableRow key={detail.productId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <img
                        src={detail.image || "https://via.placeholder.com/50"}
                        alt={detail.name || "N/A"}
                        style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
                      />
                    </TableCell>
                    <TableCell>{detail.name || "N/A"}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(detail, detail.quantity - 1)}
                        >
                          <Remove />
                        </IconButton>
                        <Typography sx={{ mx: 2 }}>{detail.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(detail, detail.quantity + 1)}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>{detail.price.toLocaleString()} VNĐ</TableCell>
                    <TableCell>{(detail.quantity * detail.price).toLocaleString()} VNĐ</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleRemoveProduct(detail.productId)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Giỏ hàng trống
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Tổng tiền */}
        <Typography variant="h6" sx={{ mt: 2, textAlign: "right" }}>
          Tổng cộng: {cartDetails.reduce((total, item) => total + item.quantity * item.price, 0).toLocaleString()} VNĐ
        </Typography>

        {/* Nút hoàn tất */}
        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleOpenDialog}
            disabled={cartDetails.length === 0}
          >
            Hoàn tất đơn hàng
          </Button>
        </Box>

        {/* Dialog xác nhận đơn hàng */}
        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 2 } }}
        >
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Xác nhận đơn hàng</Typography>
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography>Bạn có chắc muốn hoàn tất đơn hàng này?</Typography>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Tổng tiền: {cartDetails.reduce((total, item) => total + item.quantity * item.price, 0).toLocaleString()} VNĐ
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseDialog} variant="outlined">
              Hủy
            </Button>
            <Button onClick={handleCompleteOrder} variant="contained">
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}