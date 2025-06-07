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
  const [purchaseOrders, setPurchaseOrders] = useState([]);
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
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const fetchStores = useCallback(() => {
    fetchGet(
      "/Stores",
      (res) => {
        console.log("Dữ liệu từ API /Stores:", res);
        const storeList = Array.isArray(res) ? res : [];
        setStores(storeList);
        if (storeList.length > 0) setSelectedStore(storeList[0].id);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách cửa hàng:", fail);
        toast.error("Lỗi khi lấy danh sách cửa hàng");
      },
      () => {
        console.error("Có lỗi xảy ra khi lấy danh sách cửa hàng");
        toast.error("Có lỗi xảy ra khi lấy danh sách cửa hàng");
      }
    );
  }, []);

  const fetchProducts = useCallback(() => {
    if (!selectedStore) return;
    setIsLoadingProducts(true);
    fetchGet(
      "/Inventory/Products",
      (res) => {
        console.log("Dữ liệu từ API /Inventory/Products:", res);
        const productList = Array.isArray(res) ? res : [];
        if (!productList.length) {
          toast.error("Không có dữ liệu sản phẩm");
          setProducts([]);
          setIsLoadingProducts(false);
          return;
        }

        const validatedProducts = productList
          .filter((item) => item && typeof item === "object" && item.productId && item.storeId === selectedStore)
          .map((item) => ({
            id: item.productId, // Sử dụng productId làm id
            name: item.tenSanPham || "Không xác định",
            category: item.danhMuc || "Không xác định",
            supplier: item.nhaCungCap || "Không xác định",
            store: item.cuaHang || "Không xác định",
            unit_price: Number(item.giaNhap) || 0,
            price: Number(item.giaBan) || 0,
            stock_quantity: Number(item.tonKho) || 0,
          }));

        console.log("Dữ liệu sản phẩm sau ánh xạ:", validatedProducts);
        setProducts(validatedProducts);
        setIsLoadingProducts(false);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách sản phẩm:", fail);
        toast.error("Lỗi khi lấy danh sách sản phẩm");
        setProducts([]);
        setIsLoadingProducts(false);
      },
      () => {
        console.error("Có lỗi xảy ra khi lấy danh sách sản phẩm");
        toast.error("Có lỗi xảy ra khi lấy danh sách sản phẩm");
        setIsLoadingProducts(false);
      }
    );
  }, [selectedStore]);

  const fetchSuppliers = useCallback(() => {
    fetchGet(
      "/Suppliers",
      (res) => {
        console.log("Dữ liệu từ API /Suppliers:", res);
        const supplierList = Array.isArray(res) ? res : [];
        setSuppliers(supplierList);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách nhà cung cấp:", fail);
        toast.error("Lỗi khi lấy danh sách nhà cung cấp");
      },
      () => {
        console.error("Có lỗi xảy ra khi lấy danh sách nhà cung cấp");
        toast.error("Có lỗi xảy ra khi lấy danh sách nhà cung cấp");
      }
    );
  }, []);

  const fetchStockIntakes = useCallback(() => {
    console.log("Fetching stock intakes for store:", selectedStore);
    if (!selectedStore) return;
    fetchGet(
      `/Inventory/StockIntakes/${selectedStore}`,
      (res) => {
        console.log("Dữ liệu từ API /StockIntake:", res);
        const intakeList = Array.isArray(res) ? res : [];
        setStockIntakes(intakeList);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách phiếu nhập kho:", fail);
        toast.error("Lỗi khi lấy danh sách phiếu nhập kho");
      },
      () => {
        console.error("Có lỗi xảy ra khi lấy danh sách phiếu nhập kho");
        toast.error("Có lỗi xảy ra khi lấy danh sách phiếu nhập kho");
      }
    );
  }, [selectedStore]);

    const fetchPurchaseOrders = useCallback(() => {
    console.log("Fetching PurchaseOrders for store:", selectedStore);
    if (!selectedStore) return;
    fetchGet(
      `/Inventory/PurchaseOrders`,
      (res) => {
        console.log("Dữ liệu từ API /PurchaseOrders:", res);
        const intakeList = Array.isArray(res) ? res : [];
        setPurchaseOrders(intakeList);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách phiếu nhập kho:", fail);
        toast.error("Lỗi khi lấy danh sách phiếu nhập kho");
      },
      () => {
        console.error("Có lỗi xảy ra khi lấy danh sách phiếu nhập kho");
        toast.error("Có lỗi xảy ra khi lấy danh sách phiếu nhập kho");
      }
    );
  }, []);

  // const fetchPurchaseOrders = useCallback(() => {
  //   if (!selectedStore) return;
  //   fetchGet(
  //     `/Stock_Intake?store_id=${selectedStore}&status=1`,
  //     async (res) => {
  //       console.log("Dữ liệu từ API /Stock_Intake (Purchase Orders):", res);
  //       const orderList = Array.isArray(res) ? res : [];
  //       const validatedOrders = await Promise.all(
  //         orderList.map(async (order) => {
  //           let totalValue = 0;
  //           await fetchGet(
  //             `/Stock_Intake_Detail?stock_intake_id=${order.id}`,
  //             (details) => {
  //               console.log(`Dữ liệu chi tiết phiếu nhập ${order.id}:`, details);
  //               totalValue = details.reduce(
  //                 (sum, detail) => sum + (Number(detail.quantity) || 0) * (Number(detail.unit_price) || 0),
  //                 0
  //               );
  //             },
  //             (fail) => {
  //               console.error(`Lỗi khi lấy chi tiết phiếu nhập ${order.id}:`, fail);
  //             },
  //             () => {}
  //           );
  //           return {
  //             ...order,
  //             total_value: totalValue,
  //             supplier: suppliers.find((s) => s.id === order.supplier_id)?.name || "Không xác định",
  //             store: stores.find((s) => s.id === order.store_id)?.name || "Không xác định",
  //           };
  //         })
  //       );
  //       console.log("Dữ liệu phiếu đặt hàng sau ánh xạ:", validatedOrders);
  //       setStockIntakes(validatedOrders);
  //     },
  //     (fail) => {
  //       console.error("Lỗi khi lấy danh sách phiếu đặt hàng:", fail);
  //       toast.error("Lỗi khi lấy danh sách phiếu đặt hàng");
  //     },
  //     () => {
  //       console.error("Có lỗi xảy ra khi lấy danh sách phiếu đặt hàng");
  //       toast.error("Có lỗi xảy ra khi lấy danh sách phiếu đặt hàng");
  //     }
  //   );
  // }, [selectedStore, suppliers, stores]);

  const handleCreateIntake = useCallback(() => {
    if (
      !newIntake.supplier_id ||
      !newIntake.store_id ||
      !newIntake.details.every((d) => d.product_id && d.quantity > 0 && d.unit_price > 0)
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin phiếu nhập kho");
      return;
    }
    fetchPost(
      "/StockIntakes",
      newIntake,
      (res) => {
        console.log("Kết quả tạo phiếu nhập kho:", res);
        toast.success("Tạo phiếu nhập kho thành công");
        setOpenDialog(false);
        fetchStockIntakes();
        fetchProducts();
      },
      (fail) => {
        console.error("Lỗi khi tạo phiếu nhập kho:", fail);
        toast.error("Lỗi khi tạo phiếu nhập kho");
      },
      () => {
        console.error("Có lỗi xảy ra khi tạo phiếu nhập kho");
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
    const validProducts = products.filter((item) => item && item.id && typeof item === "object");
    if (!productSearchText.trim()) return validProducts;
    const lowercasedSearch = productSearchText.toLowerCase();
    return validProducts.filter(
      (item) => item.name?.toLowerCase().includes(lowercasedSearch)
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
        intake.intake_date?.includes(lowercasedSearch)
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
          intake.intake_date?.includes(lowercasedSearch))
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
    // {
    //   field: "index",
    //   headerName: "STT",
    //   width: 70,
    //   valueGetter: (params) => {
    //     console.log("Params for index:", params);
    //     if (!params || !params.row || !params.row.id) return "-";
    //     const index = params.api.getRowIndexRelativeToVisibleRows(params.row.id);
    //     return index >= 0 ? index + 1 : "-";
    //   },
    // },
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
      field: "unit_price",
      headerName: "Giá nhập",
      width: 120,
      valueGetter: (params) => {
      //console.log("Params for unit_price:", params);
      const value = typeof params === "number" ? params : params.row?.unit_price || 0;
      return `${value.toLocaleString("vi-VN")} VNĐ`;
    },
    },
    {
      field: "price",
      headerName: "Giá bán",
      width: 120,
      valueGetter: (params) => {
        //console.log("Params for price:", params);
        const value = typeof params === "number" ? params : params.row?.price || 0;
        return `${value.toLocaleString("vi-VN")} VNĐ`;
      }
    },
    {
      field: "stock_quantity",
      headerName: "Tồn kho",
      width: 120,
      valueGetter: (params) => {
      //console.log("Params for stock_quantity:", params);
      const value = typeof params === "number" ? params : params.row?.stock_quantity || 0;
      return `${value} cái`;
    },
    },
  ];
  
  // const intakeColumns = [
  //   { field: "id", headerName: "ID", width: 100 },
  //   {
  //     field: "supplier",
  //     headerName: "Nhà cung cấp",
  //     width: 200,
  //     valueGetter: (params) => {
  //       const supplier = suppliers.find((s) => s.id === params.row?.supplier_id);
  //       return supplier?.name || "Không xác định";
  //     },
  //   },
  //   { field: "intake_date", headerName: "Ngày nhập", width: 150 },
  //   {
  //     field: "created_by",
  //     headerName: "Người tạo",
  //     width: 150,
  //     valueGetter: (params) => `User ${params.row?.created_by || "Không xác định"}`,
  //   },
  //   {
  //     field: "status",
  //     headerName: "Trạng thái",
  //     width: 120,
  //     valueGetter: (params) => (params.row?.status === 0 ? "Chờ duyệt" : "Đã duyệt"),
  //   },
  //   {
  //     field: "approved_by",
  //     headerName: "Người phê duyệt",
  //     width: 150,
  //     valueGetter: (params) =>
  //       params.row?.approved_by ? `User ${params.row.approved_by}` : "Chưa phê duyệt",
  //   },
  // ];
  const intakeColumns = [
      { field: "stockIntakeId", headerName: "ID", width: 100 },
      { field: "supplier", headerName: "Nhà cung cấp", width: 200 },
      { field: "intakeDate", headerName: "Ngày nhập", width: 150 },
      { field: "created_By_Name", headerName: "Người tạo", width: 150 },
      { field: "status", headerName: "Trạng thái", width: 120 },
      { field: "approved_By_Name", headerName: "Người phê duyệt", width: 150 },
    ];
  // const orderColumns = [
  //   { field: "id", headerName: "ID", width: 100 },
  //   {
  //     field: "supplier",
  //     headerName: "Nhà cung cấp",
  //     width: 200,
  //     valueGetter: (params) => params.row?.supplier || "Không xác định",
  //   },
  //   {
  //     field: "store",
  //     headerName: "Cửa hàng",
  //     width: 150,
  //     valueGetter: (params) => params.row?.store || "Không xác định",
  //   },
  //   { field: "intake_date", headerName: "Ngày đặt hàng", width: 150 },
  //   {
  //     field: "total_value",
  //     headerName: "Tổng giá trị",
  //     width: 120,
  //     valueGetter: (params) => `${(params.row?.total_value ?? 0).toFixed(2)} VNĐ`,
  //   },
  // ];
  const orderColumns = [
      { field: "stockIntakeId", headerName: "ID", width: 100 },
      { field: "supplier", headerName: "Nhà cung cấp", width: 200 },
      { field: "intakeDate", headerName: "Ngày nhập", width: 150 },
      { field: "created_By_Name", headerName: "Người tạo", width: 150 },
      { field: "status", headerName: "Trạng thái", width: 120 },
      { field: "approved_By_Name", headerName: "Người phê duyệt", width: 150 },
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
      {isLoadingProducts ? (
        <Typography>Đang tải dữ liệu sản phẩm...</Typography>
      ) : (
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
      )}

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
        getRowId={(row) => row.stockIntakeId}
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
                      .filter((p) => p.store === newIntake.store_id)
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
                  onChange={(e) => handleDetailChange(index, "quantity", parseInt(e.target.value) || 0)}
                  fullWidth
                  sx={{ backgroundColor: "white" }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Giá nhập (VNĐ)"
                  type="number"
                  value={detail.unit_price}
                  onChange={(e) => handleDetailChange(index, "unit_price", parseFloat(e.target.value) || 0)}
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