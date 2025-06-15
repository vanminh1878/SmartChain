import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Add, Close, Search, Delete as DeleteIcon } from "@mui/icons-material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchGet, fetchPost, fetchDelete } from "../../../../lib/httpHandler";
import { showErrorMessageBox } from "../../../../components/MessageBox/ErrorMessageBox/showErrorMessageBox";
import { showSuccessMessageBox } from "../../../MessageBox/SuccessMessageBox/showSuccessMessageBox";

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const mapContainerStyle = {
  width: "350px",
  height: "300px",
  borderRadius: "8px",
  marginTop: "16px",
};

function MapEvents({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

export default React.memo(function AddSupplier({ fetchSuppliers }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [dataForm, setDataForm] = useState({
    name: "",
    contactName: "",
    phoneNumber: "",
    email: "",
    address: "",
    latitude: 21.028511, // Default: Hanoi
    longitude: 105.804817,
  });
  const [products, setProducts] = useState([]);
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [newSupplierId, setNewSupplierId] = useState(null);

  // Hàm lấy danh sách tất cả sản phẩm
  const fetchAllProducts = useCallback(() => {
    fetchGet(
      "/products",
      (res) => {
        console.log("All products fetched:", res);
         setProducts(Array.isArray(res.items) ? res.items : []);
      },
      (err) => {
        console.error("Fetch products error:", err);
        showErrorMessageBox("Lỗi khi lấy danh sách sản phẩm.");
      },
      () => console.log("Fetch products completed")
    );
  }, []);

  // Load danh sách sản phẩm khi modal mở
  useEffect(() => {
    if (isModalOpen) {
      fetchAllProducts();
    }
  }, [isModalOpen, fetchAllProducts]);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle map click and reverse geocode
  const handleMapClick = useCallback(async (latlng) => {
    setDataForm((prev) => ({
      ...prev,
      latitude: latlng.lat,
      longitude: latlng.lng,
    }));

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "User-Agent": "SmartChainApp/1.0 (your.email@example.com)",
          },
        }
      );
      const data = await response.json();
      if (data.display_name) {
        setDataForm((prev) => ({ ...prev, address: data.display_name }));
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      showErrorMessageBox("Không thể lấy địa chỉ từ vị trí. Vui lòng nhập thủ công.");
    }
  }, []);

  // Handle geocoding (address to lat/lng)
  const handleGeocode = useCallback(async () => {
    if (!dataForm.address.trim()) {
      showErrorMessageBox("Vui lòng nhập địa chỉ trước khi tìm!");
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dataForm.address)}&limit=1&addressdetails=1`,
        {
          headers: {
            "User-Agent": "SmartChainApp/1.0 (your.email@example.com)",
          },
        }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setDataForm((prev) => ({
          ...prev,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        }));
        showSuccessMessageBox("Đã tìm thấy vị trí trên bản đồ!");
      } else {
        showErrorMessageBox("Không tìm thấy vị trí cho địa chỉ này!");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      showErrorMessageBox("Lỗi khi tìm vị trí. Vui lòng thử lại.");
    }
  }, [dataForm.address]);

  // Handle form submit
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!dataForm.name.trim()) {
        showErrorMessageBox("Vui lòng điền tên nhà cung cấp");
        return;
      }
      if (dataForm.name.trim().length > 100) {
        showErrorMessageBox("Tên nhà cung cấp không được vượt quá 100 ký tự");
        return;
      }
      if (dataForm.contactName.trim().length > 50) {
        showErrorMessageBox("Tên người liên hệ không được vượt quá 50 ký tự");
        return;
      }
      if (dataForm.phoneNumber && !/^\d{10}$/.test(dataForm.phoneNumber)) {
        showErrorMessageBox("Số điện thoại không hợp lệ (phải đúng 10 chữ số)");
        return;
      }
      if (dataForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dataForm.email)) {
        showErrorMessageBox("Email không hợp lệ");
        return;
      }
      if (dataForm.address.trim().length > 255) {
        showErrorMessageBox("Địa chỉ không được vượt quá 255 ký tự");
        return;
      }
      if (!dataForm.latitude || !dataForm.longitude) {
        showErrorMessageBox("Vui lòng chọn vị trí trên bản đồ");
        return;
      }
      handleAdd();
    },
    [dataForm]
  );

  // Handle add supplier
  const handleAdd = useCallback(() => {
    const newSupplier = {
      name: dataForm.name.trim(),
      contactName: dataForm.contactName.trim() || null,
      phoneNumber: dataForm.phoneNumber.trim() || null,
      email: dataForm.email.trim() || null,
      address: dataForm.address.trim() || null,
      latitude: parseFloat(dataForm.latitude.toFixed(6)),
      longitude: parseFloat(dataForm.longitude.toFixed(6)),
    };

    setIsSubmitting(true);
    fetchPost(
      "/suppliers",
      newSupplier,
      async (res) => {
        console.log("Thêm nhà cung cấp thành công:", res);
        setNewSupplierId(res.id); // Lưu ID của nhà cung cấp mới
        await showSuccessMessageBox(res.message || "Thêm nhà cung cấp thành công");
        fetchSuppliers();
      },
      (err) => {
        console.error("Lỗi khi thêm nhà cung cấp:", err);
        if (err.status === 409) {
          showErrorMessageBox("Tên nhà cung cấp đã tồn tại. Vui lòng chọn tên khác.");
        } else {
          showErrorMessageBox(
            err.errors
              ? Object.values(err.errors).flat().join(", ")
              : err.message || "Lỗi khi thêm nhà cung cấp. Vui lòng thử lại."
          );
        }
      },
      () => {
        setIsSubmitting(false);
        console.log("Add supplier request completed");
      }
    );
  }, [dataForm, fetchSuppliers]);

  // Handle add product to supplier
  const handleAddProduct = useCallback(() => {
    if (!selectedProductId) {
      showErrorMessageBox("Vui lòng chọn một sản phẩm");
      return;
    }
    // if (!newSupplierId) {
    //   showErrorMessageBox("Vui lòng thêm nhà cung cấp trước khi thêm sản phẩm.");
    //   return;
    // }
    fetchPost(
      `/suppliers/${newSupplierId}/products`,
      { productId: selectedProductId },
      async () => {
        await showSuccessMessageBox("Thêm sản phẩm thành công");
        setSupplierProducts((prev) => [
          ...prev,
          products.find((p) => p.Id === selectedProductId),
        ]);
        setIsAddProductModalOpen(false);
        setSelectedProductId("");
      },
      (err) => {
        console.error("Add product error:", err);
        showErrorMessageBox("Lỗi khi thêm sản phẩm. Vui lòng thử lại.");
      },
      () => console.log("Add product request completed")
    );
  }, [newSupplierId, selectedProductId, products]);

  // Handle delete product from supplier
  const handleDeleteProduct = useCallback(
    (productId) => {
      if (!newSupplierId) {
        showErrorMessageBox("ID nhà cung cấp không hợp lệ.");
        return;
      }
      fetchDelete(
        `/suppliers/${newSupplierId}/products/${productId}`,
        async () => {
          await showSuccessMessageBox("Xóa sản phẩm khỏi nhà cung cấp thành công");
          setSupplierProducts((prev) => prev.filter((p) => p.Id !== productId));
        },
        (err) => {
          console.error("Delete product error:", err);
          showErrorMessageBox("Lỗi khi xóa sản phẩm. Vui lòng thử lại.");
        },
        () => console.log("Delete product request completed")
      );
    },
    [newSupplierId]
  );

  // Open modal
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setDataForm({
      name: "",
      contactName: "",
      phoneNumber: "",
      email: "",
      address: "",
      latitude: 21.028511,
      longitude: 105.804817,
    });
    setSupplierProducts([]);
    setNewSupplierId(null);
  }, []);

  // Open/close add product modal
  const openAddProductModal = useCallback(() => {
    // if (!newSupplierId) {
    //   showErrorMessageBox("Vui lòng thêm nhà cung cấp trước khi thêm sản phẩm.");
    //   return;
    // }
    setIsAddProductModalOpen(true);
  }, [newSupplierId]);

  const closeAddProductModal = useCallback(() => {
    setIsAddProductModalOpen(false);
    setSelectedProductId("");
  }, []);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={openModal}
        sx={{ borderRadius: 2, textTransform: "none" }}
      >
        Thêm
      </Button>

      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, padding: 2 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Thêm nhà cung cấp mới</Typography>
          <IconButton onClick={closeModal}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Hàng 1: Tên, Người liên hệ, Số điện thoại */}
              <Grid container item spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Tên nhà cung cấp"
                    name="name"
                    value={dataForm.name}
                    onChange={handleChange}
                    required
                    autoFocus
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Người liên hệ"
                    name="contactName"
                    value={dataForm.contactName}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phoneNumber"
                    value={dataForm.phoneNumber}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              {/* Hàng 2: Email, Địa chỉ */}
              <Grid container item spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={dataForm.email}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Địa chỉ"
                      name="address"
                      value={dataForm.address}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                    <IconButton onClick={handleGeocode} color="primary" title="Tìm vị trí">
                      <Search />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
              {/* Hàng 3: Kinh độ, Vĩ độ */}
              <Grid container item spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Kinh độ"
                    name="longitude"
                    value={dataForm.longitude}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Vĩ độ"
                    name="latitude"
                    value={dataForm.latitude}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              {/* Hàng 4: Bản đồ và Sản phẩm của nhà cung cấp */}
              <Grid container item spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Chọn vị trí trên bản đồ
                  </Typography>
                  <MapContainer
                    center={[dataForm.latitude, dataForm.longitude]}
                    zoom={15}
                    style={mapContainerStyle}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[dataForm.latitude, dataForm.longitude]} />
                    <MapEvents onMapClick={handleMapClick} />
                  </MapContainer>
                </Grid>
                {/* Bảng sản phẩm của nhà cung cấp */}
                {/* <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Sản phẩm của nhà cung cấp
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={openAddProductModal}
                      sx={{ borderRadius: 2, ml: "50px" }}
                    >
                      Thêm sản phẩm
                    </Button>
                  </Box>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Tên sản phẩm</TableCell>
                          <TableCell align="right">Thao tác</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {supplierProducts.length > 0 ? (
                          supplierProducts.map((product) => (
                            <TableRow key={product.Id}>
                              <TableCell>{product.Name}</TableCell>
                              <TableCell align="right">
                                <IconButton
                                  onClick={() => handleDeleteProduct(product.Id)}
                                  color="error"
                                  title="Xóa sản phẩm"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2} align="center">
                              Không có sản phẩm nào
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid> */}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={closeModal} variant="outlined" sx={{ borderRadius: 2 }}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            type="submit"
            disabled={isSubmitting}
            sx={{ borderRadius: 2 }}
          >
            {isSubmitting ? "Đang xử lý..." : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog thêm sản phẩm */}
      {/* <Dialog
        open={isAddProductModalOpen}
        onClose={closeAddProductModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, padding: 2 } }}
      >
        <DialogTitle>Thêm sản phẩm cho nhà cung cấp</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="product-select-label">Chọn sản phẩm</InputLabel>
            <Select
              labelId="product-select-label"
              value={selectedProductId}
              label="Chọn sản phẩm"
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddProductModal} variant="outlined" sx={{ borderRadius: 2 }}>
            Hủy
          </Button>
          <Button
            onClick={handleAddProduct}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
});