import React, { useState, useCallback } from "react";
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
} from "@mui/material";
import { Add, Close, Upload, Search } from "@mui/icons-material"; // Thêm Search icon
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchPost, fetchUpload, BE_ENPOINT } from "../../../../lib/httpHandler";
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

const center = [21.028511, 105.804817]; // Default: Ho Chi Minh City

function MapEvents({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

export default React.memo(function AddStore({ setListStores }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataForm, setDataForm] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    email: "",
    latitude: 21.028511,
    longitude: 105.804817,
    image: "",
  });

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

  // Handle image upload
  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) {
      showErrorMessageBox("Vui lòng chọn một file ảnh!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetchUpload(
      "/api/asset/upload-image",
      formData,
      (data) => {
        const imageUrl = data.fileName;
        setDataForm((prev) => ({ ...prev, image: imageUrl }));
        showSuccessMessageBox("Ảnh cửa hàng đã được upload thành công!");
      },
      (err) => {
        showErrorMessageBox(err.message || "Upload ảnh thất bại!");
      },
      () => console.log("Upload image completed")
    );
  }, []);

  // Handle form submit
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!dataForm.name.trim()) {
        showErrorMessageBox("Vui lòng điền tên cửa hàng");
        return;
      }
      if (!dataForm.phoneNumber.trim()) {
        showErrorMessageBox("Vui lòng điền số điện thoại");
        return;
      }
      if (!/^\+?\d{10,15}$/.test(dataForm.phoneNumber.trim())) {
        showErrorMessageBox("Số điện thoại không hợp lệ");
        return;
      }
      if (!dataForm.address.trim()) {
        showErrorMessageBox("Vui lòng điền địa chỉ cửa hàng");
        return;
      }
      if (!dataForm.email.trim()) {
        showErrorMessageBox("Vui lòng điền email");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dataForm.email.trim())) {
        showErrorMessageBox("Email không hợp lệ");
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

  // Handle add store
  const handleAdd = useCallback(() => {
    const newStore = {
      name: dataForm.name.trim(),
      phoneNumber: dataForm.phoneNumber.trim(),
      address: dataForm.address.trim(),
      email: dataForm.email.trim(),
      latitude: parseFloat(dataForm.latitude.toFixed(6)),
      longitude: parseFloat(dataForm.longitude.toFixed(6)),
      image: dataForm.image || null,
      status: true,
    };

    fetchPost(
      "/stores",
      newStore,
      async (res) => {
        await showSuccessMessageBox(res.message || "Thêm cửa hàng thành công");
        setListStores((prev) => [...prev, { ...newStore, id: res.id }]);
        setDataForm({
          name: "",
          phoneNumber: "",
          address: "",
          email: "",
          latitude: 21.028511,
          longitude: 105.804817,
          image: "",
        });
        setIsModalOpen(false);
      },
      (err) => {
        showErrorMessageBox(err.message || "Lỗi khi thêm cửa hàng. Vui lòng thử lại.");
      },
      () => console.log("Add store request completed")
    );
  }, [dataForm, setListStores]);

  // Open modal
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setDataForm({
      name: "",
      phoneNumber: "",
      address: "",
      email: "",
      latitude: 21.028511,
      longitude: 105.804817,
      image: "",
    });
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
          <Typography variant="h6">Thêm cửa hàng mới</Typography>
          <IconButton onClick={closeModal}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Hàng 1: Upload ảnh */}
              <Grid container item spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <img
                      src={
                        dataForm.image
                          ? `${BE_ENPOINT}/api/asset/view-image/${dataForm.image}`
                          : "https://via.placeholder.com/100"
                      }
                      alt="Store"
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #e0e0e0",
                      }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                      id="store-image-upload"
                    />
                    <label htmlFor="store-image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<Upload />}
                        sx={{ borderRadius: 2 }}
                      >
                        Tải ảnh lên
                      </Button>
                    </label>
                  </Box>
                </Grid>
              </Grid>
              {/* Hàng 2: Tên, Số điện thoại, Email */}
              <Grid container item spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Tên cửa hàng"
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
                    label="Số điện thoại"
                    name="phoneNumber"
                    value={dataForm.phoneNumber}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={dataForm.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              {/* Hàng 3: Địa chỉ, Kinh độ, Vĩ độ */}
              <Grid container item spacing={2}>
                <Grid item xs={12} sm={4}>
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
              {/* Hàng 4: Bản đồ */}
              <Grid container item spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Chọn vị trí trên bản đồ
                  </Typography>
                  <MapContainer center={[dataForm.latitude, dataForm.longitude]} zoom={15} style={mapContainerStyle}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[dataForm.latitude, dataForm.longitude]} />
                    <MapEvents onMapClick={handleMapClick} />
                  </MapContainer>
                </Grid>
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
            sx={{ borderRadius: 2 }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});