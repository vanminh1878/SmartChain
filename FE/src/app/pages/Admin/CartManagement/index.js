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
  const [cart, setCart] = useState(null);
  const [cartDetails, setCartDetails] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [storeId, setStoreId] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [tempQuantities, setTempQuantities] = useState({});

  // Lấy chi tiết giỏ hàng
  const fetchCartDetails = useCallback((cartId) => {
    const fetchGetPromise = (uri) =>
      new Promise((resolve, reject) => {
        fetchGet(
          uri,
          (res) => resolve(res),
          (err) => reject(err),
          () => console.log(`Hoàn tất gọi API: ${uri}`)
        );
      });

    fetchGet(
      `/Carts/${cartId}`,
      async (res) => {
        const cartDetails = res.cartDetails || [];
        const updatedCartDetails = await Promise.all(
          cartDetails.map(async (detail) => {
            try {
              const productRes = await fetchGetPromise(`/Products/${detail.productId}`);
              console.log("Tải thông tin sản phẩm:", productRes);
              return {
                ...detail,
                name: productRes.name || "N/A",
                image: productRes.image || "https://via.placeholder.com/50",
              };
            } catch (err) {
              console.error(`Lỗi khi lấy sản phẩm ${detail.productId}:`, err.message);
              return {
                ...detail,
                name: "N/A",
                image: "https://via.placeholder.com/50",
              };
            }
          })
        );
        setCart(res);
        setCartDetails(updatedCartDetails);
        setTempQuantities({});
        console.log("Cart detail:", updatedCartDetails);
      },
      (err) => {
        toast.error(err.title || "Lỗi khi lấy chi tiết giỏ hàng");
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
          setProducts(res.items || []);
        },
        (err) => {
          toast.error(err.title || "Lỗi khi tìm kiếm sản phẩm");
        },
        () => console.log("Tìm kiếm sản phẩm hoàn tất")
      );
    } else {
      setProducts([]);
    }
  }, []);

  // Lấy thông tin cá nhân
  useEffect(() => {
    fetchGet(
      "/users/profile",
      (sus) => {
        console.log("Dữ liệu người dùng:", sus);
        setStoreId(sus.storeId);
      },
      (fail) => {
        toast.error(fail.message || "Không thể tải thông tin cá nhân");
      },
      () => {
        console.log("Hoàn tất lấy thông tin cá nhân");
      }
    );
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
          Quantity: 1,
        },
        (res) => {
          setCart(res);
          fetchCartDetails(res.id);
          toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
        },
        (err) => {
          toast.error(err.title || "Lỗi khi thêm sản phẩm");
        },
        () => console.log("Thêm sản phẩm hoàn tất")
      );
    },
    [customerId, storeId, fetchCartDetails]
  );

  // Cập nhật số lượng sản phẩm (tăng/giảm tương đối)
  const handleUpdateQuantity = useCallback(
    (detail, delta) => {
      const currentQuantity = tempQuantities[detail.productId] !== undefined 
        ? parseInt(tempQuantities[detail.productId], 10) 
        : detail.quantity;
      const newQuantity = currentQuantity + delta;
      
      console.log("",currentQuantity,"delta:", delta, newQuantity);

      // Cập nhật tempQuantities trước khi gửi API
      setTempQuantities((prev) => ({
        ...prev,
        [detail.productId]: newQuantity,
      }));

      fetchPut(
        `/Carts/${cart?.id}/details`,
        {
          ProductId: detail.productId,
          Quantity: delta, // Gửi delta (+1 hoặc -1) cho API tương đối
        },
        () => {
          fetchCartDetails(cart.id);
          //toast.success("Đã cập nhật số lượng");
        },
        (err) => {
          // Reset tempQuantities nếu API thất bại
          setTempQuantities((prev) => ({
            ...prev,
            [detail.productId]: detail.quantity,
          }));
          toast.error(err.title || "Lỗi khi cập nhật số lượng");
        },
        () => console.log("Cập nhật số lượng hoàn tất")
      );
    },
    [cart, fetchCartDetails]
  );

  // Cập nhật số lượng tuyệt đối (khi nhập trực tiếp)
  const handleUpdateQuantityAbsolute = useCallback(
    (detail, newQuantity) => {
      if (newQuantity < 1) {
        handleRemoveProduct(detail.productId);
        return;
      }

      // Cập nhật tempQuantities trước khi gửi API
      setTempQuantities((prev) => ({
        ...prev,
        [detail.productId]: newQuantity,
      }));

      fetchPut(
        `/Carts/${cart?.id}/details/newquantity`,
        {
          ProductId: detail.productId,
          Quantity: newQuantity, // Gửi số lượng tuyệt đối
        },
        () => {
          fetchCartDetails(cart.id);
          toast.success("Đã cập nhật số lượng");
        },
        (err) => {
          // Reset tempQuantities nếu API thất bại
          setTempQuantities((prev) => ({
            ...prev,
            [detail.productId]: detail.quantity,
          }));
          toast.error(err.title || "Lỗi khi cập nhật số lượng");
        },
        () => console.log("Cập nhật số lượng hoàn tất")
      );
    },
    [cart, fetchCartDetails]
  );

  // Xử lý khi nhập số lượng trực tiếp
  const handleQuantityInputChange = useCallback(
    (detail, value) => {
      // Cập nhật giá trị tạm thời
      setTempQuantities((prev) => ({
        ...prev,
        [detail.productId]: value,
      }));
    },
    []
  );

  // Xử lý khi xác nhận số lượng (onBlur hoặc Enter)
  const handleQuantityConfirm = useCallback(
    (detail) => {
      const value = tempQuantities[detail.productId] || detail.quantity;
      const newQuantity = parseInt(value, 10);
      if (isNaN(newQuantity) || newQuantity < 0) {
        toast.error("Số lượng phải là số không âm");
        // Reset về giá trị gốc nếu nhập sai
        setTempQuantities((prev) => ({
          ...prev,
          [detail.productId]: detail.quantity,
        }));
        return;
      }
      handleUpdateQuantityAbsolute(detail, newQuantity);
    },
    [tempQuantities, handleUpdateQuantityAbsolute]
  );

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveProduct = useCallback(
    (productId) => {
      fetchDelete(
        `/Carts/${cart?.id}/details/${productId}`,
        null,
        () => {
          fetchCartDetails(cart.id);
          toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
        },
        (err) => {
          toast.error(err.title || "Lỗi khi xóa sản phẩm");
          console.error("Xóa sản phẩm thất bại:", err); 
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
        OrderDetails: cartDetails.map((detail) => ({
          ProductId: detail.productId,
          Quantity: detail.quantity,
        })),
      },
      (res) => {
        toast.success("Đơn hàng đã được tạo thành công!");
        setIsDialogOpen(false);
        setCart(null);
        setCartDetails([]);
      },
      (err) => {
        toast.error(err.title || "Lỗi khi tạo đơn hàng");
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Khách hàng"
              value={cart?.customerId ? "Khách vãng lai" : "Khách lẻ"}
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>
        </Grid>

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
                      <TableCell>
                        {product.price != null ? product.price.toLocaleString() + " VNĐ" : "Chưa có giá"}
                      </TableCell>
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
                          onClick={() => handleUpdateQuantity(detail, -1)}
                        >
                          <Remove />
                        </IconButton>
                        <TextField
                          size="small"
                          type="number"
                          value={tempQuantities[detail.productId] !== undefined ? tempQuantities[detail.productId] : detail.quantity}
                          onChange={(e) => handleQuantityInputChange(detail, e.target.value)}
                          onBlur={() => handleQuantityConfirm(detail)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleQuantityConfirm(detail);
                            }
                          }}
                          sx={{ width: 100, mx: 1 }}
                          inputProps={{ min: 0 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(detail, 1)}
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

        <Typography variant="h6" sx={{ mt: 2, textAlign: "right" }}>
          Tổng cộng: {cartDetails.reduce((total, item) => total + item.quantity * item.price, 0).toLocaleString()} VNĐ
        </Typography>

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