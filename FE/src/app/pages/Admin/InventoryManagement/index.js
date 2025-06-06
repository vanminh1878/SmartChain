import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchGet, fetchPost } from "../../../lib/httpHandler";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

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

export default function InventoryManagement() {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [stockIntakes, setStockIntakes] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newIntake, setNewIntake] = useState({
    supplier_id: "",
    store_id: "",
    intake_date: new Date().toISOString().split("T")[0],
    created_by: "11111111-2222-3333-4444-555555555555",
    details: [{ product_id: "", quantity: 0, unit_price: 0 }],
  });
  const [productSearchText, setProductSearchText] = useState("");
  const [intakeSearchText, setIntakeSearchText] = useState("");
  const [orderSearchText, setOrderSearchText] = useState("");

  const fetchStores = useCallback(() => {
    fetchGet(
      "/Stores",
      (res) => {
        const storeList = Array.isArray(res) ? res : [];
        setStores(storeList);
        if (storeList.length > 0) setSelectedStore(storeList[0].id);
      },
      (fail) => {
        toast.error("Lỗi khi lấy danh sách cửa hàng");
      },
      () => {
        toast.error("Có lỗi xảy ra khi lấy danh sách cửa hàng");
      }
    );
  }, []);

  const fetchProducts = useCallback(() => {
    if (!selectedStore) return;
    fetchGet(
      `/Products?store_id=${selectedStore}`,
      async (res) => {
        const productList = Array.isArray(res) ? res : [];
        if (!productList.length) {
          toast.error("Không có dữ liệu sản phẩm");
        }

        const validatedProducts = await Promise.all(
          productList.map(async (item, index) => {
            let categoryData = {};
            let supplierData = {};
            if (item.category_id) {
              try {
                await fetchGet(`/Categories/${item.category_id}`, (categoryRes) => {
                  categoryData = categoryRes;
                }, () => {}, () => {});
              } catch (error) {
                console.error(`Lỗi khi gọi API danh mục: ${error}`);
              }
            }
            if (item.id) {
              try {
                await fetchGet(
                  `/Product_Supplier?product_id=${item.id}`,
                  (supplierRes) => {
                    const supplier = suppliers.find((s) => s.id === supplierRes.supplier_id);
                    supplierData = supplier || {};
                  },
                  () => {},
                  () => {}
                );
              } catch (error) {
                console.error(`Lỗi khi gọi API nhà cung cấp: ${error}`);
              }
            }
            return {
              ...item,
              id: item.id || `temp-${Date.now()}-${index}`,
              category: categoryData.name || "Không xác định",
              supplier: supplierData.name || "Không xác định",
              store: stores.find((s) => s.id === item.store_id)?.name || "Không xác định",
              unit_price: item.unit_price || 0,
            };
          })
        );
        setProducts(validatedProducts);
      },
      (fail) => {
        toast.error("Lỗi khi lấy danh sách sản phẩm");
        setProducts([]);
      },
      () => {
        toast.error("Có lỗi xảy ra khi lấy danh sách sản phẩm");
      }
    );
  }, [selectedStore, stores, suppliers]);

  const fetchSuppliers = useCallback(() => {
    fetchGet(
      "/Suppliers",
      (res) => {
        const supplierList = Array.isArray(res) ? res : [];
        setSuppliers(supplierList);
      },
      (fail) => {
        toast.error("Lỗi khi lấy danh sách nhà cung cấp");
      },
      () => {
        toast.error("Có lỗi xảy ra khi lấy danh sách nhà cung cấp");
      }
    );
  }, []);

  const fetchStockIntakes = useCallback(() => {
    if (!selectedStore) return;
    fetchGet(
      `/Stock_Intake?store_id=${selectedStore}`,
      (res) => {
        const intakeList = Array.isArray(res) ? res : [];
        setStockIntakes(intakeList);
      },
      (fail) => {
        toast.error("Lỗi khi lấy danh sách phiếu nhập kho");
      },
      () => {
        toast.error("Có lỗi xảy ra khi lấy danh sách phiếu nhập kho");
      }
    );
  }, [selectedStore]);

  const fetchPurchaseOrders = useCallback(() => {
    if (!selectedStore) return;
    fetchGet(
      `/Stock_Intake?store_id=${selectedStore}&status=1`,
      async (res) => {
        const orderList = Array.isArray(res) ? res : [];
        const validatedOrders = await Promise.all(
          orderList.map(async (order) => {
            let totalValue = 0;
            await fetchGet(
              `/Stock_Intake_Detail?stock_intake_id=${order.id}`,
              (details) => {
                totalValue = details.reduce(
                  (sum, detail) => sum + detail.quantity * detail.unit_price,
                  0
                );
              },
              () => {},
              () => {}
            );
            return {
              ...order,
              total_value: totalValue,
              supplier: suppliers.find((s) => s.id === order.supplier_id)?.name || "Không xác định",
              store: stores.find((s) => s.id === order.store_id)?.name || "Không xác định",
            };
          })
        );
        setStockIntakes(validatedOrders);
      },
      (fail) => {
        toast.error("Lỗi khi lấy danh sách phiếu đặt hàng");
      },
      () => {
        toast.error("Có lỗi xảy ra khi lấy danh sách phiếu đặt hàng");
      }
    );
  }, [selectedStore, suppliers, stores]);

  const handleCreateIntake = useCallback(() => {
    if (!newIntake.supplier_id || !newIntake.store_id || !newIntake.details.every(d => d.product_id && d.quantity > 0 && d.unit_price > 0)) {
      toast.error("Vui lòng điền đầy đủ thông tin phiếu nhập kho");
      return;
    }
    fetchPost(
      "/Stock_Intake",
      newIntake,
      (res) => {
        toast.success("Tạo phiếu nhập kho thành công");
        setOpenDialog(false);
        fetchStockIntakes();
        fetchProducts();
      },
      (fail) => {
        toast.error("Lỗi khi tạo phiếu nhập kho");
      },
      () => {
        toast.error("Có lỗi xảy ra khi tạo phiếu nhập kho");
      }
    );
  }, [newIntake, fetchStockIntakes, fetchProducts]);

  const handleDetailChange = (index, field, value) => {
    setNewIntake((prev) => {
      const newDetails = [...prev.details];
      newDetails[index] = { ...newDetails[index], [field]: value };
      return { ...prev, details: newDetails };
    });
  };

  const handleAddDetail = () => {
    setNewIntake((prev) => ({
      ...prev,
      details: [...prev.details, { product_id: "", quantity: 0, unit_price: 0 }],
    }));
  };

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    if (!productSearchText.trim()) return products;
    const lowercasedSearch = productSearchText.toLowerCase();
    return products.filter((item) =>
      item.name?.toLowerCase().includes(lowercasedSearch)
    );
  }, [products, productSearchText]);

  const filteredStockIntakes = useMemo(() => {
    if (!Array.isArray(stockIntakes)) return [];
    if (!intakeSearchText.trim()) return stockIntakes;
    const lowercasedSearch = intakeSearchText.toLowerCase();
    return stockIntakes.filter((intake) => {
      const supplier = suppliers.find((s) => s.id === intake.supplier_id);
      return (
        supplier?.name?.toLowerCase().includes(lowercasedSearch) ||
        intake.intake_date.includes(lowercasedSearch)
      );
    });
  }, [stockIntakes, intakeSearchText, suppliers]);

  const filteredPurchaseOrders = useMemo(() => {
    if (!Array.isArray(stockIntakes)) return [];
    if (!orderSearchText.trim()) return stockIntakes.filter((i) => i.status === 1);
    const lowercasedSearch = orderSearchText.toLowerCase();
    return stockIntakes.filter((intake) => {
      const supplier = suppliers.find((s) => s.id === intake.supplier_id);
      return (
        intake.status === 1 &&
        (supplier?.name?.toLowerCase().includes(lowercasedSearch) ||
          intake.intake_date.includes(lowercasedSearch))
      );
    });
  }, [stockIntakes, orderSearchText, suppliers]);

  useEffect(() => {
    fetchStores();
    fetchSuppliers();
  }, [fetchStores, fetchSuppliers]);

  useEffect(() => {
    if (selectedStore) {
      fetchProducts();
      fetchStockIntakes();
      fetchPurchaseOrders();
    }
  }, [selectedStore, fetchProducts, fetchStockIntakes, fetchPurchaseOrders]);

  const productColumns = [
    { field: "index", headerName: "STT", width: 70, valueGetter: (params) => params.rowIndex + 1 },
    {
      field: "product",
      headerName: "Tên SP",
      width: 250,
      renderCell: (cellData) => <Product productName={cellData.row.name} />,
    },
    { field: "category", headerName: "Danh mục", width: 150 },
    { field: "supplier", headerName: "Nhà cung cấp", width: 200 },
    { field: "store", headerName: "Cửa hàng", width: 150 },
    {
      field: "unit_price",
      headerName: "Giá nhập",
      width: 120,
      valueGetter: (params) => `${(params.row.unit_price || 0).toFixed(2)} VNĐ`,
    },
    {
      field: "price",
      headerName: "Giá bán",
      width: 120,
      valueGetter: (params) => `${(params.row.price || 0).toFixed(2)} VNĐ`,
    },
    {
      field: "stock_quantity",
      headerName: "Tồn kho",
      width: 120,
      valueGetter: (params) => `${params.row.stock_quantity} cái`,
    },
  ];

  const intakeColumns = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "supplier",
      headerName: "Nhà cung cấp",
      width: 200,
      valueGetter: (params) => {
        const supplier = suppliers.find((s) => s.id === params.row.supplier_id);
        return supplier ? supplier.name : "Không xác định";
      },
    },
    { field: "intake_date", headerName: "Ngày nhập", width: 150 },
    {
      field: "created_by",
      headerName: "Người tạo",
      width: 150,
      valueGetter: (params) => `User ${params.row.created_by}`,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 120,
      valueGetter: (params) => (params.row.status === 0 ? "Chờ duyệt" : "Đã duyệt"),
    },
    {
      field: "approved_by",
      headerName: "Người phê duyệt",
      width: 150,
      valueGetter: (params) => (params.row.approved_by ? `User ${params.row.approved_by}` : "Chưa phê duyệt"),
    },
  ];

  const orderColumns = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "supplier",
      headerName: "Nhà cung cấp",
      width: 200,
      valueGetter: (params) => params.row.supplier,
    },
    {
      field: "store",
      headerName: "Cửa hàng",
      width: 150,
      valueGetter: (params) => params.row.store,
    },
    { field: "id", headerName: "ID Phiếu nhập", width: 100 },
    { field: "intake_date", headerName: "Ngày đặt hàng", width: 150 },
    {
      field: "total_value",
      headerName: "Tổng giá trị",
      width: 120,
      valueGetter: (params) => `${(params.row.total_value || 0).toFixed(2)} VNĐ`,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Cửa hàng</InputLabel>
        <Select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          sx={{ backgroundColor: "white" }}
        >
          {stores.map((store) => (
            <MenuItem key={store.id} value={store.id}>
              {store.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Danh sách sản phẩm của cửa hàng
      </Typography>
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Tạo phiếu nhập kho
        </Button>
      </Box>
      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0, mb: 4 }}
        rows={filteredProducts}
        columns={productColumns}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
      />

      <Typography variant="h5" sx={{ mb: 2 }}>
        Danh sách phiếu nhập kho
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          placeholder="Tìm kiếm theo nhà cung cấp"
          value={intakeSearchText}
          onChange={(e) => setIntakeSearchText(e.target.value)}
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
      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0, mb: 4 }}
        rows={filteredStockIntakes}
        columns={intakeColumns}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
      />

      <Typography variant="h5" sx={{ mb: 2 }}>
        Danh sách phiếu đặt hàng
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          placeholder="Tìm kiếm theo nhà cung cấp"
          value={orderSearchText}
          onChange={(e) => setOrderSearchText(e.target.value)}
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
      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
        rows={filteredPurchaseOrders}
        columns={orderColumns}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Tạo phiếu nhập kho mới</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Cửa hàng</InputLabel>
            <Select
              value={newIntake.store_id}
              onChange={(e) => setNewIntake({ ...newIntake, store_id: e.target.value })}
              sx={{ backgroundColor: "white" }}
            >
              {stores.map((store) => (
                <MenuItem key={store.id} value={store.id}>
                  {store.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Nhà cung cấp</InputLabel>
            <Select
              value={newIntake.supplier_id}
              onChange={(e) => setNewIntake({ ...newIntake, supplier_id: e.target.value })}
              sx={{ backgroundColor: "white" }}
            >
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Ngày nhập kho"
            type="date"
            value={newIntake.intake_date}
            onChange={(e) => setNewIntake({ ...newIntake, intake_date: e.target.value })}
            fullWidth
            sx={{ mt: 2, backgroundColor: "white" }}
          />
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
            Chi tiết nhập kho
          </Typography>
          {newIntake.details.map((detail, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Sản phẩm</InputLabel>
                  <Select
                    value={detail.product_id}
                    onChange={(e) => handleDetailChange(index, "product_id", e.target.value)}
                    sx={{ backgroundColor: "white" }}
                  >
                    {(Array.isArray(products) ? products : [])
                      .filter((p) => p.store_id === newIntake.store_id)
                      .map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Số lượng"
                  type="number"
                  value={detail.quantity}
                  onChange={(e) => handleDetailChange(index, "quantity", e.target.value)}
                  fullWidth
                  sx={{ backgroundColor: "white" }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Giá nhập (VNĐ)"
                  type="number"
                  value={detail.unit_price}
                  onChange={(e) => handleDetailChange(index, "unit_price", e.target.value)}
                  fullWidth
                  sx={{ backgroundColor: "white" }}
                />
              </Grid>
            </Grid>
          ))}
          <Button onClick={handleAddDetail} startIcon={<AddIcon />}>
            Thêm sản phẩm
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleCreateIntake}>
            Tạo phiếu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}