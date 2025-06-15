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
} from "@mui/material";
import { TiEdit } from "react-icons/ti";
import { Info as InfoIcon, Close, Upload } from "@mui/icons-material";
import { fetchGet, fetchPut, fetchUpload, BE_ENPOINT } from "../../../../lib/httpHandler";
import { showErrorMessageBox } from "../../../../components/MessageBox/ErrorMessageBox/showErrorMessageBox";
import { showSuccessMessageBox } from "../../../MessageBox/SuccessMessageBox/showSuccessMessageBox";
import "./DetailProduct.css";

export default React.memo(function DetailProduct({ item, setListProducts, setSelectedProduct }) {
  const [editStatus, setEditStatus] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataForm, setDataForm] = useState({
    name: item.name || "",
    description: item.description || "",
    price: item.price || 0,
    stockQuantity: item.stockQuantity || 0,
    image: item.image || "",
  });

  // Lấy thông tin sản phẩm
  const fetchProductInfo = useCallback(() => {
    if (!item?.id) return;
    fetchGet(
      `/products/${item.id}`,
      (res) => {
        setDataForm({
          name: decodeURIComponent(res.name || ""),
          description: decodeURIComponent(res.description || ""),
          price: Number(res.price) || 0,
          stockQuantity: Number(res.stockQuantity) || 0,
          image: res.image || "",
        });
      },
      (err) => {
        showErrorMessageBox("Lỗi khi lấy thông tin sản phẩm. Vui lòng thử lại.");
      },
      () => console.log("Lấy thông tin sản phẩm hoàn tất")
    );
  }, [item.id]);

  useEffect(() => {
    if (isModalOpen) {
      fetchProductInfo();
    }
  }, [isModalOpen, fetchProductInfo]);

  // Xử lý thay đổi input
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) || 0 : value,
    }));
  }, []);

  // Xử lý upload ảnh
  const handleImageChange = useCallback(
    (e) => {
      if (!editStatus) return;
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
          showSuccessMessageBox("Ảnh sản phẩm đã được tải lên thành công!");
        },
        (err) => {
          showErrorMessageBox(err.message || "Tải ảnh thất bại!");
        },
        () => console.log("Tải ảnh hoàn tất")
      );
    },
    [editStatus]
  );

  // Xử lý submit form
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!dataForm.name.trim()) {
        showErrorMessageBox("Vui lòng điền tên sản phẩm");
        return;
      }
      if (dataForm.price < 0) {
        showErrorMessageBox("Giá sản phẩm không được âm");
        return;
      }
      handleUpdate();
    },
    [dataForm]
  );

  // Xử lý cập nhật sản phẩm
  const handleUpdate = useCallback(() => {
    const uri = `/Products/${item.id}`;
    const updatedData = {
      name: dataForm.name.trim(),
      description: dataForm.description.trim(),
      price: dataForm.price,
      Image: dataForm.image || null, // Lưu ý: API yêu cầu "Image" (viết hoa chữ I)
    };

    fetchPut(
      uri,
      updatedData,
      async (res) => {
        await showSuccessMessageBox(res.message || "Cập nhật sản phẩm thành công");
        setDataForm((prev) => ({ ...prev, ...updatedData }));
        setListProducts((prevList) =>
          prevList.map((listItem) =>
            listItem.id === item.id ? { ...listItem, ...updatedData, Image: updatedData.Image } : listItem
          )
        );
        setEditStatus(false);
        setIsModalOpen(false);
        setSelectedProduct(null);
      },
      (err) => {
        if (err.status === 409) {
          showErrorMessageBox("Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác.");
        } else {
          showErrorMessageBox(err.message || "Lỗi khi cập nhật sản phẩm. Vui lòng thử lại.");
        }
      },
      () => console.log("Cập nhật sản phẩm hoàn tất")
    );
  }, [item.id, dataForm, setListProducts, setSelectedProduct]);

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
      description: item.description || "",
      price: item.price || 0,
      stockQuantity: item.stockQuantity || 0,
      image: item.image || "",
    });
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, [item, setSelectedProduct]);

  // Mở modal
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Đóng modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditStatus(false);
    setSelectedProduct(null);
  }, [setSelectedProduct]);

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
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, padding: 2 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">
            {editStatus ? "Sửa thông tin sản phẩm" : "Thông tin sản phẩm"}
          </Typography>
          <Box>
            {!editStatus && (
              <IconButton onClick={handleEditToggle} sx={{ mr: 1 }}>
                <TiEdit />
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
                      alt="Sản phẩm"
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #e0e0e0",
                      }}
                    />
                    {editStatus && (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                          id="product-image-upload"
                        />
                        <label htmlFor="product-image-upload">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<Upload />}
                            sx={{ borderRadius: 2 }}
                          >
                            Tải ảnh lên
                          </Button>
                        </label>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
              {/* Hàng 2: Tên, Giá, Tồn kho */}
              <Grid container item spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Tên sản phẩm"
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
                    label="Giá (VNĐ)"
                    name="price"
                    type="number"
                    value={dataForm.price}
                    onChange={handleChange}
                    required
                    disabled={!editStatus}
                    variant="outlined"
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Tồn kho"
                    name="stockQuantity"
                    type="number"
                    value={dataForm.stockQuantity}
                    disabled // Luôn disabled
                    variant="outlined"
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </Grid>
              {/* Hàng 3: Mô tả */}
              <Grid container item spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mô tả"
                    name="description"
                    value={dataForm.description}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    disabled={!editStatus}
                    variant="outlined"
                  />
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
    </>
  );
});