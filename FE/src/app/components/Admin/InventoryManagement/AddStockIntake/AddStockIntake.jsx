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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchGet, fetchPost } from "../../../../lib/httpHandler";

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

  // Fetch thông tin người dùng
  useEffect(() => {
  fetchGet(
    "/users/profile",
    (res) => {
      console.log("Dữ liệu người dùng:", res);
      setUserFullname(res.fullname || "Không xác định");
      setNewIntake((prev) => {
        const updatedIntake = {
          ...prev,
          created_by: res.userId || prev.created_by || "Không xác định",
        };
        return updatedIntake;
      });
    },
    (fail) => {
      toast.error(fail.message || "Không thể tải thông tin cá nhân");
    },
    () => {
      toast.error("Có lỗi xảy ra khi tải thông tin");
    }
  );
}, []);

  const fetchProductList = useCallback(() => {
    if (productList.length === 0) {
      fetchGet(
        "/Inventory/ListProducts",
        (res) => {
          console.log("Danh sách sản phẩm đã được tải thành công", res);
          setProductList(Array.isArray(res) ? res : []);
        },
        (fail) => {
          console.error("Lỗi khi tải danh sách sản phẩm", fail);
          toast.error("Không thể tải danh sách sản phẩm");
        },
        () => {
          console.log("Có lỗi xảy ra khi tải danh sách sản phẩm");
          toast.error("Có lỗi xảy ra khi tải danh sách sản phẩm");
        }
      );
    }
  }, [productList]);

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
        },
        () => {
          console.log("Có lỗi xảy ra khi tải danh sách danh mục");
          toast.error("Có lỗi xảy ra khi tải danh sách danh mục");
        }
      );
    }
  }, [categoryList]);

  const totalValue = useMemo(() => {
    return newIntake.details.reduce((sum, detail) => sum + (detail.quantity * detail.unit_price || 0), 0);
  }, [newIntake.details]);

  const filteredProducts = useMemo(() => {
    return Array.isArray(products) ? products.filter((p) => p.store_id === selectedStoreId) : [];
  }, [products, selectedStoreId]);

  const productColumns = [
    {
      field: "name",
      headerName: "Tên SP",
      width: 200,
      valueGetter: (params) => params.row?.name || "Không xác định",
    },
    {
      field: "category",
      headerName: "Danh mục",
      width: 150,
      valueGetter: (params) => {
        if (!params.row?.category_id) return "Không xác định";
        const category = categories?.find((c) => c.id === params.row.category_id);
        return category?.name || "Không xác định";
      },
    },
    {
      field: "supplier",
      headerName: "Nhà cung cấp",
      width: 200,
      valueGetter: (params) => {
        if (!params.row || !newIntake.details[0]?.supplier_id) return "Không xác định";
        const productSupplier = params.row.suppliers?.find((ps) => ps.supplier_id === newIntake.details[0]?.supplier_id);
        const supplier = suppliers?.find((s) => s.id === productSupplier?.supplier_id);
        return supplier?.name || "Không xác định";
      },
    },
    {
      field: "store",
      headerName: "Cửa hàng",
      width: 150,
      valueGetter: (params) => {
        if (!params.row?.store_id) return "Không xác định";
        const store = stores?.find((s) => s.id === params.row.store_id);
        return store?.name || "Không xác định";
      },
    },
    {
      field: "unit_price",
      headerName: "Giá nhập",
      width: 120,
      valueGetter: (params) => {
        if (!params.row || !newIntake.details[0]?.supplier_id) return "0 VNĐ";
        const productSupplier = params.row.suppliers?.find((ps) => ps.supplier_id === newIntake.details[0]?.supplier_id);
        return productSupplier?.unit_price ? `${productSupplier.unit_price.toLocaleString("vi-VN")} VNĐ` : "0 VNĐ";
      },
    },
    {
      field: "price",
      headerName: "Giá bán",
      width: 120,
      valueGetter: (params) => `${params.row?.price?.toLocaleString("vi-VN") || 0} VNĐ`,
    },
    {
      field: "stock_quantity",
      headerName: "Tồn kho",
      width: 120,
      valueGetter: (params) => `${params.row?.stock_quantity || 0} cái`,
    },
  ];

  const handleDetailChange = (id, field, value) => {
    setNewIntake((prev) => {
      const newDetails = prev.details.map((detail) => {
        if (detail.id === id) {
          const updatedDetail = { ...detail, [field]: value };
          if (field === "product_id") {
            const selectedProduct = productList.find((p) => p.id === value);
            updatedDetail.category_id = selectedProduct?.categoryId || "";
          }
          return updatedDetail;
        }
        return detail;
      });
      return { ...prev, details: newDetails };
    });
  };

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

  const handleNewProductChange = (field, value) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
  };

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
        setProductList((prev) => [...prev, createdProduct]);
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
    // Bước 1: Tạo StockIntake
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

    // Bước 2: Tạo StockIntakeDetails
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
        "/Inventory/StockIntakeDetails", // Kiểm tra endpoint
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
    console.log("onCreateIntake called with:", stockIntakeResponse);
    onClose();
  } catch (error) {
    console.error("Lỗi khi tạo phiếu nhập kho:", error);
    toast.error(error.message || "Có lỗi xảy ra khi tạo phiếu nhập kho");
  }
};

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
                        fetchProductList();
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