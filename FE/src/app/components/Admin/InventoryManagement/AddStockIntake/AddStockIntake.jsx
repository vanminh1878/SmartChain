import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Avatar,
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { fetchGet, fetchPost } from "../../../../lib/httpHandler";

// Component Product để hiển thị tên sản phẩm với Avatar
const Product = ({ productName }) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    <Avatar alt={productName} sx={{ width: 30, height: 30 }}>
      {productName ? productName[0].toUpperCase() : "A"}
    </Avatar>
    <Typography sx={{ mx: 3 }} variant="subtitle2">
      {productName}
    </Typography>
  </Box>
);

const AddStockIntake = ({ open, onClose, stores, suppliers, products, categories, user, onCreateIntake, onCreateProduct }) => {
  const [newIntake, setNewIntake] = useState({
    intake_date: new Date().toISOString().split("T")[0],
    created_by: user?.id,
    status: 0,
    details: [
      {
        id: Date.now(),
        product_id: "",
        quantity: 0,
        unit_price: 0,
        store_id: "",
        supplier_id: "",
        profit_margin: 0,
        intake_date: new Date().toISOString().split("T")[0],
      },
    ],
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category_id: "",
    image: "",
  });
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [userFullname, setUserFullname] = useState(user?.fullname || "Không xác định");
  const [productSearchText, setProductSearchText] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Fetch thông tin người dùng
  useEffect(() => {
    fetchGet(
      "/users/profile",
      (res) => {
        console.log("Dữ liệu người dùng:", res);
        setUserFullname(res.fullname || "Không xác định");
        setNewIntake((prev) => ({
          ...prev,
          created_by: res.userId || prev.created_by || "Không xác định",
        }));
      },
      (fail) => {
        toast.error(fail.message || "Không thể tải thông tin cá nhân");
      }
    );
  }, []);

  // Fetch danh sách sản phẩm theo cửa hàng
  const fetchProducts = useCallback(() => {
    if (!selectedStoreId) return;
    setIsLoadingProducts(true);
    fetchGet(
      "/Inventory/Products",
      (res) => {
        const productList = Array.isArray(res) ? res : [];
        if (!productList.length) {
          toast.error("Không có dữ liệu sản phẩm");
          setProductList([]);
          setIsLoadingProducts(false);
          return;
        }

        const validatedProducts = productList
          .filter((item) => item && typeof item === "object" && item.productId && item.storeId === selectedStoreId)
          .map((item) => ({
            id: item.productId,
            name: item.tenSanPham || "Không xác định",
            category: item.danhMuc || "Không xác định",
            supplier: item.nhaCungCap || "Không xác định",
            store: item.cuaHang || "Không xác định",
            unit_price: Number(item.giaNhap) || 0,
            price: Number(item.giaBan) || 0,
            stock_quantity: Number(item.tonKho) || 0,
          }));
        console.log("validatedProducts: ", validatedProducts);
        setProductList(validatedProducts);
        setIsLoadingProducts(false);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách sản phẩm:", fail);
        toast.error("Lỗi khi lấy danh sách sản phẩm");
        setProductList([]);
        setIsLoadingProducts(false);
      }
    );
  }, [selectedStoreId]);

  // Fetch danh mục
  const fetchCategoryList = useCallback(() => {
    if (categoryList.length === 0) {
      fetchGet(
        "/Categories",
        (res) => {
          console.log("Danh sách danh mục đã được tải thành công", res);
          setCategoryList(Array.isArray(res) ? res : []);
        },
        (fail) => {
          console.error("Lỗi khi tải danh sách danh mục", fail);
          toast.error("Không thể tải danh sách danh mục");
        }
      );
    }
  }, [categoryList]);

  // Lọc sản phẩm theo tìm kiếm
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(productList)) return [];
    const validProducts = productList.filter((item) => item && item.id);
    if (!productSearchText.trim()) return validProducts;
    const lowercasedSearch = productSearchText.toLowerCase();
    return validProducts.filter((item) => item.name?.toLowerCase().includes(lowercasedSearch));
  }, [productList, productSearchText]);

  // Tính tổng giá trị
  const totalValue = useMemo(() => {
    return newIntake.details.reduce((sum, detail) => sum + (detail.quantity * detail.unit_price || 0), 0);
  }, [newIntake.details]);

  // Cột hiển thị sản phẩm
  const productColumns = [
    {
      field: "product",
      headerName: "Tên SP",
      width: 250,
      renderCell: (cellData) => <Product productName={cellData.row?.name || "Không xác định"} />,
    },
    { field: "category", headerName: "Danh mục", width: 150 },
    { field: "supplier", headerName: "Nhà cung cấp", width: 200 },
    { field: "store", headerName: "Cửa hàng", width: 150 },
    {
      field: "price",
      headerName: "Giá bán",
      width: 150,
      renderCell: (params) => {
        return params.row.price != null
          ? `${Number(params.row.price).toLocaleString("vi-VN")} VNĐ`
          : "0 VNĐ";
      },
    },
    {
      field: "stock_quantity",
      headerName: "Tồn kho",
      width: 120,
      renderCell: (params) => {
        return params.row.stock_quantity != null
          ? `${Number(params.row.stock_quantity)} cái`
          : "0 cái";
      },
    },
  ];

  // Cập nhật chi tiết phiếu nhập
  const handleDetailChange = (id, field, value) => {
    setNewIntake((prev) => {
      const newDetails = prev.details.map((detail) => {
        if (detail.id === id) {
          const updatedDetail = { ...detail, [field]: value };
          if (field === "product_id") {
            const selectedProduct = productList.find((p) => p.id === value);
            updatedDetail.category_id = selectedProduct?.category || "";
          }
          return updatedDetail;
        }
        return detail;
      });
      return { ...prev, details: newDetails };
    });
  };

  // Thêm chi tiết phiếu nhập
  const handleAddDetail = () => {
    setNewIntake((prev) => ({
      ...prev,
      details: [
        ...prev.details,
        {
          id: Date.now(),
          product_id: "",
          quantity: 0,
          unit_price: 0,
          store_id: prev.details[0]?.store_id || "",
          supplier_id: prev.details[0]?.supplier_id || "",
          profit_margin: 0,
          intake_date: prev.intake_date,
          category_id: "",
        },
      ],
    }));
  };

  // Xóa chi tiết phiếu nhập
  const handleRemoveDetail = (id) => {
    setNewIntake((prev) => {
      const newDetails = prev.details.filter((detail) => detail.id !== id);
      return {
        ...prev,
        details: newDetails.length > 0 ? newDetails : [
          {
            id: Date.now(),
            product_id: "",
            quantity: 0,
            unit_price: 0,
            store_id: "",
            supplier_id: "",
            profit_margin: 0,
            intake_date: prev.intake_date,
            category_id: "",
          },
        ],
      };
    });
  };

  // Cập nhật thông tin sản phẩm mới
  const handleNewProductChange = (field, value) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
  };

  // Tạo sản phẩm mới
  const handleCreateProduct = () => {
    if (!newProduct.name || !newProduct.category_id || !newProduct.description) {
      toast.error("Vui lòng điền đầy đủ thông tin: Tên, Danh mục, Mô tả");
      return;
    }

    const newProductData = {
      Name: newProduct.name,
      CategoryId: newProduct.category_id,
      Description: newProduct.description,
      Image: newProduct.image || null,
    };

    fetchPost(
      "/Inventory/Products",
      newProductData,
      (createdProduct) => {
        setProductList((prev) => [...prev, {
          id: createdProduct.productId,
          name: createdProduct.tenSanPham || "Không xác định",
          category: createdProduct.danhMuc || "Không xác định",
          supplier: createdProduct.nhaCungCap || "Không xác định",
          store: createdProduct.cuaHang || "Không xác định",
          unit_price: Number(createdProduct.giaNhap) || 0,
          price: Number(createdProduct.giaBan) || 0,
          stock_quantity: Number(createdProduct.tonKho) || 0,
        }]);
        setNewProduct({
          name: "",
          description: "",
          category_id: "",
          image: "",
        });
        setShowNewProductForm(false);
        toast.success("Thêm sản phẩm mới thành công");
      },
      (error) => {
        console.error("Lỗi khi tạo sản phẩm:", error);
        toast.error("Không thể tạo sản phẩm mới");
      }
    );
  };

  // Tạo phiếu nhập kho
  const handleCreate = async () => {
    if (!newIntake.details.every((d) => d.supplier_id && d.store_id)) {
      toast.error("Vui lòng chọn cửa hàng và nhà cung cấp cho tất cả chi tiết");
      return;
    }
    if (!newIntake.details.every((d) => d.product_id && d.quantity > 0 && d.unit_price > 0)) {
      toast.error("Vui lòng điền đầy đủ thông tin chi tiết sản phẩm");
      return;
    }

    try {
      const stockIntakeData = {
        CreatedBy: newIntake.created_by,
      };
      console.log("StockIntake data gửi đi:", stockIntakeData);

      const stockIntakeResponse = await fetchPost(
        "/Inventory/StockIntakes",
        stockIntakeData,
        (res) => {
          console.log("StockIntake response:", res);
          return res;
        },
        (error) => {
          throw new Error(error.message || "Không thể tạo phiếu nhập kho");
        }
      );

      const stockIntakeId = stockIntakeResponse.id;
      console.log("StockIntakeId:", stockIntakeId);

      const detailPromises = newIntake.details.map((detail) => {
        const detailData = {
          StockIntakeId: stockIntakeId,
          SupplierId: detail.supplier_id,
          ProductId: detail.product_id,
          StoreId: detail.store_id,
          ProfitMargin: detail.profit_margin,
          Quantity: detail.quantity,
          UnitPrice: detail.unit_price,
          IntakeDate: detail.intake_date,
        };
        console.log("Detail data gửi đi:", JSON.stringify(detailData, null, 2));
        return fetchPost(
          "/Inventory/StockIntakeDetails",
          detailData,
          (res) => {
            console.log("StockIntakeDetail response:", res);
            return res;
          },
          (error) => {
            console.error("Lỗi chi tiết:", error);
            throw new Error(error.message || "Không thể tạo chi tiết phiếu nhập kho");
          }
        );
      });

      await Promise.all(detailPromises);

      toast.success("Tạo phiếu nhập kho và chi tiết thành công");
      onCreateIntake(stockIntakeResponse);
      onClose();
    } catch (error) {
      console.error("Lỗi khi tạo phiếu nhập kho:", error);
      toast.error(error.message || "Có lỗi xảy ra khi tạo phiếu nhập kho");
    }
  };

  // Tự động fetch sản phẩm khi chọn cửa hàng
  useEffect(() => {
    if (selectedStoreId) {
      fetchProducts();
    }
  }, [selectedStoreId, fetchProducts]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Tạo phiếu nhập kho mới</DialogTitle>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography variant="subtitle1">
              Người tạo: {userFullname}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Ngày nhập kho"
              type="date"
              value={newIntake.intake_date}
              onChange={(e) =>
                setNewIntake((prev) => ({
                  ...prev,
                  intake_date: e.target.value,
                  details: prev.details.map((d) => ({ ...d, intake_date: e.target.value })),
                }))
              }
              fullWidth
              sx={{ backgroundColor: "white" }}
            />
          </Grid>
        </Grid>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Danh sách sản phẩm của cửa hàng
        </Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Cửa hàng</InputLabel>
          <Select
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            sx={{ backgroundColor: "white" }}
          >
            {Array.isArray(stores) &&
              stores.map((store) => (
                <MenuItem key={store.id} value={store.id}>
                  {store.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <TextField
            placeholder="Tìm kiếm sản phẩm"
            value={productSearchText}
            onChange={(e) => setProductSearchText(e.target.value)}
            sx={{ width: "40%", backgroundColor: "white" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {isLoadingProducts ? (
          <Typography>Đang tải dữ liệu sản phẩm...</Typography>
        ) : (
          <DataGrid
            sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0, mb: 4 }}
            rows={filteredProducts}
            columns={productColumns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10]}
            getRowId={(row) => row.id}
            disableSelectionOnClick
          />
        )}
        {showNewProductForm && (
          <Box sx={{ mt: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography variant="subtitle1">Thêm sản phẩm mới</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Tên sản phẩm"
                  value={newProduct.name}
                  onChange={(e) => handleNewProductChange("name", e.target.value)}
                  fullWidth
                  sx={{ backgroundColor: "white" }}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    value={newProduct.category_id}
                    onChange={(e) => handleNewProductChange("category_id", e.target.value)}
                    onOpen={() => fetchCategoryList()}
                    sx={{ backgroundColor: "white", minWidth: 250 }}
                  >
                    {Array.isArray(categoryList) &&
                      categoryList.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Mô tả"
                  value={newProduct.description}
                  onChange={(e) => handleNewProductChange("description", e.target.value)}
                  fullWidth
                  sx={{ backgroundColor: "white" }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Ảnh (URL)"
                  value={newProduct.image}
                  onChange={(e) => handleNewProductChange("image", e.target.value)}
                  fullWidth
                  sx={{ backgroundColor: "white" }}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleCreateProduct}>
                Lưu sản phẩm
              </Button>
              <Button sx={{ ml: 2 }} onClick={() => setShowNewProductForm(false)}>
                Hủy
              </Button>
            </Box>
          </Box>
        )}
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Chi tiết nhập kho
        </Typography>
        {newIntake.details.map((detail, index) => (
          <Grid container spacing={1} key={detail.id} sx={{ mb: 2, alignItems: "center" }}>
            <Grid item xs={2}>
              <FormControl fullWidth>
                <InputLabel>Sản phẩm</InputLabel>
                <Select
                  value={detail.product_id || ""}
                  onChange={(e) => handleDetailChange(detail.id, "product_id", e.target.value)}
                  onOpen={() => {
                    fetchProducts();
                    fetchCategoryList();
                  }}
                  sx={{ backgroundColor: "white", minWidth: 200 }}
                >
                  {Array.isArray(productList) && productList.length > 0 ? (
                    productList.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Không có sản phẩm</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Danh mục"
                value={
                  categoryList.find((category) => category.id === detail.category_id)?.name || ""
                }
                fullWidth
                sx={{ backgroundColor: "white" }}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
                label="Số lượng"
                type="number"
                value={detail.quantity || ""}
                onChange={(e) => handleDetailChange(detail.id, "quantity", parseInt(e.target.value) || 0)}
                fullWidth
                sx={{ backgroundColor: "white" }}
                slotProps={{ input: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={1.5}>
              <TextField
                label="Giá nhập"
                type="number"
                value={detail.unit_price || ""}
                onChange={(e) => handleDetailChange(detail.id, "unit_price", parseFloat(e.target.value) || 0)}
                fullWidth
                sx={{ backgroundColor: "white" }}
                slotProps={{ input: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
                label="% Lợi nhuận"
                type="number"
                value={detail.profit_margin || ""}
                onChange={(e) => handleDetailChange(detail.id, "profit_margin", parseFloat(e.target.value) || 0)}
                fullWidth
                sx={{ backgroundColor: "white" }}
                slotProps={{ input: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth>
                <InputLabel>Cửa hàng</InputLabel>
                <Select
                  value={detail.store_id}
                  onChange={(e) => handleDetailChange(detail.id, "store_id", e.target.value)}
                  sx={{ backgroundColor: "white" }}
                >
                  {Array.isArray(stores) &&
                    stores.map((store) => (
                      <MenuItem key={store.id} value={store.id}>
                        {store.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={1.5}>
              <TextField
                label="Ngày nhập"
                type="date"
                value={detail.intake_date}
                onChange={(e) => handleDetailChange(detail.id, "intake_date", e.target.value)}
                fullWidth
                sx={{ backgroundColor: "white" }}
              />
            </Grid>
            <Grid item xs={1}>
              <FormControl fullWidth>
                <InputLabel>Nhà cung cấp</InputLabel>
                <Select
                  value={detail.supplier_id}
                  onChange={(e) => handleDetailChange(detail.id, "supplier_id", e.target.value)}
                  sx={{ backgroundColor: "white" }}
                >
                  {Array.isArray(suppliers) &&
                    suppliers.map((supplier) => (
                      <MenuItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={0.5}>
              <IconButton onClick={() => handleRemoveDetail(detail.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button onClick={handleAddDetail} startIcon={<AddIcon />}>
            Thêm sản phẩm
          </Button>
          <Button onClick={() => setShowNewProductForm(true)} startIcon={<AddIcon />}>
            Thêm sản phẩm mới
          </Button>
        </Box>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Tổng giá trị: {totalValue.toLocaleString("vi-VN")} VNĐ
        </Typography>
      </Box>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleCreate}>
          Tạo phiếu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStockIntake;