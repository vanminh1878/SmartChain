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
import { Info as InfoIcon, Edit as EditIcon, Close, Search, Delete as DeleteIcon } from "@mui/icons-material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchGet, fetchPost, fetchPut, fetchDelete } from "../../../../lib/httpHandler";
import { showErrorMessageBox } from "../../../MessageBox/ErrorMessageBox/showErrorMessageBox";
import { showSuccessMessageBox } from "../../../MessageBox/SuccessMessageBox/showSuccessMessageBox";

// Sửa lỗi icon Leaflet
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

export default React.memo(function DetailSupplier({ item, fetchSuppliers }) {
  const [editStatus, setEditStatus] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [dataForm, setDataForm] = useState({
    name: item.name || "",
    contactName: item.contactName || "",
    phoneNumber: item.phoneNumber || "",
    email: item.email || "",
    address: item.address || "",
    latitude: item.latitude || 21.028511,
    longitude: item.longitude || 105.804817,
  });
  const [products, setProducts] = useState([]);
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  // Hàm lấy thông tin nhà cung cấp
  const fetchSupplierInfo = useCallback(() => {
    if (!item?.id || item.id.startsWith("temp-")) {
      console.warn("Invalid supplier id:", item?.id);
      showErrorMessageBox("ID nhà cung cấp không hợp lệ. Không thể lấy thông tin.");
      return;
    }
    fetchGet(
      `/suppliers/${item.id}`,
      (res) => {
        console.log("Supplier info fetched:", res);
        setDataForm({
          name: decodeURIComponent(res.name || res.Name || ""),
          contactName: decodeURIComponent(res.contactName || res.contact_Name || ""),
          phoneNumber: res.phoneNumber || "",
          email: res.email || "",
          address: res.address || "",
          latitude: res.latitude || 21.028511,
          longitude: res.longitude || 105.804817,
        });
      },
      (err) => {
        console.error("Fetch supplier error:", err);
        showErrorMessageBox(err.message || "Lỗi khi lấy thông tin nhà cung cấp. Vui lòng thử lại.");
      },
      () => console.log("Fetch supplier info completed")
    );
  }, [item.id]);

  // Hàm lấy danh sách sản phẩm của nhà cung cấp
  const fetchSupplierProducts = useCallback(() => {
    if (!item?.id || item.id.startsWith("temp-")) return;
    fetchGet(
      `/ProductSuppliers/supplier/${item.id}`, // Gọi API mới
      (res) => {
        console.log("Supplier products fetched:", res);
        setSupplierProducts(res || []);
      },
      (err) => {
        console.error("Fetch supplier products error:", err);
        
      },
      () => console.log("Fetch supplier products completed")
    );
  }, [item.id]);

  // Hàm lấy danh sách tất cả sản phẩm
  const fetchAllProducts = useCallback(() => {
    fetchGet(
      "/Products",
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

  // Load dữ liệu khi modal mở
  useEffect(() => {
    if (isModalOpen) {
      fetchSupplierInfo();
      fetchSupplierProducts();
      fetchAllProducts();
    }
  }, [isModalOpen, fetchSupplierInfo, fetchSupplierProducts, fetchAllProducts]);

  // Xử lý thay đổi input
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Xử lý click bản đồ và reverse geocoding
  const handleMapClick = useCallback(
    async (latlng) => {
      if (!editStatus) return;
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
        console.error("Lỗi reverse geocoding:", err);
        showErrorMessageBox("Không thể lấy địa chỉ từ vị trí. Vui lòng nhập thủ công.");
      }
    },
    [editStatus]
  );

  // Xử lý geocoding (địa chỉ sang tọa độ)
  const handleGeocode = useCallback(async () => {
    if (!editStatus) return;
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
      console.error("Lỗi geocoding:", err);
      showErrorMessageBox("Lỗi khi tìm vị trí. Vui lòng thử lại.");
    }
  }, [dataForm.address, editStatus]);

  // Xử lý submit form nhà cung cấp
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
      handleUpdate();
    },
    [dataForm]
  );

  // Xử lý cập nhật nhà cung cấp
  const handleUpdate = useCallback(() => {
    if (item.id.startsWith("temp-")) {
      showErrorMessageBox("ID nhà cung cấp không hợp lệ. Không thể cập nhật.");
      return;
    }
    const uri = `/suppliers/${item.id}`;
    const updatedData = {
      name: dataForm.name.trim(),
      contactName: dataForm.contactName.trim() || null,
      phoneNumber: dataForm.phoneNumber.trim() || null,
      email: dataForm.email.trim() || null,
      address: dataForm.address.trim() || null,
      latitude: parseFloat(dataForm.latitude.toFixed(6)),
      longitude: parseFloat(dataForm.longitude.toFixed(6)),
    };
    console.log("Sending PUT request to:", uri, "with data:", updatedData);

    fetchPut(
      uri,
      updatedData,
      async (res) => {
        console.log("Update response:", res);
        await showSuccessMessageBox(res.message || "Cập nhật nhà cung cấp thành công");
        setDataForm({ ...updatedData });
        fetchSuppliers();
        setEditStatus(false);
        setIsModalOpen(false);
      },
      (err) => {
        console.error("Update error details:", err);
        if (err.status === 409) {
          showErrorMessageBox("Tên nhà cung cấp đã tồn tại. Vui lòng chọn tên khác.");
        } else {
          showErrorMessageBox(
            err.errors
              ? Object.values(err.errors).flat().join(", ")
              : err.message || "Lỗi khi cập nhật nhà cung cấp. Vui lòng thử lại."
          );
        }
      },
      () => console.log("Update request completed")
    );
  }, [item.id, dataForm, fetchSuppliers]);

  // Xử lý xóa sản phẩm khỏi nhà cung cấp
  const handleDeleteProduct = useCallback(
    (productSupplierId) => {
      if (!item?.id || item.id.startsWith("temp-")) {
        showErrorMessageBox("ID nhà cung cấp không hợp lệ.");
        return;
      }
      fetchDelete(
        `/ProductSuppliers/${productSupplierId}`, // Cần API xóa ProductSupplier nếu có
        async () => {
          await showSuccessMessageBox("Xóa sản phẩm khỏi nhà cung cấp thành công");
          fetchSupplierProducts();
        },
        (err) => {
          console.error("Delete product error:", err);
          showErrorMessageBox("Lỗi khi xóa sản phẩm. Vui lòng thử lại.");
        },
        () => console.log("Delete product request completed")
      );
    },
    [item.id, fetchSupplierProducts]
  );

  // Xử lý thêm sản phẩm cho nhà cung cấp
  const handleAddProduct = useCallback(() => {
    if (!selectedProductId) {
      showErrorMessageBox("Vui lòng chọn một sản phẩm");
      return;
    }
    if (!item?.id || item.id.startsWith("temp-")) {
      showErrorMessageBox("ID nhà cung cấp không hợp lệ.");
      return;
    }
    fetchPost(
      `/ProductSuppliers`, // Gọi API POST mới
      { productId: selectedProductId, supplierId: item.id },
      async () => {
        await showSuccessMessageBox("Thêm sản phẩm thành công");
        fetchSupplierProducts();
        setIsAddProductModalOpen(false);
        setSelectedProductId("");
      },
      (err) => {
        console.error("Add product error:", err);
        showErrorMessageBox("Lỗi khi thêm sản phẩm. Vui lòng thử lại.");
      },
      () => console.log("Add product request completed")
    );
  }, [item.id, selectedProductId, fetchSupplierProducts]);

  // Bật/tắt chế độ chỉnh sửa
  const handleEditToggle = useCallback(() => {
    setEditStatus((prev) => !prev);
    if (!editStatus) {
      setTimeout(() => {
        const input = document.querySelector(`input[name="name"]`);
        if (input) input.focus();
      }, 100);
    }
  }, [editStatus]);

  // Hủy chỉnh sửa
  const handleCancel = useCallback(() => {
    setEditStatus(false);
    setDataForm({
      name: item.name || "",
      contactName: item.contactName || "",
      phoneNumber: item.phoneNumber || "",
      email: item.email || "",
      address: item.address || "",
      latitude: item.latitude || 21.028511,
      longitude: item.longitude || 105.804817,
    });
    setIsModalOpen(false);
  }, [item]);

  // Mở modal
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Đóng modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditStatus(false);
  }, []);

  // Mở/đóng modal thêm sản phẩm
  const openAddProductModal = useCallback(() => {
    setIsAddProductModalOpen(true);
  }, []);

  const closeAddProductModal = useCallback(() => {
    setIsAddProductModalOpen(false);
    setSelectedProductId("");
  }, []);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<InfoIcon />}
        onClick={openModal}
        sx={{
          borderRadius: 2,
          minWidth: "auto",
          padding: 1,
          borderColor: "transparent",
        }}
      />
      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, padding: 2 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">
            {editStatus ? "Sửa thông tin nhà cung cấp" : "Thông tin nhà cung cấp"}
          </Typography>
          <Box>
            {!editStatus && (
              <IconButton onClick={handleEditToggle} sx={{ mr: 1 }}>
                <EditIcon />
              </IconButton>
            )}
            <IconButton onClick={closeModal}>
              <Close />
            </IconButton>
          </Box>
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
                    disabled={!editStatus}
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
                    disabled={!editStatus}
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
                    disabled={!editStatus}
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
                    disabled={!editStatus}
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
                      disabled={!editStatus}
                      variant="outlined"
                    />
                    {editStatus && (
                      <IconButton onClick={handleGeocode} color="primary" title="Tìm vị trí">
                        <Search />
                      </IconButton>
                    )}
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
                    Vị trí trên bản đồ
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
                    {editStatus && <MapEvents onMapClick={handleMapClick} />}
                  </MapContainer>
                </Grid>
                {/* Bảng sản phẩm của nhà cung cấp */}
                <Grid item xs={12}>
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
                          supplierProducts.map((productSupplier) => (
                            <TableRow key={productSupplier.id}>
                              <TableCell>
                                {products.find((p) => p.id === productSupplier.productId)?.name || "Không xác định"}
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  onClick={() => handleDeleteProduct(productSupplier.id)}
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
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        {editStatus && (
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCancel} variant="outlined" sx={{ borderRadius: 2 }}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              type="submit"
              sx={{ borderRadius: 2 }}
            >
              Lưu
            </Button>
          </DialogActions>
        )}
      </Dialog>
      {/* Dialog thêm sản phẩm */}
      <Dialog
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
              {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Không có sản phẩm</MenuItem>
              )}
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
      </Dialog>
    </>
  );
});