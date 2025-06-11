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
import { fetchGet, fetchPost, fetchDelete } from "../../../lib/httpHandler";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CartManagement() {
  const [cart, setCart] = useState(null); // Giỏ hàng hiện tại
  const [cartDetails, setCartDetails] = useState([]); // Chi tiết giỏ hàng
  const [searchProduct, setSearchProduct] = useState(""); // Tìm kiếm sản phẩm
  const [products, setProducts] = useState([]); // Danh sách sản phẩm tìm kiếm
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog xác nhận đơn hàng
  const [storeId] = useState("YOUR_STORE_ID"); // Thay bằng Store_id từ thông tin đăng nhập
  const [customerId, setCustomerId] = useState(null); // Customer_id (null cho khách lẻ)

  // Khởi tạo giỏ hàng mới khi tải trang
  const initializeCart = useCallback(() => {
    fetchPost(
      "/api/admin/carts",
      { Store_id: storeId, Customer_id: customerId },
      (res) => {
        setCart(res.data);
        fetchCartDetails(res.data.Id);
      },
      (err) => {
        toast.error(err.message || "Lỗi khi tạo giỏ hàng");
      },
      () => console.log("Tạo giỏ hàng hoàn tất")
    );
  }, [storeId, customerId]);

  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  // Lấy chi tiết giỏ hàng
  const fetchCartDetails = useCallback((cartId) => {
    fetchGet(
      `/api/admin/carts/${cartId}/details`,
      (res) => {
        setCartDetails(res.data.items);
      },
      (err) => {
        toast.error(err.message || "Lỗi khi lấy chi tiết giỏ hàng");
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
        `/api/products?search=${encodeURIComponent(value)}`,
        (res) => {
          setProducts(res.data.items);
        },
        (err) => {
          toast.error(err.message || "Lỗi khi tìm kiếm sản phẩm");
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
      if (!cart) {
        toast.error("Giỏ hàng chưa được tạo!");
        return;
      }
      fetchPost(
        `/api/admin/cart-details`,
        {
          CartId: cart.Id,
          Product_id: product.Id,
          Quantity: 1,
          Price: product.Price,
        },
        () => {
          fetchCartDetails(cart.Id);
          toast.success(`Đã thêm ${product.Name} vào giỏ hàng`);
        },
        (err) => {
          toast.error(err.message || "Lỗi khi thêm sản phẩm");
        },
        () => console.log("Thêm sản phẩm hoàn tất")
      );
    },
    [cart, fetchCartDetails]
  );

  // Cập nhật số lượng sản phẩm
  const handleUpdateQuantity = useCallback(
    (detail, newQuantity) => {
      if (newQuantity < 1) {
        handleRemoveProduct(detail.Id);
        return;
      }
      fetchPost(
        `/api/admin/cart-details/${detail.Id}`,
        { Quantity: newQuantity },
        () => {
          fetchCartDetails(cart.Id);
        },
        (err) => {
          toast.error(err.message || "Lỗi khi cập nhật số lượng");
        },
        () => console.log("Cập nhật số lượng hoàn tất")
      );
    },
    [cart, fetchCartDetails]
  );

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveProduct = useCallback(
    (detailId) => {
      fetchDelete(
        `/api/admin/cart-details/${detailId}`,
        () => {
          fetchCartDetails(cart.Id);
          toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
        },
        (err) => {
          toast.error(err.message || "Lỗi khi xóa sản phẩm");
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
    const orderData = {
      Customer_id: customerId,
      Store_id: storeId,
      TotalAmount: cartDetails.reduce((total, item) => total + item.Quantity * item.Price, 0),
      Status: "Pending",
    };

    fetchPost(
      "/api/admin/orders",
      orderData,
      async (res) => {
        const orderId = res.id;
        const orderDetails = cartDetails.map((detail) => ({
          OrderId: orderId,
          Product_id: detail.Product_id,
          Quantity: detail.Quantity,
          Price: detail.Price,
        }));

        await fetchPost(
          "/api/admin/order-details/bulk",
          orderDetails,
          () => {
            toast.success("Đơn hàng đã được tạo thành công!");
            setIsDialogOpen(false);
            initializeCart(); // Reset giỏ hàng
          },
          (err) => {
            toast.error(err.message || "Lỗi khi tạo chi tiết đơn hàng");
          }
        );
      },
      (err) => {
        toast.error(err.message || "Lỗi khi tạo đơn hàng");
      },
      () => console.log("Tạo đơn hàng hoàn tất")
    );
  }, [cart, cartDetails, customerId, storeId, initializeCart]);

  // Mở dialog xác nhận
  const handleOpenDialog = useCallback(() => {
    if (cartDetails.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }
    setIsDialogOpen(true);
  }, [cartDetails]);

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
              value={cart?.Customer?.Fullname || "Khách lẻ"}
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
                    <TableRow key={product.Id}>
                      <TableCell>{product.Name}</TableCell>
                      <TableCell>{product.Price.toLocaleString()} VNĐ</TableCell>
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
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(detail, detail.Quantity - 1)}
                        >
                          <Remove />
                        </IconButton>
                        <Typography sx={{ mx: 2 }}>{detail.Quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(detail, detail.Quantity + 1)}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>{detail.Price.toLocaleString()} VNĐ</TableCell>
                    <TableCell>{(detail.Quantity * detail.Price).toLocaleString()} VNĐ</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleRemoveProduct(detail.Id)}>
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
          Tổng cộng: {cartDetails.reduce((total, item) => total + item.Quantity * item.Price, 0).toLocaleString()} VNĐ
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
              Tổng tiền: {cartDetails.reduce((total, item) => total + item.Quantity * item.Price, 0).toLocaleString()} VNĐ
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